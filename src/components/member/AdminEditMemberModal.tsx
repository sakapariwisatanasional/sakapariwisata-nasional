import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  MapPin, 
  Award, 
  Building, 
  Phone, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  RefreshCw,
  Edit3,
  Calendar,
  Layers,
  GraduationCap,
  Briefcase,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Member, CurrentUser, Province, Regency, District, Branch, KridaType, MemberStatus } from '../../types';

interface AdminEditMemberModalProps {
  isOpen: boolean;
  member: Member | null;
  currentUser: CurrentUser;
  onClose: () => void;
  onSuccess: (updatedMember: Member) => void;
}

export const AdminEditMemberModal: React.FC<AdminEditMemberModalProps> = ({
  isOpen,
  member,
  currentUser,
  onClose,
  onSuccess
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Form States
  const [fullName, setFullName] = useState('');
  const [nikMasked, setNikMasked] = useState('');
  const [gender, setGender] = useState<'LAKI_LAKI' | 'PEREMPUAN'>('LAKI_LAKI');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Domicile / Hierarchy
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedRegencyId, setSelectedRegencyId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [gugusDepan, setGugusDepan] = useState('');

  // Saka Position & Status
  const [krida, setKrida] = useState<KridaType>('Krida Pemandu');
  const [currentPosition, setCurrentPosition] = useState('');
  const [joinYear, setJoinYear] = useState(2024);
  const [status, setStatus] = useState<MemberStatus>('ACTIVE');
  const [educationLevel, setEducationLevel] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');

  // National Member Number (NTA)
  const [nationalMemberNumber, setNationalMemberNumber] = useState('');
  const [autoRegenerateNta, setAutoRegenerateNta] = useState(false);

  // Administrative Notes
  const [updateReason, setUpdateReason] = useState('Koreksi penulisan nama, gelar, dan penyesuaian domisili');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'DOMICILE' | 'SAKA' | 'REASON'>('IDENTITY');

  // Load Territory Data
  useEffect(() => {
    setProvinces(storage.getProvinces());
  }, []);

  // Populate Member Data when Opened
  useEffect(() => {
    if (member && isOpen) {
      setFullName(member.fullName || '');
      setNikMasked(member.nikMasked || '');
      setGender(member.gender || 'LAKI_LAKI');
      setBirthPlace(member.birthPlace || '');
      setBirthDate(member.birthDate || '');
      setPhone(member.phone || '');
      setEmail(member.email || '');
      setAddress(member.address || '');

      setSelectedProvinceId(member.provinceId || '32');
      setSelectedRegencyId(member.regencyId || '32.06');
      setSelectedDistrictId(member.districtId || '32.06.12');
      setSelectedBranchId(member.branchId || '');

      setGugusDepan(member.gugusDepan || '');
      setKrida(member.krida || 'Krida Pemandu');
      setCurrentPosition(member.currentPosition || 'Anggota Krida Pemandu');
      setJoinYear(member.joinYear || 2024);
      setStatus(member.status || 'ACTIVE');
      setEducationLevel(member.educationLevel || 'SMA / Sederajat');
      setOccupation(member.occupation || 'Pelajar / Mahasiswa');
      setBio(member.bio || '');

      setNationalMemberNumber(member.nationalMemberNumber || '');
      setAutoRegenerateNta(false);
      setUpdateReason('Koreksi data profil dan domisili anggota oleh Operator');
      setActiveTab('IDENTITY');
    }
  }, [member, isOpen]);

  // Load Regencies when Province changes
  useEffect(() => {
    if (selectedProvinceId) {
      const regs = storage.getRegencies(selectedProvinceId);
      setRegencies(regs);
      // Only reset if current selected regency doesn't belong to this province
      if (regs.length > 0 && !regs.some(r => r.id === selectedRegencyId)) {
        setSelectedRegencyId(regs[0].id);
      }
    }
  }, [selectedProvinceId]);

  // Load Districts when Regency changes
  useEffect(() => {
    if (selectedRegencyId) {
      const dists = storage.getDistricts(selectedRegencyId);
      setDistricts(dists);
      if (dists.length > 0 && !dists.some(d => d.id === selectedDistrictId)) {
        setSelectedDistrictId(dists[0].id);
      }
    }
  }, [selectedRegencyId]);

  // Load Branches when District changes
  useEffect(() => {
    if (selectedDistrictId) {
      const brs = storage.getBranches(selectedDistrictId);
      setBranches(brs);
      if (brs.length > 0 && !brs.some(b => b.id === selectedBranchId)) {
        setSelectedBranchId(brs[0].id);
      }
    }
  }, [selectedDistrictId]);

  if (!isOpen || !member) return null;

  const isRegencyOperator = currentUser.role === 'ADMIN_REGENCY';
  const isProvinceAdmin = currentUser.role === 'ADMIN_PROVINCE';
  const isBranchAdmin = currentUser.role === 'ADMIN_BRANCH';

  // Check if this Operator has permission to edit this member
  const isDeniedForRegency = isRegencyOperator && currentUser.jurisdictionId && member.regencyId !== currentUser.jurisdictionId;
  const isDeniedForProvince = isProvinceAdmin && currentUser.jurisdictionId && member.provinceId !== currentUser.jurisdictionId;
  const isDeniedForBranch = isBranchAdmin && currentUser.jurisdictionId && member.branchId !== currentUser.jurisdictionId;
  const isUnauthorized = isDeniedForRegency || isDeniedForProvince || isDeniedForBranch;

  const currentProvince = provinces.find(p => p.id === selectedProvinceId);
  const currentRegency = regencies.find(r => r.id === selectedRegencyId);
  const currentDistrict = districts.find(d => d.id === selectedDistrictId);
  const currentBranch = branches.find(b => b.id === selectedBranchId);

  const handleGenerateNewNta = () => {
    if (currentProvince && currentRegency && currentDistrict) {
      const newNta = storage.generateNationalMemberNumber(
        currentProvince.code,
        currentRegency.code,
        currentDistrict.code
      );
      setNationalMemberNumber(newNta);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (isUnauthorized) {
      alert('Akses Ditolak: Anda tidak memiliki wewenang untuk mengedit data anggota di luar wilayah Kwartir Anda.');
      return;
    }

    if (isRegencyOperator && currentUser.jurisdictionId && selectedRegencyId !== currentUser.jurisdictionId) {
      alert('Akses Dibatasi: Operator Kwartir Cabang tidak diizinkan memindahkan anggota ke Kwartir Cabang lain.');
      return;
    }

    if (!fullName.trim()) {
      alert('Nama lengkap tidak boleh kosong');
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine final NTA
      let finalNta = nationalMemberNumber;
      if (autoRegenerateNta && currentProvince && currentRegency && currentDistrict) {
        finalNta = storage.generateNationalMemberNumber(
          currentProvince.code,
          currentRegency.code,
          currentDistrict.code
        );
      }

      const updatedPayload: Partial<Member> = {
        fullName: fullName.trim(),
        nikMasked: nikMasked.trim(),
        gender,
        birthPlace: birthPlace.trim(),
        birthDate,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),

        provinceId: selectedProvinceId,
        provinceName: currentProvince?.name || member.provinceName,
        regencyId: selectedRegencyId,
        regencyName: currentRegency?.name || member.regencyName,
        districtId: selectedDistrictId,
        districtName: currentDistrict?.name || member.districtName,
        branchId: selectedBranchId || member.branchId,
        branchName: currentBranch?.name || `Kwarran ${currentDistrict?.name || 'Pariwisata'}`,

        gugusDepan: gugusDepan.trim(),
        krida,
        currentPosition: currentPosition.trim() || `Anggota ${krida}`,
        joinYear: Number(joinYear),
        status,
        educationLevel,
        occupation: occupation.trim(),
        bio: bio.trim(),

        nationalMemberNumber: finalNta || member.nationalMemberNumber
      };

      const result = storage.adminUpdateMember(
        member.id,
        updatedPayload,
        currentUser,
        updateReason.trim() || 'Perbaikan profil oleh Operator Kwartir'
      );

      if (result) {
        onSuccess(result);
        onClose();
      }
    } catch (err) {
      console.error('Error updating member:', err);
      alert('Terjadi kesalahan saat menyimpan perubahan profil anggota.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If unauthorized to edit this member, render an access restriction barrier
  if (isUnauthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 overflow-hidden">
          <div className="p-5 bg-rose-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-rose-300" />
              <h3 className="font-bold text-base font-heading">Akses Ditolak (Isolasi Cabang)</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-rose-800 hover:bg-rose-700 flex items-center justify-center text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-4 text-xs text-slate-700">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
              <p className="font-semibold text-rose-900 leading-relaxed">
                Anda sedang masuk sebagai <strong>{currentUser.name}</strong> ({currentUser.jurisdictionName}).
              </p>
              <p className="text-slate-600 leading-relaxed">
                Anggota <strong>{member.fullName}</strong> terdaftar pada <strong>{member.regencyName} ({member.provinceName})</strong>. Sebagai Operator Khusus Cabang, Anda hanya memiliki hak akses untuk menginput dan mengedit data anggota di dalam Kwartir Cabang Anda sendiri.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Kembali ke Daftar Anggota
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-heading">Koreksi & Pembaruan Profil Anggota</h3>
                <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 border border-purple-400/30 rounded-md text-[10px] font-mono font-bold">
                  {isRegencyOperator ? 'Operator Cabang' : 'Hak Akses Admin'}
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Ubah nama lengkap, gelar akademis/kepramukaan, kontak, peminatan krida, dan gudep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Member Quick Info Bar */}
        <div className="px-6 py-3 bg-purple-50/60 border-b border-purple-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="w-9 h-9 rounded-xl object-cover border border-purple-200 shadow-xs"
            />
            <div>
              <span className="font-bold text-slate-900 text-sm">{member.fullName}</span>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span className="font-mono">{member.nationalMemberNumber || 'Belum Ada NTA'}</span>
                <span>•</span>
                <span>{member.regencyName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-purple-200/70 shadow-xs">
            <span className="text-[11px] text-slate-500">Operator:</span>
            <span className="font-bold text-purple-950">{currentUser.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('IDENTITY')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'IDENTITY'
                ? 'border-purple-900 text-purple-950 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Identitas & Gelar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DOMICILE')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'DOMICILE'
                ? 'border-purple-900 text-purple-950 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>2. Domisili & Kwartir</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SAKA')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'SAKA'
                ? 'border-purple-900 text-purple-950 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>3. Krida & Status KTA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REASON')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'REASON'
                ? 'border-purple-900 text-purple-950 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>4. Catatan Perubahan</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
          
          {/* TAB 1: IDENTITAS & GELAR */}
          {activeTab === 'IDENTITY' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Perubahan nama lengkap dan gelar akan langsung otomatis diperbarui pada <strong>Kartu Tanda Anggota (KTA) Digital</strong>, <strong>sertifikat keahlian</strong>, dan <strong>dokumen cetak PDF</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">
                    Nama Lengkap & Gelar Resmi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Muhammad Farhan, S.Par. / Kak Siti Nurhaliza, M.Pd."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-900 font-semibold text-sm"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Termasuk gelar akademis, gelar keagamaan, atau sebutan kepanduan resmi.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    value={nikMasked}
                    onChange={(e) => setNikMasked(e.target.value)}
                    placeholder="320612******0001"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  >
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Contoh: Tasikmalaya"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tingkat Pendidikan</label>
                  <input
                    type="text"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    placeholder="SMA / Diploma / S1 Pariwisata"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Pekerjaan / Aktivitas</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Pemandu Wisata / Mahasiswa / Wirausaha"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Ringkasan Profil / Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Pengalaman, ketertarikan wisata, atau deskripsi singkat..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOMISILI & KWARTIR */}
          {activeTab === 'DOMICILE' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {isRegencyOperator ? (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Hak Khusus Operator Cabang ({currentUser.jurisdictionName}):</strong> Anda dapat mengubah data kontak, alamat, gugus depan, dan ranting di dalam cabang ini. Pilihan Kwartir Cabang dikunci.
                  </p>
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-purple-900">
                  <MapPin className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Perubahan domisili akan memindahkan keanggotaan ke Kwartir baru dan secara otomatis tercatat dalam <strong>Riwayat Mutasi / Lokasi Anggota</strong>.
                  </p>
                </div>
              )}

              {/* Kontak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Alamat Lengkap Domisili</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama Jalan, RT/RW, Dusun/Kelurahan..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800 resize-none"
                  />
                </div>
              </div>

              {/* Struktur Wilayah Kwartir */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-800" />
                    <span>Struktur Organisasi & Kwartir Wilayah</span>
                  </span>
                  {isRegencyOperator && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-300">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Kwarcab Terkunci
                    </span>
                  )}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Kwartir Daerah (Provinsi) {isRegencyOperator && <span className="text-amber-700 text-[10px]">(Terkunci)</span>}
                    </label>
                    <select
                      disabled={isRegencyOperator || isProvinceAdmin || isBranchAdmin}
                      value={selectedProvinceId}
                      onChange={(e) => setSelectedProvinceId(e.target.value)}
                      className={`w-full px-3.5 py-2 border rounded-xl outline-none text-slate-800 ${
                        isRegencyOperator || isProvinceAdmin || isBranchAdmin
                          ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-50 border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600'
                      }`}
                    >
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Kwartir Cabang (Kabupaten / Kota) {isRegencyOperator && <span className="text-amber-700 text-[10px]">(Khusus Wilayah Anda)</span>}
                    </label>
                    <select
                      disabled={isRegencyOperator || isBranchAdmin}
                      value={selectedRegencyId}
                      onChange={(e) => setSelectedRegencyId(e.target.value)}
                      className={`w-full px-3.5 py-2 border rounded-xl outline-none ${
                        isRegencyOperator || isBranchAdmin
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold cursor-not-allowed'
                          : 'bg-slate-50 border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 text-slate-800'
                      }`}
                    >
                      {regencies.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Kecamatan (Distrik / Kwarran)</label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                    >
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Pangkalan Saka / Kwarran</label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">Gugus Depan (Gudep) & Pangkalan</label>
                    <input
                      type="text"
                      value={gugusDepan}
                      onChange={(e) => setGugusDepan(e.target.value)}
                      placeholder="Contoh: 06.12.01-02 Pangkalan SMK Negeri 1 Pariwisata"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KRIDA & STATUS KTA */}
          {activeTab === 'SAKA' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Peminatan Krida Saka</label>
                  <select
                    value={krida}
                    onChange={(e: any) => setKrida(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800 font-semibold"
                  >
                    <option value="Krida Pemandu">Krida Pemandu (Tour Guiding & Ekowisata)</option>
                    <option value="Krida Penyuluh">Krida Penyuluh (Sadarlah Sapta Pesona & Edukasi)</option>
                    <option value="Krida Mice & Event">Krida MICE & Event (Manajemen Acara & Atraksi)</option>
                    <option value="Krida Kuliner & Cinderamata">Krida Kuliner & Cinderamata (UMKM & Budaya)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Posisi / Jabatan Kepengurusan</label>
                  <input
                    type="text"
                    value={currentPosition}
                    onChange={(e) => setCurrentPosition(e.target.value)}
                    placeholder="Contoh: Anggota Krida / Dewan Saka / Instruktur"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Status Keanggotaan</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800 font-bold"
                  >
                    <option value="ACTIVE">AKTIF (KTA Terverifikasi Penuh)</option>
                    <option value="PENDING">PENDING (Menunggu Verifikasi)</option>
                    <option value="REVISION_REQUIRED">PERLU PERBAIKAN DOKUMEN</option>
                    <option value="SUSPENDED">SUSPENDED (Ditangguhkan)</option>
                    <option value="INACTIVE">NONAKTIF</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tahun Bergabung Saka</label>
                  <input
                    type="number"
                    value={joinYear}
                    onChange={(e) => setJoinYear(Number(e.target.value))}
                    min={2000}
                    max={2030}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800"
                  />
                </div>

                {/* Nomor Anggota Nasional (NTA) */}
                <div className="md:col-span-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800">Nomor Tanda Anggota (NTA)</label>
                    <button
                      type="button"
                      onClick={handleGenerateNewNta}
                      className="text-[11px] text-purple-900 hover:text-purple-950 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Generate Sesuai Kode Wilayah Terpilih</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={nationalMemberNumber}
                    onChange={(e) => setNationalMemberNumber(e.target.value)}
                    placeholder="Contoh: 32.06.12.000001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-purple-950 font-mono font-bold text-sm tracking-wider"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Format Standar Nasional: [Kode Prov].[Kode Kab/Kota].[Kode Kec].[Urutan 6 Digit]
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CATATAN PERUBAHAN & AUDIT TRAIL */}
          {activeTab === 'REASON' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <label className="block font-bold text-slate-900 mb-1.5 text-xs">
                  Alasan / Catatan Perubahan Data Administratif <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  placeholder="Contoh: Koreksi penulisan ejaan nama dan penambahan gelar S.Par. berdasarkan verifikasi ijazah..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none text-slate-800 text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Catatan ini akan tersimpan permanen pada sistem <strong>Audit Trail Kwartir</strong> dan disampaikan melalui notifikasi aplikasi kepada anggota yang bersangkutan.
                </p>
              </div>

              {/* Summary of What Will Be Saved */}
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <h5 className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ringkasan Data yang Akan Disimpan:</span>
                </h5>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-500">Nama:</span> <strong className="text-slate-900">{fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Krida:</span> <strong className="text-purple-950">{krida}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Wilayah:</span> <strong>{currentRegency?.name || member.regencyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span> <strong className="text-emerald-700">{status}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Tab aktif: {activeTab === 'IDENTITY' ? 'Identitas' : activeTab === 'DOMICILE' ? 'Domisili' : activeTab === 'SAKA' ? 'Krida' : 'Catatan'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-950 hover:to-indigo-950 text-white rounded-xl font-bold transition-all shadow-md shadow-purple-950/20 flex items-center gap-2 cursor-pointer text-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-300" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan Data'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
