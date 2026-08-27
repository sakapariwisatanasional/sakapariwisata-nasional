import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  MapPin, 
  Award, 
  Calendar, 
  Building,
  User,
  Sparkles,
  Lock
} from 'lucide-react';
import { Member } from '../../types';
import { SakaLogo } from '../common/SakaLogo';

interface MemberVerificationModalProps {
  member: Member | null;
  onClose: () => void;
}

export const MemberVerificationModal: React.FC<MemberVerificationModalProps> = ({
  member,
  onClose
}) => {
  if (!member) return null;

  const isVerified = member.status === 'ACTIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner with SakaLogo Key Visual */}
        <div className={`p-6 text-white text-center relative overflow-hidden ${
          isVerified 
            ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950' 
            : 'bg-gradient-to-br from-amber-700 via-orange-800 to-slate-900'
        }`}>
          {/* Watermark in Header */}
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
            <SakaLogo size={140} />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mx-auto mb-2 flex justify-center">
            <SakaLogo size={56} id="modal-saka-logo" />
          </div>

          <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-extrabold uppercase tracking-widest mb-1 text-purple-200 border border-purple-300/20">
            {isVerified ? 'Anggota Resmi Terverifikasi' : 'Status: Menunggu Verifikasi'}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight font-heading">
            Saka Pariwisata Kwartir Nasional
          </h3>
          <p className="text-xs text-purple-200/80 font-medium">
            Sistem Verifikasi Digital Nasional Kwartir Gerakan Pramuka
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Member Main Badge */}
          <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-base text-slate-900 truncate font-heading">
                {member.fullName}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-purple-900 font-bold font-mono mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>{member.nationalMemberNumber || 'Nomor Anggota Dalam Proses'}</span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {member.currentPosition || 'Anggota Saka'} • <strong className="text-purple-700">{member.krida}</strong>
              </p>
            </div>
          </div>

          {/* Safe Public Data Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Provinsi</p>
              <p className="font-bold text-slate-800 mt-0.5">{member.provinceName}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kabupaten/Kota</p>
              <p className="font-bold text-slate-800 mt-0.5">{member.regencyName}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kwartir Ranting</p>
              <p className="font-bold text-slate-800 mt-0.5 truncate">{member.branchName}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gugus Depan</p>
              <p className="font-bold text-slate-800 mt-0.5 truncate">{member.gugusDepan}</p>
            </div>
          </div>

          {/* Skills & Competencies */}
          {member.skills && member.skills.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Keahlian Kepariwisataan Terdaftar</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200/80 rounded-lg text-xs font-semibold"
                  >
                    {s.skillName} • <span className="text-purple-600 font-bold">{s.proficiency}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Notice (UU PDP Compliance) */}
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/60 text-[11px] text-purple-950 leading-relaxed">
            <span className="font-bold">🔒 Informasi Privasi & Keamanan:</span> Halaman ini hanya menampilkan data publik terverifikasi sesuai kebijakan perlindungan data pribadi nasional. Data privat (NIK, alamat lengkap, kontak pribadi) dilindungi secara terenkripsi.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            Token: {member.verificationToken}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
