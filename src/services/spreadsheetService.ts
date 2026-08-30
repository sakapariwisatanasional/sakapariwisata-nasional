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
  private isPushing = false;
  private isSettingUp = false;
  private isSyncing = false;

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
    if (this.isSyncing) {
      return { success: false, count: 0, message: 'Proses sinkronisasi sedang berjalan...' };
    }

    this.isSyncing = true;
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
          const avatarUrl = row['Foto URL'] || row['foto_url'] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80';
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
          // Gabungkan dengan anggota yang sudah ada (hindari duplikat ID, KTA, atau Email)
          const merged = [...existingMembers];
          const mergedUsers = [...existingUsers];

          importedMembers.forEach((newM, idx) => {
            const rawRow = rows[idx] || {};
            const password = rawRow['Password'] || rawRow['Kata Sandi'] || rawRow['Kata_Sandi'] || rawRow['password'] || '';
            const username = rawRow['Username'] || rawRow['username'] || newM.email.split('@')[0];
            const parsedRole = newM.operatorRole || (parseRole(rawRow['Role'] || rawRow['Peran']) || 'MEMBER');

            const exists = merged.some(m => 
              (newM.nationalMemberNumber && m.nationalMemberNumber === newM.nationalMemberNumber) || 
              m.id === newM.id ||
              (newM.email && m.email && m.email.toLowerCase().trim() === newM.email.toLowerCase().trim())
            );
            if (!exists) {
              merged.push(newM);
              addedCount++;
            }

            // Sync User record for login
            const userIdx = mergedUsers.findIndex(u => 
              (newM.email && u.email && u.email.toLowerCase().trim() === newM.email.toLowerCase().trim()) || 
              (u.memberId && u.memberId === newM.id) || 
              (u.username && u.username === username)
            );
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
          storage.deduplicateDatabase();
        }

        const successMsg = `Berhasil menyinkronkan database spreadsheet. ${rows.length} data baris terbaca (${addedCount} data baru ditambahkan).`;
        this.saveConfig({
          lastSyncedAt: new Date().toISOString(),
          status: 'CONNECTED',
          lastError: undefined
        });

        this.isSyncing = false;
        return { success: true, count: rows.length, message: successMsg };
      }

      this.saveConfig({
        lastSyncedAt: new Date().toISOString(),
        status: 'CONNECTED',
        lastError: undefined
      });

      this.isSyncing = false;
      return { 
        success: true, 
        count: 0, 
        message: 'Spreadsheet terhubung. Tidak ada baris baru yang perlu ditambahkan.' 
      };
    } catch (err: any) {
      this.isSyncing = false;
      console.error('Sync failed:', err);
      this.saveConfig({
        status: 'ERROR',
        lastError: err.message || 'Gagal terhubung ke Google Spreadsheet'
      });
      return {
        success: false,
        count: 0,
        message: `Gagal sinkronisasi: ${err.message || 'Periksa apakah ID Spreadsheet dan nama sheet sudah benar.'}`
      };
    }
  }

  /**
   * Kirim data anggota baru ke Google Spreadsheet melalui Google Apps Script Web App
   */
  public async appendMemberToSpreadsheet(member: Member): Promise<{ success: boolean; message: string }> {
    const scriptUrl = this.config.scriptUrl;

    if (!scriptUrl) {
      return {
        success: true,
        message: 'Data tersimpan di database lokal. Untuk sinkronisasi otomatis ke Google Spreadsheet, masukkan Web App URL di Pengaturan Database.'
      };
    }

    try {
      const payload = {
        action: 'UPSERT_MEMBER',
        sheet: 'Anggota',
        memberId: member.id,
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

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
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
   * Kirim data paket wisata ke Google Spreadsheet
   */
  public async appendTourToSpreadsheet(tour: TourPackage): Promise<{ success: boolean; message: string }> {
    const scriptUrl = this.config.scriptUrl;
    if (!scriptUrl) return { success: true, message: 'Tersimpan secara lokal.' };

    try {
      const payload = {
        action: 'UPSERT_TOUR',
        sheet: 'Paket_Wisata',
        itemId: tour.id,
        rowData: [
          tour.id,
          tour.title,
          tour.category,
          tour.pricePerPerson,
          tour.durationDays,
          tour.locationAddress,
          tour.provinceName,
          tour.regencyName,
          tour.ownerName,
          tour.contactPhone,
          tour.coverImage || '',
          new Date().toISOString()
        ]
      };

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return { success: true, message: 'Paket wisata terkirim ke spreadsheet.' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  /**
   * Kirim data produk kuliner & cinderamata ke Google Spreadsheet
   */
  public async appendCulinaryToSpreadsheet(item: CulinarySouvenirItem): Promise<{ success: boolean; message: string }> {
    const scriptUrl = this.config.scriptUrl;
    if (!scriptUrl) return { success: true, message: 'Tersimpan secara lokal.' };

    try {
      const payload = {
        action: 'UPSERT_CULINARY',
        sheet: 'Kuliner_Cinderamata',
        itemId: item.id,
        rowData: [
          item.id,
          item.name,
          item.kind,
          item.krida,
          item.priceEstimate,
          item.authorName,
          item.contactPhone,
          item.provinceName,
          item.regencyName,
          item.imageUrl || '',
          item.categoryLabel || '',
          new Date().toISOString()
        ]
      };

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return { success: true, message: 'Produk kuliner/cinderamata terkirim ke spreadsheet.' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  /**
   * Kirim agenda kegiatan / event ke Google Spreadsheet
   */
  public async appendActivityToSpreadsheet(activity: any): Promise<{ success: boolean; message: string }> {
    const scriptUrl = this.config.scriptUrl;
    if (!scriptUrl) return { success: true, message: 'Tersimpan secara lokal.' };

    try {
      const payload = {
        action: 'UPSERT_ACTIVITY',
        sheet: 'Agenda_Kegiatan',
        itemId: activity.id,
        rowData: [
          activity.id,
          activity.title,
          activity.category,
          activity.organizerLevel,
          activity.organizerName,
          activity.locationName,
          activity.provinceName,
          activity.startDate,
          activity.endDate,
          activity.feeType,
          activity.feeAmount || 0,
          activity.contactPhone || '',
          activity.uploadedByName || '',
          new Date().toISOString()
        ]
      };

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return { success: true, message: 'Agenda kegiatan terkirim ke spreadsheet.' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  /**
   * Unggah seluruh data lokal ke Google Spreadsheet secara menyeluruh (Batch Sync)
   */
  public async pushAllDataToSpreadsheet(): Promise<{ success: boolean; message: string; counts: { members: number; tours: number; culinary: number; activities: number } }> {
    const scriptUrl = this.config.scriptUrl;
    const members = storage.getMembers();
    const tours = storage.getTourPackages();
    const culinary = storage.getCulinarySouvenirs();
    const activities = storage.getActivities();

    const counts = {
      members: members.length,
      tours: tours.length,
      culinary: culinary.length,
      activities: activities.length
    };

    if (!scriptUrl) {
      return {
        success: false,
        message: 'Google Apps Script Web App URL belum diisi. Harap masukkan Web App URL di tab "Pengaturan API" terlebih dahulu.',
        counts
      };
    }

    if (this.isPushing) {
      return {
        success: false,
        message: 'Proses pengunggahan data sedang berlangsung, mohon tunggu...',
        counts
      };
    }

    this.isPushing = true;

    try {
      const payload = {
        action: 'SYNC_ALL_DATA',
        members: members.map(m => [
          m.id,
          m.nationalMemberNumber || '',
          m.fullName,
          m.email,
          m.phone,
          m.provinceName,
          m.regencyName,
          m.branchName,
          m.gugusDepan,
          m.krida || '',
          m.status,
          m.avatarUrl,
          m.registeredAt,
          window.location.origin + '/?verifyId=' + (m.nationalMemberNumber || m.id)
        ]),
        tours: tours.map(t => [
          t.id,
          t.title,
          t.category,
          t.pricePerPerson,
          t.durationDays,
          t.locationAddress,
          t.provinceName,
          t.regencyName,
          t.ownerName,
          t.contactPhone,
          t.coverImage || '',
          new Date().toISOString()
        ]),
        culinary: culinary.map(c => [
          c.id,
          c.name,
          c.kind,
          c.krida,
          c.priceEstimate,
          c.authorName,
          c.contactPhone,
          c.provinceName,
          c.regencyName,
          c.imageUrl || '',
          c.categoryLabel || '',
          new Date().toISOString()
        ]),
        activities: activities.map(a => [
          a.id,
          a.title,
          a.category,
          a.organizerLevel,
          a.organizerName,
          a.locationName,
          a.provinceName,
          a.startDate,
          a.endDate,
          a.feeType,
          a.feeAmount || 0,
          a.contactPhone || '',
          a.uploadedByName || '',
          new Date().toISOString()
        ])
      };

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      this.saveConfig({
        lastSyncedAt: new Date().toISOString(),
        status: 'CONNECTED',
        lastError: undefined
      });

      this.isPushing = false;
      return {
        success: true,
        message: `Berhasil mengirim seluruh data ke Google Spreadsheet: ${members.length} Anggota, ${tours.length} Paket Wisata, ${culinary.length} Kuliner/Kriya, ${activities.length} Agenda Kegiatan.`,
        counts
      };
    } catch (err: any) {
      this.isPushing = false;
      console.error('Push all failed:', err);
      return {
        success: false,
        message: `Gagal mengirim data ke spreadsheet: ${err.message}`,
        counts
      };
    }
  }

  /**
   * Upload gambar base64 langsung ke Google Drive melalui Apps Script Web App
   */
  public async uploadImageToDrive(
    base64Data: string, 
    filename: string, 
    category: 'MEMBER_AVATAR' | 'TOUR_PACKAGES' | 'CULINARY_SOUVENIRS' | 'DOCUMENTS' | 'KTA_CARD' = 'MEMBER_AVATAR'
  ): Promise<{ success: boolean; directUrl?: string; fileId?: string; viewUrl?: string; message: string }> {
    const scriptUrl = this.config.scriptUrl;
    if (!scriptUrl) {
      return {
        success: false,
        message: 'Google Apps Script Web App URL belum dipasang. Harap pasang Web App URL di Pengaturan Database agar dapat mengunggah file langsung ke Google Drive.'
      };
    }

    try {
      const payload = {
        action: 'UPLOAD_DRIVE_IMAGE',
        folderId: '16Ql42x6HBWJIB8ss7abnurS_Kne5HYvh',
        category,
        filename,
        base64: base64Data,
        mimeType: base64Data.includes('data:image/png') ? 'image/png' : 'image/jpeg'
      };

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        message: `Foto ${filename} berhasil dikirim untuk diunggah ke Google Drive folder.`
      };
    } catch (err: any) {
      console.error('Failed to upload image to Drive:', err);
      return {
        success: false,
        message: `Gagal mengunggah foto ke Google Drive: ${err.message}`
      };
    }
  }

  /**
   * Inisialisasi struktur subfolder di Google Drive folder 16Ql42x6HBWJIB8ss7abnurS_Kne5HYvh
   */
  public async setupDriveFolders(): Promise<{ success: boolean; directActionUrl?: string; message: string }> {
    const scriptUrl = this.config.scriptUrl;
    if (!scriptUrl) {
      return {
        success: false,
        message: 'Google Apps Script Web App URL belum dipasang. Silakan pasang Web App URL di tab "Pengaturan API".'
      };
    }

    if (this.isSettingUp) {
      return {
        success: false,
        message: 'Proses inisialisasi folder sedang berjalan...'
      };
    }

    this.isSettingUp = true;
    const actionUrl = scriptUrl.includes('?')
      ? `${scriptUrl}&action=SETUP_DRIVE_FOLDERS`
      : `${scriptUrl}?action=SETUP_DRIVE_FOLDERS`;

    try {
      const payload = {
        action: 'SETUP_DRIVE_FOLDERS',
        folderId: '16Ql42x6HBWJIB8ss7abnurS_Kne5HYvh'
      };

      // Eksekusi via POST no-cors tunggal
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      this.isSettingUp = false;
      return {
        success: true,
        directActionUrl: actionUrl,
        message: 'Permintaan inisialisasi 5 subfolder Google Drive berhasil dikirim ke Google Apps Script.'
      };
    } catch (err: any) {
      this.isSettingUp = false;
      return {
        success: false,
        directActionUrl: actionUrl,
        message: `Gagal inisialisasi folder: ${err.message}`
      };
    }
  }

  /**
   * Hasilkan Template Script Google Apps Script yang siap di-copy-paste oleh user
   */
  public getGoogleAppsScriptTemplate(): string {
    return `// =========================================================================
// GOOGLE APPS SCRIPT: MASTER DATABASE & DRIVE API SAKA PARIWISATA INDONESIA
// =========================================================================
// Folder Google Drive Target:
// https://drive.google.com/drive/folders/16Ql42x6HBWJIB8ss7abnurS_Kne5HYvh
//
// =========================================================================
// CARA PENGGUNAAN (1 KLIK & DEPLOY WEB APP):
// 1. Tempelkan seluruh kode ini ke Apps Script.
// 2. Klik "Deploy" (Penerapan) di pojok kanan atas > "New deployment" (Penerapan baru).
// 3. Pilih tipe: "Web app" (Aplikasi web).
// 4. Konfigurasi:
//    - Description: "Saka Pariwisata Master Database & Drive API v4.2"
//    - Execute as: "Me" (Saya)
//    - Who has access: "Anyone" (Siapa saja)  <-- WAJIB PILIH "ANYONE"
// 5. Klik "Deploy", lalu salin URL Web App yang berakhiran "/exec".
// 6. Tempelkan ke Pengaturan Database di Aplikasi Saka.
// =========================================================================

var MASTER_DRIVE_FOLDER_ID = "16Ql42x6HBWJIB8ss7abnurS_Kne5HYvh";

/**
 * FUNGSI UTAMA: Jalankan fungsi ini langsung dari editor Google Apps Script untuk test folder!
 */
function inisialisasiFolderGoogleDrive() {
  Logger.log("Memulai inisialisasi folder Google Drive: " + MASTER_DRIVE_FOLDER_ID);
  var rootFolder = getOrCreateDriveFolder(MASTER_DRIVE_FOLDER_ID);
  var subfolders = setupAllSubfolders(rootFolder);

  var statusContent = "SISTEM DATABASE & MEDIA SAKA PARIWISATA INDONESIA\\n" +
    "Diperbarui pada: " + new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB\\n" +
    "Folder Utama: " + rootFolder.getName() + " (ID: " + rootFolder.getId() + ")\\n" +
    "Status: 5 SUBFOLDER BERHASIL DIBUAT & TERHUBUNG AKTIF TANPA DUPLIKASI\\n\\n" +
    "Daftar Subfolder Resmi:\\n" +
    "1. 01_Pas_Foto_KTA_Anggota\\n" +
    "2. 02_Paket_Wisata\\n" +
    "3. 03_Kuliner_dan_Cinderamata\\n" +
    "4. 04_Agenda_Kegiatan\\n" +
    "5. 05_Dokumen_dan_Surat\\n";

  // Hapus status file lama jika ada agar tidak double file
  var oldStatus = rootFolder.getFilesByName("STATUS_KONEKSI_SAKA_PARIWISATA.txt");
  while (oldStatus.hasNext()) {
    oldStatus.next().setTrashed(true);
  }

  var statusBlob = Utilities.newBlob(statusContent, "text/plain", "STATUS_KONEKSI_SAKA_PARIWISATA.txt");
  var statusFile = rootFolder.createFile(statusBlob);
  statusFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  Logger.log("✅ SUKSES! 5 Subfolder dan File STATUS_KONEKSI_SAKA_PARIWISATA.txt berhasil diperbarui.");
  return {
    status: "success",
    folderId: rootFolder.getId(),
    subfolders: Object.keys(subfolders)
  };
}

function tesKoneksiDriveDanSheet() {
  var rootFolder = getOrCreateDriveFolder(MASTER_DRIVE_FOLDER_ID);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Folder Drive: " + rootFolder.getName() + " (ID: " + rootFolder.getId() + ")");
  Logger.log("Spreadsheet: " + ss.getName() + " (ID: " + ss.getId() + ")");
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";

  // 1. Eksekusi inisialisasi Drive lewat GET
  if (action === "SETUP_DRIVE_FOLDERS" || action === "SETUP_DRIVE" || action === "INIT_DRIVE") {
    inisialisasiFolderGoogleDrive();
    var htmlOutput = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Inisialisasi Google Drive Berhasil</title>" +
      "<style>body{font-family:system-ui,-apple-system,sans-serif;padding:30px;background:#f0fdf4;color:#166534;line-height:1.6} " +
      ".card{background:#fff;padding:28px;border-radius:20px;box-shadow:0 10px 25px rgba(0,0,0,0.08);max-width:560px;margin:30px auto;border:1px solid #bbf7d0} " +
      "h1{color:#15803d;margin-top:0;font-size:22px;display:flex;align-items:center;gap:8px} " +
      "ul{text-align:left;background:#f8fafc;padding:16px 28px;border-radius:12px;border:1px solid #e2e8f0;font-family:monospace;font-size:13px} " +
      "li{margin:6px 0} .btn{display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:bold;margin-top:10px}</style></head>" +
      "<body><div class='card'><h1>✅ Inisialisasi Google Drive Sukses!</h1>" +
      "<p>5 Subfolder resmi dan file verifikasi telah berhasil dibuat di Google Drive Saka Pariwisata:</p>" +
      "<ul><li>📁 01_Pas_Foto_KTA_Anggota</li><li>📁 02_Paket_Wisata</li><li>📁 03_Kuliner_dan_Cinderamata</li><li>📁 04_Agenda_Kegiatan</li><li>📁 05_Dokumen_dan_Surat</li></ul>" +
      "<p><a class='btn' href='https://drive.google.com/drive/folders/16Ql42x6HBWJIB8ss7abnurS_Kne5HYvh' target='_blank'>📂 Buka Folder di Google Drive</a></p>" +
      "<p style='font-size:12px;color:#64748b;margin-top:20px'>Anda sekarang dapat kembali ke aplikasi Saka Pariwisata dan mulai sinkronisasi data.</p></div></body></html>";
    return HtmlService.createHtmlOutput(htmlOutput);
  }

  // 2. Baca data Spreadsheet
  var sheetName = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : "Anggota";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet tidak ditemukan: " + sheetName }))
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
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Tidak ada payload data" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      body = e.parameter || {};
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rootFolder = getOrCreateDriveFolder(MASTER_DRIVE_FOLDER_ID);

    // 1. AKSI INISIALISASI STRUKTUR SUBFOLDER DI GOOGLE DRIVE (TANPA DUPLIKASI)
    if (body.action === "SETUP_DRIVE_FOLDERS" || (e.parameter && e.parameter.action === "SETUP_DRIVE_FOLDERS")) {
      var res = inisialisasiFolderGoogleDrive();
      return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. AKSI UPLOAD GAMBAR TUNGGAL KE GOOGLE DRIVE
    if (body.action === "UPLOAD_DRIVE_IMAGE") {
      var targetSubfolder = getCategorySubfolder(rootFolder, body.category || "MEMBER_AVATAR");
      
      var base64Data = (body.base64 || "").replace(/^data:image\\/\\w+;base64,/, "");
      if (!base64Data) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Data base64 gambar kosong" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var decoded = Utilities.base64Decode(base64Data);
      var filename = body.filename || ("saka_photo_" + Date.now() + ".jpg");
      
      // Hapus file lama dengan nama persis sama di folder tujuan agar tidak berlipat ganda
      var oldFiles = targetSubfolder.getFilesByName(filename);
      while (oldFiles.hasNext()) {
        oldFiles.next().setTrashed(true);
      }

      var blob = Utilities.newBlob(decoded, body.mimeType || "image/jpeg", filename);
      var file = targetSubfolder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      var directUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
      var viewUrl = file.getUrl();

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        fileId: file.getId(),
        directUrl: directUrl,
        viewUrl: viewUrl,
        folderName: targetSubfolder.getName()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. AKSI BATCH SINKRONISASI SELURUH DATA & ANTI DATA GANDA (SYNC_ALL_DATA)
    if (body.action === "SYNC_ALL_DATA") {
      var driveSubfolders = setupAllSubfolders(rootFolder);
      var avatarFolder = driveSubfolders["01_Pas_Foto_KTA_Anggota"];

      // Proses dan simpan foto anggota jika dalam format base64
      var processedMembers = (body.members || []).map(function(row) {
        var photoUrl = row[11]; // Kolom Foto URL
        if (photoUrl && typeof photoUrl === "string" && photoUrl.indexOf("data:image") === 0) {
          try {
            var b64 = photoUrl.replace(/^data:image\\/\\w+;base64,/, "");
            var dec = Utilities.base64Decode(b64);
            var memberNtaOrId = row[1] || row[0] || Date.now();
            var memberName = (row[2] || "Anggota").replace(/[^a-zA-Z0-9]/g, "_");
            var fName = "KTA_" + memberNtaOrId + "_" + memberName + ".jpg";
            
            // Hapus file foto lama jika sudah ada
            var oldAvatar = avatarFolder.getFilesByName(fName);
            while (oldAvatar.hasNext()) {
              oldAvatar.next().setTrashed(true);
            }

            var blb = Utilities.newBlob(dec, "image/jpeg", fName);
            var f = avatarFolder.createFile(blb);
            f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            row[11] = "https://lh3.googleusercontent.com/d/" + f.getId();
          } catch (imgErr) {
            // Keep original if error
          }
        }
        return row;
      });

      // Tulis / Update (Upsert) ke masing-masing Sheet
      syncSheetData(ss, "Anggota", [
        "ID", "Nomor KTA", "Nama Lengkap", "Email", "Nomor WA", "Provinsi", "Kabupaten/Kota", 
        "Kwarran/Kecamatan", "Gudep", "Krida", "Status", "Foto URL", "Tanggal Daftar", "Link Verifikasi"
      ], processedMembers);

      syncSheetData(ss, "Paket_Wisata", [
        "ID", "Nama Paket", "Kategori", "Harga", "Durasi (Hari)", "Lokasi", "Provinsi", 
        "Kabupaten/Kota", "Penyelenggara", "Kontak WA", "Foto Banner", "Waktu Diperbarui"
      ], body.tours || []);

      syncSheetData(ss, "Kuliner_Cinderamata", [
        "ID", "Nama Produk", "Jenis", "Kategori", "Harga", "Produsen/Pengrajin", "Kontak WA", 
        "Provinsi", "Kabupaten/Kota", "Foto Produk", "Sertifikasi Halal", "Waktu Diperbarui"
      ], body.culinary || []);

      syncSheetData(ss, "Agenda_Kegiatan", [
        "ID", "Nama Agenda", "Kategori", "Skala Tingkat", "Penyelenggara", "Lokasi", 
        "Provinsi", "Tanggal Mulai", "Tanggal Selesai", "Jenis Biaya", "Nominal Biaya", 
        "Kontak Narahubung", "Didaftarkan Oleh", "Waktu Diperbarui"
      ], body.activities || []);

      // Buat file rekapitulasi data di Google Drive (gantikan rekap lama)
      var rekapText = "REKAPITULASI DATABASE SAKA PARIWISATA INDONESIA\\n" +
        "Waktu Sinkronisasi: " + new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB\\n" +
        "Jumlah Anggota: " + (body.members ? body.members.length : 0) + "\\n" +
        "Jumlah Paket Wisata: " + (body.tours ? body.tours.length : 0) + "\\n" +
        "Jumlah Kuliner & Cinderamata: " + (body.culinary ? body.culinary.length : 0) + "\\n" +
        "Jumlah Agenda Kegiatan: " + (body.activities ? body.activities.length : 0) + "\\n";
      
      var oldRekap = rootFolder.getFilesByName("REKAP_DATABASE_TERBARU.txt");
      while (oldRekap.hasNext()) {
        oldRekap.next().setTrashed(true);
      }

      var rekapBlob = Utilities.newBlob(rekapText, "text/plain", "REKAP_DATABASE_TERBARU.txt");
      rootFolder.createFile(rekapBlob);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Seluruh data dan foto berhasil disinkronkan ke Google Spreadsheet dan Google Drive tanpa duplikasi."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. AKSI TULIS BARIS TUNGGAL DENGAN UPSERT (CEK DUPLIKASI ID & KTA)
    var sheetName = body.sheet || "Anggota";
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    if (body.rowData && Array.isArray(body.rowData)) {
      var rowId = String(body.memberId || body.itemId || body.rowData[0] || "").trim();
      var rowKta = body.rowData[1] ? String(body.rowData[1]).trim() : "";
      var dataRange = sheet.getDataRange();
      var values = dataRange.getValues();
      var targetRowIndex = -1;

      if (values.length > 1 && (rowId || rowKta)) {
        for (var r = 1; r < values.length; r++) {
          var cellId = String(values[r][0] || "").trim();
          var cellKta = String(values[r][1] || "").trim();
          if ((rowId && cellId === rowId) || (rowKta && rowKta.length > 5 && cellKta === rowKta)) {
            targetRowIndex = r + 1; // 1-indexed for Sheet range
            break;
          }
        }
      }

      if (targetRowIndex > 0) {
        sheet.getRange(targetRowIndex, 1, 1, body.rowData.length).setValues([body.rowData]);
      } else {
        sheet.appendRow(body.rowData);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data berhasil disimpan dan disinkronkan ke sheet " + sheetName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateDriveFolder(folderId) {
  if (folderId && folderId.trim()) {
    try {
      var folder = DriveApp.getFolderById(folderId.trim());
      if (folder && !folder.isTrashed()) return folder;
    } catch (err) {
      Logger.log("getFolderById info: " + err.toString());
    }
  }

  var existing = DriveApp.getRootFolder().getFoldersByName("SAKA_PARIWISATA_DATABASE_MEDIA");
  while (existing.hasNext()) {
    var f = existing.next();
    if (!f.isTrashed()) return f;
  }

  var newRoot = DriveApp.getRootFolder().createFolder("SAKA_PARIWISATA_DATABASE_MEDIA");
  newRoot.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return newRoot;
}

function setupAllSubfolders(rootFolder) {
  var folderNames = [
    "01_Pas_Foto_KTA_Anggota",
    "02_Paket_Wisata",
    "03_Kuliner_dan_Cinderamata",
    "04_Agenda_Kegiatan",
    "05_Dokumen_dan_Surat"
  ];

  var map = {};
  folderNames.forEach(function(fName) {
    var it = rootFolder.getFoldersByName(fName);
    var found = null;
    while (it.hasNext()) {
      var f = it.next();
      if (!f.isTrashed()) {
        found = f;
        break;
      }
    }

    if (found) {
      map[fName] = found;
    } else {
      var target = rootFolder.createFolder(fName);
      target.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      map[fName] = target;
    }
  });

  return map;
}

function getCategorySubfolder(rootFolder, category) {
  var targetName = "01_Pas_Foto_KTA_Anggota";
  if (category === "TOUR_PACKAGES") targetName = "02_Paket_Wisata";
  else if (category === "CULINARY_SOUVENIRS") targetName = "03_Kuliner_dan_Cinderamata";
  else if (category === "DOCUMENTS" || category === "KTA_CARD") targetName = "05_Dokumen_dan_Surat";
  else if (category === "ACTIVITIES") targetName = "04_Agenda_Kegiatan";

  var it = rootFolder.getFoldersByName(targetName);
  var found = null;
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed()) {
      found = f;
      break;
    }
  }

  if (found) {
    return found;
  } else {
    var created = rootFolder.createFolder(targetName);
    created.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return created;
  }
}

function syncSheetData(ss, sheetName, defaultHeaders, rowsData) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(defaultHeaders);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(defaultHeaders);
  }

  // Melakukan Upsert agar data di sheet tidak berlipat ganda
  if (rowsData && rowsData.length > 0) {
    var existingValues = sheet.getDataRange().getValues();
    var idToRowIndex = {};

    for (var i = 1; i < existingValues.length; i++) {
      var rowId = String(existingValues[i][0] || "").trim();
      var rowKta = String(existingValues[i][1] || "").trim();
      if (rowId) idToRowIndex[rowId] = i + 1;
      if (rowKta && rowKta.length > 5) idToRowIndex[rowKta] = i + 1;
    }

    rowsData.forEach(function(row) {
      var newId = String(row[0] || "").trim();
      var newKta = String(row[1] || "").trim();
      var targetIndex = idToRowIndex[newId] || (newKta && newKta.length > 5 ? idToRowIndex[newKta] : null);

      if (targetIndex) {
        sheet.getRange(targetIndex, 1, 1, row.length).setValues([row]);
      } else {
        sheet.appendRow(row);
        var lastRow = sheet.getLastRow();
        if (newId) idToRowIndex[newId] = lastRow;
        if (newKta && newKta.length > 5) idToRowIndex[newKta] = lastRow;
      }
    });
  }
}
`;
  }
}

export const spreadsheetService = new SpreadsheetService();

