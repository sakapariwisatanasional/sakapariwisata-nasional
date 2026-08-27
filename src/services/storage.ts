import { 
  Member, 
  TourPackage, 
  Activity, 
  AuditLog, 
  CurrentUser, 
  UserRole,
  Province, 
  Regency, 
  District, 
  Branch, 
  Skill,
  NotificationItem,
  MemberStatus,
  TourStatus,
  SkillProficiency,
  KtaCardSettings,
  CulinarySouvenirItem
} from '../types';
import { PROVINCES_DATA, REGENCIES_DATA, DISTRICTS_DATA, BRANCHES_DATA, getDistrictsForRegency } from '../data/indonesiaTerritories';
import { 
  INITIAL_MEMBERS, 
  INITIAL_TOUR_PACKAGES, 
  INITIAL_ACTIVITIES, 
  INITIAL_AUDIT_LOGS, 
  MASTER_SKILLS, 
  DEMO_USERS,
  INITIAL_CULINARY_SOUVENIRS
} from '../data/initialData';
import { SAKA_CARD_BG_DRIVE_DIRECT_URL } from '../components/common/SakaLogo';

export const DEFAULT_KTA_SETTINGS: KtaCardSettings = {
  cardTheme: 'purple_saka',
  bgImageUrl: SAKA_CARD_BG_DRIVE_DIRECT_URL,
  bgOpacity: 0.90,
  frontOrganizationTitle: 'SAKA PARIWISATA',
  frontOrganizationSubtitle: 'GERAKAN PRAMUKA INDONESIA',
  frontValidityText: 'Masa Berlaku: Selama Menjadi Anggota',
  watermarkOpacity: 0.0,
  showKridaBadge: true,
  backHeaderTitle: 'KETENTUAN KTA DIGITAL SAKA PARIWISATA',
  backHeaderSubtitle: 'Kwartir Nasional Gerakan Pramuka',
  terms: [
    '1. Kartu ini merupakan tanda pengenal sah anggota Satuan Karya Pramuka Pariwisata tingkat Nasional.',
    '2. Keaslian data kartu dapat diverifikasi kapan pun secara publik melalui pemindaian QR Code di bagian depan.',
    '3. Anggota wajib menjunjung tinggi Tri Satya, Dasa Darma Pramuka, serta Sapta Pesona Pariwisata Indonesia.',
    '4. Apabila menemukan kartu ini tercecer, harap diserahkan ke Sekretariat Kwartir terdekat.'
  ],
  issueLocationDate: 'Jakarta, 14 Agustus 2026',
  barcodeType: 'CODE128',
  signerName: 'Reza Pahlevi',
  signerTitle: 'Ketua Pimpinan Saka Pariwisata Nasional',
  showStamp: true
};

