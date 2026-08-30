import { Member, UserRole } from '../types';
import { storage } from './storage';
import { spreadsheetService } from './spreadsheetService';

export interface VerificationResult {
  found: boolean;
  member: Member | null;
  source: 'LOCAL' | 'GOOGLE_SPREADSHEET' | 'NONE';
  searchTerm: string;
  normalizedTerm: string;
  message?: string;
}

/**
 * Pembersih dan penormalisasi kueri pencarian NTA/Barcode/URL
 */
export function normalizeNtaQuery(rawInput: string): {
  cleanQuery: string;
  strippedDigits: string;
  isUrl: boolean;
  extractedQuery: string;
} {
  if (!rawInput) {
    return { cleanQuery: '', strippedDigits: '', isUrl: false, extractedQuery: '' };
  }

  let text = rawInput.trim();

  // 1. Cek apakah input berupa URL (misal hasil scan QR Code atau pemindai kamera)
  let isUrl = false;
  let extractedQuery = text;

  if (text.includes('http://') || text.includes('https://') || text.includes('verifyId=') || text.includes('/verify/')) {
    isUrl = true;
    try {
      if (text.startsWith('http://') || text.startsWith('https://')) {
        const urlObj = new URL(text);
        const qId = urlObj.searchParams.get('verifyId') || 
                    urlObj.searchParams.get('nta') || 
                    urlObj.searchParams.get('id') || 
                    urlObj.searchParams.get('kta');
        if (qId) {
          extractedQuery = qId.trim();
        } else if (urlObj.pathname.includes('/verify/')) {
          extractedQuery = decodeURIComponent(urlObj.pathname.split('/verify/')[1]?.split('?')[0] || '').trim();
        }
      } else if (text.includes('verifyId=')) {
        const match = text.match(/verifyId=([^&]+)/);
        if (match && match[1]) {
          extractedQuery = decodeURIComponent(match[1]).trim();
        }
      }
    } catch {
      // Jika URL parsing gagal, gunakan string apa adanya
    }
  }

  // Bersihkan tanda petik atau karakter aneh Excel/Spreadsheet
  const cleanQuery = extractedQuery.replace(/^['"`]+|['"`]+$/g, '').trim();
  const strippedDigits = cleanQuery.replace(/\D/g, '');

  return {
    cleanQuery,
    strippedDigits,
    isUrl,
    extractedQuery
  };
}

/**
 * Memeriksa kecocokan anggota dengan berbagai variasi format (dengan/tanpa titik, token, nama, ID)
 */
export function isMemberMatch(member: Member, cleanQuery: string, strippedDigits: string): boolean {
  if (!member) return false;

  const queryLower = cleanQuery.toLowerCase();
  
  // 1. Cek Nomor Anggota Nasional (NTA)
  if (member.nationalMemberNumber) {
    const ntaLower = member.nationalMemberNumber.toLowerCase().trim();
    if (ntaLower === queryLower) return true;

    // Cek tanpa titik / karakter non-digit (misal: 000000000002 vs 00.00.00.000002)
    const ntaDigits = member.nationalMemberNumber.replace(/\D/g, '');
    if (strippedDigits.length >= 4 && ntaDigits === strippedDigits) return true;

    // Cek jika query adalah nomor urut 6 digit terakhir (misal: 000002 atau 000124)
    if (strippedDigits.length >= 4 && ntaDigits.endsWith(strippedDigits)) return true;
    if (cleanQuery.length >= 4 && ntaLower.endsWith(cleanQuery.toLowerCase())) return true;
  }

  // 2. Cek Token Verifikasi Unik (misal: VERIFY-SP-NAS001)
  if (member.verificationToken) {
    const tokenLower = member.verificationToken.toLowerCase().trim();
    if (tokenLower === queryLower) return true;
    if (tokenLower.includes(queryLower) && queryLower.length >= 5) return true;
  }

  // 3. Cek ID Anggota & User ID
  if (member.id && member.id.toLowerCase() === queryLower) return true;
  if (member.userId && member.userId.toLowerCase() === queryLower) return true;

  // 4. Cek NIK
  if (member.nikMasked && member.nikMasked.replace(/\D/g, '').length >= 6 && strippedDigits.length >= 6) {
    const nikDigits = member.nikMasked.replace(/\D/g, '');
    if (nikDigits.includes(strippedDigits) || strippedDigits.includes(nikDigits)) return true;
  }

  // 5. Cek Nomor Telepon / WhatsApp
  if (member.phone && strippedDigits.length >= 8) {
    const phoneDigits = member.phone.replace(/\D/g, '');
    if (phoneDigits.endsWith(strippedDigits) || strippedDigits.endsWith(phoneDigits)) return true;
  }

  // 6. Cek Email
  if (member.email && member.email.toLowerCase().trim() === queryLower) return true;

  // 7. Cek Nama Lengkap (exact match atau contains jika query cukup panjang)
  if (member.fullName) {
    const nameLower = member.fullName.toLowerCase().trim();
    if (nameLower === queryLower) return true;
    if (queryLower.length >= 4 && (nameLower.includes(queryLower) || queryLower.includes(nameLower))) return true;
  }

  return false;
}

/**
 * Cari anggota di database lokal React / localStorage
 */
export function searchMemberLocally(rawInput: string, memberList?: Member[]): Member | null {
  const { cleanQuery, strippedDigits } = normalizeNtaQuery(rawInput);
  if (!cleanQuery && !strippedDigits) return null;

  const members = memberList && memberList.length > 0 ? memberList : storage.getMembers();

  for (const m of members) {
    if (isMemberMatch(m, cleanQuery, strippedDigits)) {
      return m;
    }
  }

  return null;
}

/**
 * Cari anggota secara live ke Google Spreadsheet
 */
export async function searchMemberInRemoteSpreadsheet(rawInput: string): Promise<Member | null> {
  const { cleanQuery, strippedDigits } = normalizeNtaQuery(rawInput);
  if (!cleanQuery && !strippedDigits) return null;

  try {
    const rows = await spreadsheetService.fetchSheetRows('Anggota');
    if (!rows || rows.length === 0) return null;

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

    // Cari baris yang cocok
    for (let idx = 0; idx < rows.length; idx++) {
      const row = rows[idx];
      const fullName = row['Nama Lengkap'] || row['nama_lengkap'] || row['Nama'] || row['col_1'] || `Anggota ${idx + 1}`;
      const kta = row['Nomor Anggota'] || row['Nomor KTA'] || row['nomor_kta'] || row['col_0'] || '';
      const email = row['Email'] || row['email'] || `member${idx + 1}@pramuka.id`;
      const phone = row['Nomor WA'] || row['No WhatsApp'] || row['Telepon'] || row['col_4'] || '';
      const memberId = row['ID'] || row['id'] || `sheet-member-${idx}`;

      const tempMember: Member = {
        id: memberId,
        userId: `user-${memberId}`,
        nationalMemberNumber: kta || undefined,
        fullName,
        nikMasked: '3201**********01',
        avatarUrl: row['Foto URL'] || row['foto_url'] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
        gender: 'LAKI_LAKI',
        birthPlace: 'Indonesia',
        birthDate: '2000-01-01',
        email,
        phone,
        address: `${row['Kwartir Ranting'] || 'Kwarran'}, ${row['Kabupaten/Kota'] || 'Kwarcab'}, ${row['Provinsi'] || 'Kwarda'}`,
        provinceId: '00',
        provinceName: row['Provinsi'] || row['Kwarda'] || 'Tingkat Daerah',
        regencyId: '00.00',
        regencyName: row['Kabupaten/Kota'] || row['Kwarcab'] || 'Kwartir Cabang',
        districtId: '00.00.00',
        districtName: row['Kwartir Ranting'] || row['Kwarran'] || 'Kwartir Ranting',
        branchId: `branch-${idx}`,
        branchName: row['Kwartir Ranting'] || row['Kwarran'] || 'Kwartir Ranting',
        gugusDepan: row['Gugus Depan'] || row['Gudep'] || 'Gudep Terdaftar',
        currentPosition: row['Jabatan'] || 'Anggota Saka Pariwisata',
        krida: (row['Krida'] || 'Krida Pemandu') as any,
        joinYear: new Date().getFullYear(),
        educationLevel: 'SMA/SMK',
        occupation: 'Pramuka Pariwisata',
        bio: `Anggota resmi Saka Pariwisata. Terverifikasi dari database Google Spreadsheet.`,
        status: (row['Status'] || 'ACTIVE').toUpperCase() === 'PENDING' ? 'PENDING' : 'ACTIVE',
        registeredAt: new Date().toISOString(),
        verificationToken: `VERIFY-SP-${memberId}`,
        isOperator: false,
        skills: [],
        certifications: [],
        locationHistory: []
      };

      if (isMemberMatch(tempMember, cleanQuery, strippedDigits)) {
        // Simpan langsung ke database lokal agar pencarian berikutnya instan
        storage.addOrUpdateMember(tempMember);
        return tempMember;
      }
    }
  } catch (err) {
    console.warn('Live remote spreadsheet lookup failed:', err);
  }

  return null;
}

/**
 * Fungsi Utama: Verifikasi Anggota Multi-Tier (Lokal + Cloud Google Spreadsheet)
 */
export async function verifyMemberUniversal(
  rawInput: string,
  localMembers?: Member[]
): Promise<VerificationResult> {
  const { cleanQuery, strippedDigits } = normalizeNtaQuery(rawInput);

  if (!cleanQuery && !strippedDigits) {
    return {
      found: false,
      member: null,
      source: 'NONE',
      searchTerm: rawInput,
      normalizedTerm: '',
      message: 'Silakan masukkan nomor anggota atau token verifikasi.'
    };
  }

  // 1. Cek database lokal
  const localMatch = searchMemberLocally(rawInput, localMembers);
  if (localMatch) {
    return {
      found: true,
      member: localMatch,
      source: 'LOCAL',
      searchTerm: rawInput,
      normalizedTerm: cleanQuery
    };
  }

  // 2. Jika tidak ditemukan di lokal, cari secara live ke Google Spreadsheet
  try {
    const remoteMatch = await searchMemberInRemoteSpreadsheet(rawInput);
    if (remoteMatch) {
      return {
        found: true,
        member: remoteMatch,
        source: 'GOOGLE_SPREADSHEET',
        searchTerm: rawInput,
        normalizedTerm: cleanQuery
      };
    }
  } catch (e) {
    console.warn('Error during universal verification remote lookup:', e);
  }

  return {
    found: false,
    member: null,
    source: 'NONE',
    searchTerm: rawInput,
    normalizedTerm: cleanQuery,
    message: 'Nomor Anggota Tidak Ditemukan. Pastikan nomor anggota yang dimasukkan benar dan sesuai dengan format resmi Kwartir.'
  };
}
