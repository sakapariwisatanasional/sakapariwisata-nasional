import { Member, TourPackage, CulinarySouvenirItem, CurrentUser, UserRole } from '../types';
import { storage } from './storage';

export const DEFAULT_SPREADSHEET_ID = '1r3Lve_Rd1D4QqSP_ViCNzSZrIamJXEWh0lXSkU-EO8E';
export const DEFAULT_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit?usp=sharing`;

const SPREADSHEET_CONFIG_KEY = 'saka_spreadsheet_config_v1';

export interface SpreadsheetConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  scriptUrl?: string; // Optional Google Apps Script Web App URL for direct POST writes
  lastSyncedAt?: string;
  autoSync: boolean;
  status: 'CONNECTED' | 'SYNCING' | 'ERROR' | 'IDLE';
  lastError?: string;
}

export interface SpreadsheetRowMember {
  id?: string;
  nomor_kta?: string;
  nama_lengkap?: string;
  nik?: string;
  jenis_kelamin?: string;
  email?: string;
  nomor_wa?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan_ranting?: string;
  gudep?: string;
  krida?: string;
  tingkat_skk?: string;
  status?: string;
  foto_url?: string;
  tanggal_daftar?: string;
}

class SpreadsheetService {
  private config: SpreadsheetConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): SpreadsheetConfig {
    try {
      const raw = localStorage.getItem(SPREADSHEET_CONFIG_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load spreadsheet config', e);
    }

    return {
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      spreadsheetUrl: DEFAULT_SPREADSHEET_URL,
      scriptUrl: '',
      autoSync: false,
      status: 'CONNECTED'
    };
  }

  public saveConfig(updates: Partial<SpreadsheetConfig>): SpreadsheetConfig {
    this.config = { ...this.config, ...updates };
    localStorage.setItem(SPREADSHEET_CONFIG_KEY, JSON.stringify(this.config));
    return this.config;
  }

  public getConfig(): SpreadsheetConfig {
    return { ...this.config };
  }

  /**
   * Mengambil data mentah baris dari Google Spreadsheet menggunakan Google Visualization API
   */
  public async fetchSheetRows(sheetName: string = 'Anggota'): Promise<Record<string, any>[]> {
    const spreadsheetId = this.config.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    
    // 1. Coba Google Visualization Table Query API (format JSONP / out:json)
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    
    try {
      const response = await fetch(gvizUrl);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      
      // Google Visualization mengembalikan format: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.substring(jsonStart, jsonEnd + 1);
        const data = JSON.parse(jsonStr);
        
        if (data.table && data.table.cols && data.table.rows) {
          const cols: string[] = data.table.cols.map((col: any, idx: number) => {
            return (col.label && col.label.trim()) || `col_${idx}`;
          });

          const results = data.table.rows.map((row: any) => {
            const item: Record<string, any> = {};
            if (row.c) {
              row.c.forEach((cell: any, idx: number) => {
                const key = cols[idx] || `col_${idx}`;
                item[key] = cell ? (cell.v !== null ? cell.v : cell.f || '') : '';
              });
            }
            return item;
          });

          return results;
        }
      }
    } catch (err: any) {
      console.warn(`GVIZ fetch failed for sheet "${sheetName}", trying CSV fallback:`, err.message);
    }

    // 2. Fallback: Coba CSV Export URL
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&sheet=${encodeURIComponent(sheetName)}`;
      const response = await fetch(csvUrl);
      if (response.ok) {
        const csvText = await response.text();
        return this.parseCSV(csvText);
      }
    } catch (csvErr: any) {
      console.error('CSV fetch failed:', csvErr);
    }

    return [];
  }

  /**
   * Parser CSV sederhana untuk spreadsheet
   */
  private parseCSV(csv: string): Record<string, any>[] {
    const lines = csv.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];

    const headers = this.parseCSVLine(lines[0]);
    const results: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index] !== undefined ? values[index].trim() : '';
      });
      results.push(obj);
    }

    return results;
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          currentValue += '"';
          i++; // skip escaped quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue);
    return values;
  }

  /**
   * Tarik data dari Google Spreadsheet dan perbarui state aplikasi
   */
  public async syncFromSpreadsheet(): Promise<{ success: boolean; count: number; message: string }> {
    this.saveConfig({ status: 'SYNCING' });

    try {
      const rows = await this.fetchSheetRows('Anggota');
      
      if (rows && rows.length > 0) {
        const existingMembers = storage.getMembers();
        const existingUsers = storage.getUsers();
        let addedCount = 0;

        const parseRole = (roleStr?: string): UserRole => {
          if (!roleStr) return 'MEMBER';
          const r = roleStr.toUpperCase().replace(/\s+/g, '_');
          if (r.includes('SUPER') || r.includes('NASIONAL') || r.includes('PIMPINAN_NASIONAL') || r === 'SUPER_ADMIN') {
            return 'SUPER_ADMIN';
          }
          if (r.includes('KWARDA') || r.includes('PROVINSI') || r === 'ADMIN_PROVINCE') {
            return 'ADMIN_PROVINCE';
          }
          if (r.includes('KWARCAB') || r.includes('KABUPATEN') || r.includes('KOTA') || r === 'ADMIN_REGENCY') {
            return 'ADMIN_REGENCY';
          }
          if (r.includes('KWARRAN') || r.includes('RANTING') || r.includes('KECAMATAN') || r === 'ADMIN_BRANCH') {
            return 'ADMIN_BRANCH';
          }
          return 'MEMBER';
        };

        // Petakan baris spreadsheet ke model Member
        const importedMembers: Member[] = rows.map((row, idx) => {
          const fullName = row['Nama Lengkap'] || row['nama_lengkap'] || row['Nama'] || row['col_1'] || `Anggota ${idx + 1}`;
          const kta = row['Nomor Anggota'] || row['Nomor KTA'] || row['nomor_kta'] || row['col_0'] || '';
          const province = row['Provinsi'] || row['Kwarda'] || row['provinsi'] || 'DKI Jakarta';
          const regency = row['Kabupaten/Kota'] || row['Kwarcab'] || row['kabupaten'] || 'Jakarta Selatan';
          const branch = row['Kwartir Ranting'] || row['Kwarran'] || row['kecamatan_ranting'] || 'Kwarran Kebayoran Baru';
          const krida = row['Krida'] || row['krida'] || 'Krida Pemandu';
          const gudep = row['Gugus Depan'] || row['Gudep'] || row['gudep'] || 'Gudep 01.001';
          const email = row['Email'] || row['email'] || `member${idx + 1}@pramuka.id`;
          const phone = row['Nomor WA'] || row['No WhatsApp'] || row['Telepon'] || row['col_4'] || '081234567890';
          const status = (row['Status'] || row['status'] || 'ACTIVE').toUpperCase();
          const avatarUrl = row['Foto URL'] || row['foto_url'] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80';
          const roleRaw = row['Role'] || row['Peran'] || row['Jabatan'] || row['Hak Akses'] || row['Wewenang'] || '';
          const role = parseRole(roleRaw);

          const memberId = row['ID'] || row['id'] || `sheet-member-${Date.now()}-${idx}`;

          return {
            id: memberId,
            userId: `user-${memberId}`,
            nationalMemberNumber: kta || undefined,
            fullName,
            nikMasked: '3201**********01',
            avatarUrl,
            gender: 'LAKI_LAKI',
            birthPlace: 'Indonesia',
            birthDate: '2000-01-01',
            email,
            phone,
            address: `${branch}, ${regency}, ${province}`,
            provinceId: '31',
            provinceName: province,
            regencyId: '31.71',
            regencyName: regency,
            districtId: '31.71.01',
            districtName: branch,
            branchId: `branch-${idx}`,
            branchName: branch,
            gugusDepan: gudep,
            currentPosition: `Anggota ${krida}`,
            krida: krida as any,
            joinYear: new Date().getFullYear(),
            educationLevel: 'SMA/SMK',
            occupation: 'Anggota Pramuka',
            bio: `Anggota Saka Pariwisata ${province}. Terdaftar dari Google Spreadsheet.`,
            status: status === 'ACTIVE' || status === 'PENDING' ? status : 'ACTIVE',
            registeredAt: new Date().toISOString(),
            verificationToken: `VERIFY-SP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            isOperator: role !== 'MEMBER',
            operatorRole: role !== 'MEMBER' ? role : undefined,
            operatorJurisdictionName: role === 'ADMIN_PROVINCE' ? province : role === 'ADMIN_REGENCY' ? regency : role === 'ADMIN_BRANCH' ? branch : undefined,
            skills: [],
            certifications: [],
            locationHistory: []
          };
        });

        // Simpan ke storage jika ada data valid
        if (importedMembers.length > 0) {
          // Gabungkan dengan anggota yang sudah ada (hindari duplikat ID/KTA)
          const merged = [...existingMembers];
          const mergedUsers = [...existingUsers];

          importedMembers.forEach((newM, idx) => {
            const rawRow = rows[idx] || {};
            const password = rawRow['Password'] || rawRow['Kata Sandi'] || rawRow['Kata_Sandi'] || rawRow['password'] || '';
            const username = rawRow['Username'] || rawRow['username'] || newM.email.split('@')[0];
            const parsedRole = newM.operatorRole || (parseRole(rawRow['Role'] || rawRow['Peran']) || 'MEMBER');

            const exists = merged.some(m => (newM.nationalMemberNumber && m.nationalMemberNumber === newM.nationalMemberNumber) || m.id === newM.id);
            if (!exists) {
              merged.push(newM);
              addedCount++;
            }

            // Sync User record for login
            const userIdx = mergedUsers.findIndex(u => u.email === newM.email || (u.memberId && u.memberId === newM.id) || (u.username && u.username === username));
            const userObj: CurrentUser = {
              id: newM.userId,
              username: username,
              password: password || undefined,
              email: newM.email,
              name: newM.fullName,
              role: parsedRole,
              jurisdictionName: parsedRole === 'SUPER_ADMIN' ? 'Kwartir Nasional' : `${newM.branchName}, ${newM.regencyName}`,
              jurisdictionId: newM.regencyId,
              avatarUrl: newM.avatarUrl,
              memberId: newM.id
            };

            if (userIdx !== -1) {
              mergedUsers[userIdx] = { ...mergedUsers[userIdx], ...userObj };
            } else {
              mergedUsers.push(userObj);
            }
          });

          storage.setMembers(merged);
          storage.setUsers(mergedUsers);
        }

        const successMsg = `Berhasil menyinkronkan database spreadsheet. ${rows.length} data baris terbaca (${addedCount} data baru ditambahkan).`;
        this.saveConfig({
          lastSyncedAt: new Date().toISOString(),
          status: 'CONNECTED',
          lastError: undefined
        });

        return { success: true, count: rows.length, message: successMsg };
      }

      this.saveConfig({
        lastSyncedAt: new Date().toISOString(),
        status: 'CONNECTED',
        lastError: undefined
      });

      return { 
        success: true, 
        count: 0, 
        message: 'Spreadsheet terhubung. Tidak ada baris baru yang perlu ditambahkan.' 
      };
    } catch (err: any) {
      console.error('Sync failed:', err);
      this.saveConfig({
        status: 'ERROR',
        lastError: err.message || 'Gagal menyinkronkan data dari spreadsheet.'
      });
      return { success: false, count: 0, message: err.message || 'Gagal membaca spreadsheet.' };
    }
  }

  /**
   * Kirim data anggota baru ke Google Spreadsheet melalui Google Apps Script Web App
   */
  public async appendMemberToSpreadsheet(member: Member): Promise<{ success: boolean; message: string }> {
    const scriptUrl = this.config.scriptUrl;

    if (!scriptUrl) {
      // Jika Apps Script belum disetel, simpan ke lokal dan sediakan format ekspor
      return {
        success: true,
        message: 'Data tersimpan di database lokal. Untuk sinkronisasi otomatis ke Google Spreadsheet, masukkan Web App URL di Pengaturan Database.'
      };
    }

    try {
      const payload = {
        sheet: 'Anggota',
        rowData: [
          member.id,
          member.nationalMemberNumber || '',
          member.fullName,
          member.email,
          member.phone,
          member.provinceName,
          member.regencyName,
          member.branchName,
          member.gugusDepan,
          member.krida || '',
          member.status,
          member.avatarUrl,
          member.registeredAt,
          window.location.origin + '/?verifyId=' + (member.nationalMemberNumber || member.id)
        ]
      };

      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script web app standard CORS bypass
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        message: 'Data anggota berhasil dikirimkan ke Google Spreadsheet.'
      };
    } catch (err: any) {
      console.error('Failed to append row to spreadsheet', err);
      return {
        success: false,
        message: 'Gagal mengirim ke spreadsheet: ' + err.message
      };
    }
  }

  /**
   * Hasilkan Template Script Google Apps Script yang siap di-copy-paste oleh user
   */
  public getGoogleAppsScriptTemplate(): string {
    return `// ============================================================
// GOOGLE APPS SCRIPT: API DATABASE SAKA PARIWISATA INDONESIA
// ============================================================
// Cara Pasang:
// 1. Di Google Sheets, klik menu "Extensions" > "Apps Script".
// 2. Hapus semua kode yang ada, lalu tempelkan kode di bawah ini.
// 3. Klik tombol "Deploy" (Terapkan) > "New deployment" (Penerapan Baru).
// 4. Pilih jenis "Web app" (Aplikasi Web).
// 5. Atur "Execute as: Me" dan "Who has access: Anyone (Siapa saja)".
// 6. Klik "Deploy", salin URL Web App dan tempelkan ke Pengaturan Aplikasi Saka.
// ============================================================

function doGet(e) {
  var sheetName = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : "Anggota";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet tidak ditemukan" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var headers = data[0];
  var rows = data.slice(1);
  
  var result = rows.map(function(row) {
    var item = {};
    headers.forEach(function(header, idx) {
      item[header] = row[idx];
    });
    return item;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheetName = body.sheet || "Anggota";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    if (body.action === "DELETE") {
      var memberId = body.memberId;
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == memberId || data[i][1] == memberId) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Baris berhasil dihapus" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Tambah baris baru
    sheet.appendRow(body.rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan ke Google Sheets" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
  }
}

export const spreadsheetService = new SpreadsheetService();