const STORAGE_KEYS = {
  MEMBERS: 'saka_members_v1',
  TOURS: 'saka_tours_v1',
  ACTIVITIES: 'saka_activities_v1',
  AUDIT_LOGS: 'saka_audit_logs_v1',
  NOTIFICATIONS: 'saka_notifications_v1',
  CURRENT_USER: 'saka_current_user_v1',
  USERS: 'saka_users_v1',
  CUSTOM_BRANCHES: 'saka_custom_branches_v1',
  KTA_SETTINGS: 'saka_kta_settings_v1',
  CULINARY_SOUVENIRS: 'saka_culinary_souvenirs_v1'
};

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const rawMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!rawMembers) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    } else {
      // Migrate any legacy Krida values in localStorage
      try {
        const parsed: Member[] = JSON.parse(rawMembers);
        let changed = false;
        const kridaMap: Record<string, any> = {
          'Bina Pemandu Wisata': 'Krida Pemandu',
          'Bina Objek Wisata': 'Krida Penyuluh',
          'Bina Atraksi Wisata': 'Krida Mice & Event',
          'Bina Kuliner & Cendramata': 'Krida Kuliner & Cinderamata'
        };
        const migrated = parsed.map(m => {
          if (m.krida && kridaMap[m.krida]) {
            changed = true;
            return {
              ...m,
              krida: kridaMap[m.krida],
              currentPosition: m.currentPosition?.replace(/Bina Pemandu Wisata|Bina Objek Wisata|Bina Atraksi Wisata|Bina Kuliner & Cendramata/g, (match) => kridaMap[match] || match)
            };
          }
          return m;
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(migrated));
        }
      } catch (e) {
        console.error('Failed to migrate legacy members', e);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.TOURS)) {
      localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(INITIAL_TOUR_PACKAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
    } else {
      try {
        const rawUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (rawUser && rawUser.includes('Suryadi')) {
          const user: CurrentUser = JSON.parse(rawUser);
          user.name = user.name.replace(/Dr\.\s*H\.\s*Suryadi,\s*M\.M\.|Suryadi/g, 'Reza Pahlevi');
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
      } catch (e) {
        console.error('Failed to migrate user name', e);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      const initialNotifs: NotificationItem[] = [
        {
          id: 'notif-1',
          userId: 'user-admin-nasional',
          title: 'Pendaftaran Anggota Baru',
          message: 'Fikri Haikal telah mendaftar di Kwarran Coblong Bandung dan membutuhkan verifikasi.',
          type: 'INFO',
          createdAt: new Date().toISOString(),
          isRead: false,
          actionUrl: '/members'
        },
        {
          id: 'notif-2',
          userId: 'user-admin-nasional',
          title: 'Pengajuan Paket Wisata',
          message: 'Paket "Walking Tour Heritage Bandung" diajukan untuk ditinjau.',
          type: 'ALERT',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isRead: false,
          actionUrl: '/tours'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifs));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CULINARY_SOUVENIRS)) {
      localStorage.setItem(STORAGE_KEYS.CULINARY_SOUVENIRS, JSON.stringify(INITIAL_CULINARY_SOUVENIRS));
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- Current User & Roles ---
  public getCurrentUser(): CurrentUser {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  }

  public setCurrentUser(user: CurrentUser) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.addAuditLog(user.id, user.name, user.role, 'SWITCH_ROLE', 'AUTH', user.id, `Beralih peran menjadi ${user.role} (${user.jurisdictionName || 'Nasional'})`);
    this.notify();
  }

  public getUsers(): CurrentUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  }

  public assignMemberAsOperator(
    memberId: string,
    role: UserRole,
    jurisdictionId: string,
    jurisdictionName: string,
    notes: string | undefined,
    adminUser: CurrentUser
  ): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx === -1) return null;

    const member = members[idx];
    const roleLabel = role === 'ADMIN_REGENCY' ? 'Operator Kwarcab' : role === 'ADMIN_PROVINCE' ? 'Operator Kwarda' : role === 'ADMIN_BRANCH' ? 'Operator Kwarran' : 'Operator';
    
    // Update Member Data
    member.isOperator = true;
    member.operatorRole = role;
    member.operatorJurisdictionId = jurisdictionId;
    member.operatorJurisdictionName = jurisdictionName;
    member.operatorAssignedAt = new Date().toISOString();
    member.operatorAssignedBy = `${adminUser.name} (${adminUser.role})`;
    member.operatorNotes = notes || 'Penetapan Operator Resmi oleh Super Admin';

    members[idx] = member;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    // Update Users System for Demo / Login Switcher
    const users = this.getUsers();
    const existingUserIdx = users.findIndex(u => u.memberId === member.id || u.id === member.userId || u.email === member.email);
    const updatedUserObj: CurrentUser = {
      id: existingUserIdx !== -1 ? users[existingUserIdx].id : `user-op-${member.id}`,
      email: member.email,
      name: `Kak ${member.fullName} (${roleLabel} ${jurisdictionName})`,
      role: role,
      jurisdictionName: `${roleLabel} ${jurisdictionName} (${jurisdictionId})`,
      jurisdictionId: jurisdictionId,
      avatarUrl: member.avatarUrl,
      memberId: member.id
    };

    if (existingUserIdx !== -1) {
      users[existingUserIdx] = updatedUserObj;
    } else {
      users.push(updatedUserObj);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // If current logged-in user is this member, update current user as well
    const currentUser = this.getCurrentUser();
    if (currentUser.memberId === member.id || currentUser.id === member.userId) {
      this.setCurrentUser(updatedUserObj);
    }

    // Add Audit Log
    this.addAuditLog(
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'ASSIGN_OPERATOR_ROLE',
      'MEMBER',
      member.id,
      `Super Admin menetapkan anggota ${member.fullName} sebagai ${roleLabel} wilayah ${jurisdictionName} (${jurisdictionId}). Catatan/SK: ${notes || '-'}`
    );

    // Send in-app notification to member
    this.addNotification(
      member.userId,
      'Penetapan Wewenang Operator Kwartir',
      `Selamat! Anda telah resmi ditetapkan oleh Super Admin (${adminUser.name}) sebagai ${roleLabel} wilayah ${jurisdictionName}. Anda kini berwenang menginput, mendaftarkan, dan mengelola data anggota di wilayah tersebut.`,
      'SUCCESS',
      '/members'
    );

    this.notify();
    return member;
  }

  public revokeMemberOperator(
    memberId: string,
    adminUser: CurrentUser,
    reason: string = 'Penyelesaian masa bakti / pembatalan wewenang oleh Super Admin'
  ): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx === -1) return null;

    const member = members[idx];
    const prevRole = member.operatorRole || 'ADMIN_REGENCY';
    const prevJurisdiction = member.operatorJurisdictionName || member.regencyName;

    // Reset operator privileges on Member
    member.isOperator = false;
    member.operatorRole = undefined;
    member.operatorJurisdictionId = undefined;
    member.operatorJurisdictionName = undefined;
    member.operatorAssignedAt = undefined;
    member.operatorAssignedBy = undefined;
    member.operatorNotes = undefined;

    members[idx] = member;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    // Update Users System
    const users = this.getUsers();
    const userIdx = users.findIndex(u => u.memberId === member.id || u.id === member.userId || u.email === member.email);
    if (userIdx !== -1) {
      users[userIdx].role = 'MEMBER';
      users[userIdx].name = `Kak ${member.fullName}`;
      users[userIdx].jurisdictionName = `Anggota Saka Aktif (${member.regencyName})`;
      users[userIdx].jurisdictionId = undefined;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // If currently active user was this operator, demote to Member
      const currentUser = this.getCurrentUser();
      if (currentUser.id === users[userIdx].id || currentUser.memberId === member.id) {
        this.setCurrentUser(users[userIdx]);
      }
    }

    // Add Audit Log
    this.addAuditLog(
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'REVOKE_OPERATOR_ROLE',
      'MEMBER',
      member.id,
      `Super Admin membatalkan/mencabut hak Operator dari anggota ${member.fullName} (sebelumnya ${prevRole} di ${prevJurisdiction}). Alasan: ${reason}`
    );

    // Send in-app notification to member
    this.addNotification(
      member.userId,
      'Wewenang Operator Dinonaktifkan',
      `Wewenang Operator Kwartir Anda telah dinonaktifkan/dibatalkan oleh Super Admin (${adminUser.name}). Alasan: ${reason}. Status akun Anda kembali sebagai Anggota Reguler.`,
      'INFO',
      '/profile'
    );

    this.notify();
    return member;
  }

  // --- Territories ---
  public getProvinces(): Province[] {
    return PROVINCES_DATA;
  }

  public getRegencies(provinceId?: string): Regency[] {
    if (!provinceId) return REGENCIES_DATA;
    return REGENCIES_DATA.filter(r => r.provinceId === provinceId);
  }

  public getDistricts(regencyId?: string): District[] {
    if (!regencyId) return DISTRICTS_DATA;
    const regency = REGENCIES_DATA.find(r => r.id === regencyId);
    return getDistrictsForRegency(regencyId, regency?.name);
  }

  public getBranches(districtId?: string): Branch[] {
    const custom = this.getCustomBranches();
    
    if (districtId) {
      const customMatches = custom.filter(b => b.districtId === districtId);
      const staticMatches = BRANCHES_DATA.filter(b => b.districtId === districtId);
      
      if (customMatches.length > 0 || staticMatches.length > 0) {
        return [...staticMatches, ...customMatches];
      }

      // Automatically construct Kwartir Ranting following the exact Kecamatan name
      const parts = districtId.split('.');
      const provinceId = parts[0] || '32';
      const regencyId = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : '32.06';
      const districtCode = parts[2] || '01';
      
      const regency = REGENCIES_DATA.find(r => r.id === regencyId);
      const districts = getDistrictsForRegency(regencyId, regency?.name);
      const district = districts.find(d => d.id === districtId);
      const distName = district ? district.name : 'Kecamatan';

      return [{
        id: `branch-${districtId.replace(/\./g, '-')}`,
        districtId,
        regencyId,
        provinceId,
        code: districtCode,
        name: `Kwarran ${distName}`,
        address: `Pangkalan Saka Pariwisata Kwarran ${distName}`,
        contactPerson: `Pengurus Kwarran ${distName}`,
        phone: '0812-3456-7890'
      }];
    }

    const all = [...BRANCHES_DATA, ...custom];
    return all;
  }

  public getCustomBranches(): Branch[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_BRANCHES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public addBranch(branch: Omit<Branch, 'id'>): Branch {
    const newBranch: Branch = {
      ...branch,
      id: `branch-${Date.now()}`
    };
    const current = this.getCustomBranches();
    current.push(newBranch);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BRANCHES, JSON.stringify(current));
    const user = this.getCurrentUser();
    this.addAuditLog(user.id, user.name, user.role, 'CREATE_BRANCH', 'TERRITORY', newBranch.id, `Menambahkan Ranting Baru: ${newBranch.name}`);
    this.notify();
    return newBranch;
  }

  // --- Skills ---
  public getSkills(): Skill[] {
    return MASTER_SKILLS;
  }

  // --- Members & Generator ---
  public getMembers(): Member[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return data ? JSON.parse(data) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  }

  public getMemberById(id: string): Member | undefined {
    return this.getMembers().find(m => m.id === id);
  }

  public getMemberByVerificationToken(token: string): Member | undefined {
    return this.getMembers().find(m => m.verificationToken === token || m.nationalMemberNumber === token);
  }

  public generateNationalMemberNumber(provinceCode: string, regencyCode: string, districtCode: string): string {
    const members = this.getMembers();
    // Prefix: PP.KK.KC
    // Find highest sequence for this prefix
    const p = provinceCode.padStart(2, '0');
    const k = regencyCode.split('.').pop()?.padStart(2, '0') || '01';
    const d = districtCode.split('.').pop()?.padStart(2, '0') || '01';
    const prefix = `${p}.${k}.${d}`;
    
    let maxSeq = 0;
    members.forEach(m => {
      if (m.nationalMemberNumber && m.nationalMemberNumber.startsWith(prefix)) {
        const parts = m.nationalMemberNumber.split('.');
        if (parts.length === 4) {
          const seq = parseInt(parts[3], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    });

    const nextSeq = (maxSeq + 1).toString().padStart(6, '0');
    return `${prefix}.${nextSeq}`;
  }

  public registerMember(payload: Omit<Member, 'id' | 'status' | 'registeredAt' | 'verificationToken' | 'locationHistory'>): Member {
    const newId = `member-${Date.now()}`;
    const token = `VERIFY-SP-${payload.provinceId}${payload.regencyId.replace('.', '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const newMember: Member = {
      ...payload,
      id: newId,
      status: 'PENDING',
      registeredAt: new Date().toISOString(),
      verificationToken: token,
      locationHistory: [],
      skills: payload.skills || [],
      certifications: payload.certifications || []
    };

    const members = this.getMembers();
    members.unshift(newMember);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    const user = this.getCurrentUser();
    this.addAuditLog(user.id, user.name, user.role, 'REGISTER_MEMBER', 'MEMBER', newId, `Pendaftaran anggota baru: ${newMember.fullName}`);
    
    this.addNotification(
      'user-admin-nasional',
      'Pendaftaran Anggota Baru',
      `${newMember.fullName} telah mendaftar di ${newMember.branchName} dan menunggu verifikasi.`,
      'INFO',
      '/members'
    );

    this.notify();
    return newMember;
  }

  public updateMemberStatus(
    memberId: string, 
    status: MemberStatus, 
    verifierName: string, 
    rejectionReason?: string
  ): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx === -1) return null;

    const member = members[idx];
    member.status = status;
    
    if (status === 'ACTIVE') {
      if (!member.nationalMemberNumber) {
        // Generate permanent National Member Number
        member.nationalMemberNumber = this.generateNationalMemberNumber(
          member.provinceId,
          member.regencyId,
          member.districtId
        );
      }
      member.verifiedAt = new Date().toISOString();
      member.verifiedBy = verifierName;
      member.rejectionReason = undefined;
      
      this.addNotification(
        member.userId,
        'Selamat! Keanggotaan Disetujui',
        `Selamat, pendaftaran Anda di Saka Pariwisata telah disetujui dengan No. Anggota: ${member.nationalMemberNumber}. KTA Digital Anda sudah aktif!`,
        'SUCCESS',
        '/my-card'
      );
    } else if (status === 'REVISION_REQUIRED' || status === 'SUSPENDED') {
      member.rejectionReason = rejectionReason || 'Memerlukan perbaikan dokumen/data.';
      this.addNotification(
        member.userId,
        'Status Keanggotaan Diperbarui',
        `Status pendaftaran Anda memerlukan perhatian: ${member.rejectionReason}`,
        'WARNING',
        '/profile'
      );
    }

    members[idx] = member;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    const user = this.getCurrentUser();
    this.addAuditLog(user.id, user.name, user.role, `MEMBER_STATUS_${status}`, 'MEMBER', memberId, `Mengubah status anggota ${member.fullName} menjadi ${status}`);

    this.notify();
    return member;
  }

  public approveMember(memberId: string, verifierName?: string): Member | null {
    return this.updateMemberStatus(memberId, 'ACTIVE', verifierName || 'Admin Saka Pariwisata');
  }

  public updateTourStatus(tourId: string, status: TourStatus, reviewerName?: string, rejectionReason?: string) {
    this.moderateTourPackage(tourId, status, reviewerName || 'Admin Saka Pariwisata', rejectionReason);
  }

  public transferMemberLocation(
    memberId: string,
    newBranch: Branch,
    newDistrict: District,
    newRegency: Regency,
    newProvince: Province,
    reason: string,
    authorizedBy: string
  ): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx === -1) return null;

    const member = members[idx];
    const prevBranch = member.branchName;
    const prevNum = member.nationalMemberNumber || '-';

    // Update location
    member.provinceId = newProvince.id;
    member.provinceName = newProvince.name;
    member.regencyId = newRegency.id;
    member.regencyName = newRegency.name;
    member.districtId = newDistrict.id;
    member.districtName = newDistrict.name;
    member.branchId = newBranch.id;
    member.branchName = newBranch.name;

    // Generate new formatted number if active
    const newNum = this.generateNationalMemberNumber(newProvince.code, newRegency.code, newDistrict.code);
    member.nationalMemberNumber = newNum;

    // Append to location history
    member.locationHistory.unshift({
      id: `loc-${Date.now()}`,
      memberId: member.id,
      prevBranchName: prevBranch,
      newBranchName: newBranch.name,
      prevMemberNumber: prevNum,
      newMemberNumber: newNum,
      transferDate: new Date().toISOString().split('T')[0],
      reason,
      authorizedByName: authorizedBy
    });

    members[idx] = member;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    const user = this.getCurrentUser();
    this.addAuditLog(user.id, user.name, user.role, 'MEMBER_LOCATION_TRANSFER', 'MEMBER', memberId, `Memindahkan anggota ${member.fullName} dari ${prevBranch} ke ${newBranch.name}`);

    this.notify();
    return member;
  }

  public updateMemberProfile(member: Member) {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === member.id);
    if (idx !== -1) {
      members[idx] = member;
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
      this.notify();
    }
  }

  public adminUpdateMember(
    memberId: string, 
    updatedData: Partial<Member>, 
    adminUser: CurrentUser, 
    reason: string = 'Koreksi data profil dan domisili oleh Administrator'
  ): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx === -1) return null;

    const prevMember = members[idx];
    const prevBranch = prevMember.branchName;
    const prevProvince = prevMember.provinceName;
    const prevRegency = prevMember.regencyName;
    const prevFullName = prevMember.fullName;
    const prevNta = prevMember.nationalMemberNumber;

    // Detect if location / domicile changed
    const isDomicileChanged = 
      (updatedData.provinceId && updatedData.provinceId !== prevMember.provinceId) ||
      (updatedData.regencyId && updatedData.regencyId !== prevMember.regencyId) ||
      (updatedData.districtId && updatedData.districtId !== prevMember.districtId) ||
      (updatedData.branchId && updatedData.branchId !== prevMember.branchId);

    const locationHistory = [...(prevMember.locationHistory || [])];

    if (isDomicileChanged) {
      locationHistory.unshift({
        id: `loc-${Date.now()}`,
        memberId: prevMember.id,
        prevBranchName: `${prevProvince} / ${prevRegency} / ${prevBranch}`,
        newBranchName: `${updatedData.provinceName || prevMember.provinceName} / ${updatedData.regencyName || prevMember.regencyName} / ${updatedData.branchName || prevMember.branchName}`,
        prevMemberNumber: prevNta || '-',
        newMemberNumber: updatedData.nationalMemberNumber || prevNta || '-',
        transferDate: new Date().toISOString().split('T')[0],
        reason: reason || 'Perubahan dan pembaruan domisili oleh Admin',
        authorizedByName: `${adminUser.name} (${adminUser.role})`
      });
    }

    const updatedMember: Member = {
      ...prevMember,
      ...updatedData,
      locationHistory
    };

    members[idx] = updatedMember;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    // Synchronize current logged in user if it matches this member
    const currentUser = this.getCurrentUser();
    if (currentUser.memberId === memberId || currentUser.id === prevMember.userId) {
      currentUser.name = updatedMember.fullName;
      if (updatedMember.avatarUrl) currentUser.avatarUrl = updatedMember.avatarUrl;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }

    // Detail audit changes
    const changes: string[] = [];
    if (updatedMember.fullName !== prevFullName) {
      changes.push(`Nama/Gelar: "${prevFullName}" -> "${updatedMember.fullName}"`);
    }
    if (isDomicileChanged) {
      changes.push(`Domisili/Kwartir: "${prevBranch}" -> "${updatedMember.branchName}"`);
    }
    if (updatedMember.krida !== prevMember.krida) {
      changes.push(`Krida: "${prevMember.krida}" -> "${updatedMember.krida}"`);
    }
    if (updatedMember.status !== prevMember.status) {
      changes.push(`Status: "${prevMember.status}" -> "${updatedMember.status}"`);
    }
    if (updatedMember.gugusDepan !== prevMember.gugusDepan) {
      changes.push(`Gudep: "${prevMember.gugusDepan}" -> "${updatedMember.gugusDepan}"`);
    }

    const auditDetail = changes.length > 0 
      ? `Perbaikan data anggota ${updatedMember.fullName}: ${changes.join('; ')}. Catatan: ${reason}`
      : `Pembaruan data profil anggota ${updatedMember.fullName}. Catatan: ${reason}`;

    this.addAuditLog(
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'ADMIN_EDIT_MEMBER',
      'MEMBER',
      memberId,
      auditDetail
    );

    // Send in-app notification to the member
    this.addNotification(
      updatedMember.userId,
      'Profil & Data Anggota Diperbarui',
      `Data profil & KTA Anda telah diperbaiki/disesuaikan oleh Admin (${adminUser.name}). Catatan: ${reason}`,
      'INFO',
      '/my-card'
    );

    this.notify();
    return updatedMember;
  }

  public updateMemberPhoto(memberId: string, photoUrl: string, adminUser: CurrentUser): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx === -1) return null;

    const member = members[idx];
    member.avatarUrl = photoUrl;
    members[idx] = member;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    // Synchronize current logged in user avatar if it matches this member
    const currentUser = this.getCurrentUser();
    if (currentUser.memberId === memberId || currentUser.id === member.userId || currentUser.name === member.fullName) {
      currentUser.avatarUrl = photoUrl;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }

    // Add Audit Log entry
    this.addAuditLog(
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'UPDATE_MEMBER_PHOTO',
      'MEMBER',
      memberId,
      `Memperbaiki dan memperbarui pas foto resmi KTA & profil anggota: ${member.fullName}`
    );

    // Send in-app notification to the member
    this.addNotification(
      member.userId,
      'Pas Foto KTA Diperbarui',
      `Pas foto resmi profil dan KTA Digital Anda telah diperbarui oleh Administrator (${adminUser.name}).`,
      'INFO',
      '/my-card'
    );

    this.notify();
    return member;
  }

  public addMemberSkill(memberId: string, skill: { skillId: string; proficiency: SkillProficiency; years: number; portfolio?: string }) {
    const members = this.getMembers();
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const masterSkill = this.getSkills().find(s => s.id === skill.skillId);
    if (!masterSkill) return;

    member.skills.push({
      id: `ms-${Date.now()}`,
      skillId: masterSkill.id,
      skillName: masterSkill.name,
      category: masterSkill.category,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.years,
      portfolioUrl: skill.portfolio,
      isVerified: true
    });

    this.updateMemberProfile(member);
  }

  // --- Tour Packages ---
  public getTourPackages(): TourPackage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOURS);
      return data ? JSON.parse(data) : INITIAL_TOUR_PACKAGES;
    } catch {
      return INITIAL_TOUR_PACKAGES;
    }
  }

  public getTourPackageBySlug(slug: string): TourPackage | undefined {
    return this.getTourPackages().find(t => t.slug === slug);
  }

  public createTourPackage(payload: Omit<TourPackage, 'id' | 'slug' | 'submittedAt' | 'viewsCount' | 'status'>): TourPackage {
    const newId = `tour-${Date.now()}`;
    const slug = (payload.title || 'paket-wisata')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Math.random().toString(36).substring(2, 6)}`;

    const newTour: TourPackage = {
      ...payload,
      id: newId,
      slug,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      viewsCount: 1,
      featured: false
    };

    const tours = this.getTourPackages();
    tours.unshift(newTour);
    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(tours));

    const user = this.getCurrentUser();
    this.addAuditLog(user.id, user.name, user.role, 'CREATE_TOUR_PACKAGE', 'TOUR_PACKAGE', newId, `Membuat & mengajukan paket wisata: ${newTour.title}`);

    this.addNotification(
      'user-admin-nasional',
      'Paket Wisata Baru Diajukan',
      `Paket wisata "${newTour.title}" oleh ${newTour.ownerName} menunggu moderasi.`,
      'ALERT',
      '/tours'
    );

    this.notify();
    return newTour;
  }

  public moderateTourPackage(tourId: string, status: TourStatus, reviewerName: string, rejectionReason?: string) {
    const tours = this.getTourPackages();
    const idx = tours.findIndex(t => t.id === tourId);
    if (idx === -1) return;

    tours[idx].status = status;
    tours[idx].reviewedBy = reviewerName;
    if (status === 'APPROVED_PUBLISHED') {
      tours[idx].publishedAt = new Date().toISOString();
      tours[idx].rejectionReason = undefined;
    } else if (status === 'REJECTED') {
      tours[idx].rejectionReason = rejectionReason;
    }

    localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(tours));

    const user = this.getCurrentUser();
    this.addAuditLog(user.id, user.name, user.role, `TOUR_MODERATED_${status}`, 'TOUR_PACKAGE', tourId, `Moderasi paket wisata "${tours[idx].title}" menjadi ${status}`);

    this.notify();
  }

  // --- Activities ---
  public getActivities(): Activity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  }

  public registerForActivity(activityId: string, member: Member): boolean {
    const activities = this.getActivities();
    const act = activities.find(a => a.id === activityId);
    if (!act) return false;

    act.registeredCount += 1;
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));

    this.addNotification(
      member.userId,
      'Pendaftaran Kegiatan Berhasil',
      `Anda telah terdaftar pada "${act.title}". Simpan barcode kehadiran di aplikasi.`,
      'SUCCESS',
      '/activities'
    );

    const user = this.getCurrentUser();
    this.addAuditLog(user.id, user.name, user.role, 'REGISTER_ACTIVITY', 'ACTIVITY', activityId, `Mendaftar kegiatan: ${act.title}`);

    this.notify();
    return true;
  }

  // --- Notifications & Audit ---
  public getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public markNotificationAsRead(id: string) {
    const notifs = this.getNotifications();
    const n = notifs.find(item => item.id === id);
    if (n) {
      n.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      this.notify();
    }
  }

  public addNotification(userId: string, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT', actionUrl?: string) {
    const notifs = this.getNotifications();
    notifs.unshift({
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      isRead: false,
      actionUrl
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  public getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  public addAuditLog(userId: string, userName: string, userRole: any, action: string, entityType: any, entityId: string, description: string) {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      userId,
      userName,
      userRole,
      action,
      entityType,
      entityId,
      description,
      timestamp: new Date().toISOString(),
      ipAddress: '180.252.164.12'
    });
    // Keep max 100 logs
    if (logs.length > 100) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  public getKtaSettings(): KtaCardSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KTA_SETTINGS);
      if (!data) return DEFAULT_KTA_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_KTA_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_KTA_SETTINGS;
    }
  }

  public updateKtaSettings(settings: Partial<KtaCardSettings>, updatedBy?: string): KtaCardSettings {
    const current = this.getKtaSettings();
    const updated: KtaCardSettings = {
      ...current,
      ...settings,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy || 'Administrator'
    };
    localStorage.setItem(STORAGE_KEYS.KTA_SETTINGS, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  public resetKtaSettings(updatedBy?: string): KtaCardSettings {
    const reset = {
      ...DEFAULT_KTA_SETTINGS,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy || 'Administrator'
    };
    localStorage.setItem(STORAGE_KEYS.KTA_SETTINGS, JSON.stringify(reset));
    this.notify();
    return reset;
  }

  // --- Kuliner & Cinderamata Khas Daerah (Kwarran Input) ---
  public getCulinarySouvenirs(): CulinarySouvenirItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CULINARY_SOUVENIRS);
      return data ? JSON.parse(data) : INITIAL_CULINARY_SOUVENIRS;
    } catch {
      return INITIAL_CULINARY_SOUVENIRS;
    }
  }

  public addCulinarySouvenir(
    item: Omit<CulinarySouvenirItem, 'id' | 'createdAt' | 'likesCount'>,
    currentUser: CurrentUser
  ): CulinarySouvenirItem {
    const items = this.getCulinarySouvenirs();
    const newItem: CulinarySouvenirItem = {
      ...item,
      id: `cs-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      status: item.status || 'PUBLISHED'
    };

    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.CULINARY_SOUVENIRS, JSON.stringify(items));

    // Add Audit Log
    this.addAuditLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'CREATE_CULINARY_SOUVENIR',
      'CULINARY_SOUVENIR',
      newItem.id,
      `Perekaman ${newItem.kind === 'KULINER' ? 'Kuliner Khas' : 'Cinderamata Khas'} "${newItem.name}" di ${newItem.districtName || 'Kwarran'}, ${newItem.regencyName || 'Kwarcab'}`
    );

    // Add Notification
    this.addNotification(
      'user-admin-nasional',
      `Karya Baru Terdaftar: ${newItem.name}`,
      `Anggota ${currentUser.name} menginput ${newItem.kind === 'KULINER' ? 'kuliner' : 'cinderamata'} khas ${newItem.districtName || 'Kwarran'}.`,
      'SUCCESS',
      '/dashboard'
    );

    this.notify();
    return newItem;
  }

  public updateCulinarySouvenir(
    id: string,
    updates: Partial<CulinarySouvenirItem>,
    currentUser: CurrentUser
  ): CulinarySouvenirItem | null {
    const items = this.getCulinarySouvenirs();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;

    const existing = items[idx];
    const updated: CulinarySouvenirItem = {
      ...existing,
      ...updates
    };

    items[idx] = updated;
    localStorage.setItem(STORAGE_KEYS.CULINARY_SOUVENIRS, JSON.stringify(items));

    this.addAuditLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'UPDATE_CULINARY_SOUVENIR',
      'CULINARY_SOUVENIR',
      id,
      `Pembaruan data produk "${updated.name}" oleh ${currentUser.name}`
    );

    this.notify();
    return updated;
  }

  public deleteCulinarySouvenir(id: string, currentUser: CurrentUser): boolean {
    const items = this.getCulinarySouvenirs();
    const target = items.find(i => i.id === id);
    if (!target) return false;

    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.CULINARY_SOUVENIRS, JSON.stringify(filtered));

    this.addAuditLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'DELETE_CULINARY_SOUVENIR',
      'CULINARY_SOUVENIR',
      id,
      `Penghapusan data ${target.kind} "${target.name}" oleh ${currentUser.name}`
    );

    this.notify();
    return true;
  }

  public likeCulinarySouvenir(id: string): number {
    const items = this.getCulinarySouvenirs();
    const target = items.find(i => i.id === id);
    if (!target) return 0;

    target.likesCount = (target.likesCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.CULINARY_SOUVENIRS, JSON.stringify(items));
    this.notify();
    return target.likesCount;
  }

  public resetToDefault() {
    localStorage.clear();
    this.init();
    this.notify();
  }
}

export const storage = new StorageService();
