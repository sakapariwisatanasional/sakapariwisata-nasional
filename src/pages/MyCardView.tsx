import React from 'react';
import { 
  CreditCard, 
  Download, 
  Printer, 
  FileDown,
  Eye, 
  MapPin, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  History,
  Calendar,
  Sliders,
  Camera,
  Edit3
} from 'lucide-react';
import { Member, CurrentUser } from '../types';
import { DigitalMemberCard } from '../components/member/DigitalMemberCard';

interface MyCardViewProps {
  currentUser: CurrentUser;
  members: Member[];
  onOpenVerifyModal: (member: Member) => void;
  onOpenEditCardModal?: () => void;
  onOpenEditPhotoModal?: (member: Member) => void;
  onOpenEditMemberModal?: (member: Member) => void;
  onOpenPrintPdfModal?: (member: Member) => void;
}

export const MyCardView: React.FC<MyCardViewProps> = ({
  currentUser,
  members,
  onOpenVerifyModal,
  onOpenEditCardModal,
  onOpenEditPhotoModal,
  onOpenEditMemberModal,
  onOpenPrintPdfModal
}) => {
  const member = members.find(m => m.id === currentUser.memberId) || members[0];
  const isAdmin = currentUser.role !== 'MEMBER' && currentUser.role !== 'PUBLIC';

  if (!member) {
    return (
      <div className="p-12 text-center text-slate-400">
        Data KTA anggota tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-900 text-[11px] font-extrabold uppercase tracking-widest rounded-full">
              Kartu Tanda Anggota Elektronik
            </span>
            {isAdmin && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                Admin Mode
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            KTA Digital Saka Pariwisata
          </h2>
          <p className="text-xs text-slate-500">
            Tanda pengenal resmi tingkat nasional dengan konversi PDF standar cetak global ISO/IEC 7810 ID-1
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {onOpenPrintPdfModal && (
            <button
              onClick={() => onOpenPrintPdfModal(member)}
              className="flex-shrink-0 px-4 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-950/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-purple-300" />
              <span>Cetak / Unduh PDF KTA</span>
            </button>
          )}

          {isAdmin && onOpenEditMemberModal && (
            <button
              onClick={() => onOpenEditMemberModal(member)}
              className="flex-shrink-0 px-4 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-2xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              title="Koreksi nama, gelar, data profil atau domisili kwartir"
            >
              <Edit3 className="w-4 h-4 text-indigo-300" />
              <span>Koreksi Profil & Domisili</span>
            </button>
          )}

          {onOpenEditPhotoModal && (
            <button
              onClick={() => onOpenEditPhotoModal(member)}
              className="flex-shrink-0 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              title="Unggah berkas atau ganti link pas foto resmi KTA Anda"
            >
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Ubah Foto KTA</span>
            </button>
          )}

          {isAdmin && onOpenEditCardModal && (
            <button
              onClick={onOpenEditCardModal}
              className="flex-shrink-0 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Edit Tampilan KTA</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Card Display */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-6">
        <DigitalMemberCard
          member={member}
          onVerifyClick={onOpenVerifyModal}
          onEditCard={isAdmin ? onOpenEditCardModal : undefined}
          onEditPhoto={onOpenEditPhotoModal ? () => onOpenEditPhotoModal(member) : undefined}
          onEditMemberProfile={isAdmin && onOpenEditMemberModal ? () => onOpenEditMemberModal(member) : undefined}
          onPrintPdf={onOpenPrintPdfModal ? () => onOpenPrintPdfModal(member) : undefined}
          showControls={true}
          allowAdminEdit={isAdmin}
        />

        <div className="text-center text-xs text-slate-400 max-w-md">
          <p>Klik kartu di atas untuk membalik dan melihat ketentuan, barcode, serta pengesahan Kwartir Nasional.</p>
        </div>
      </div>

      {/* Profile & Credentials Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detail Kepramukaan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 font-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Informasi Keanggotaan</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Nomor Anggota</span>
              <span className="font-mono font-bold text-emerald-800">{member.nationalMemberNumber}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Pangkalan Ranting</span>
              <span className="font-semibold text-slate-800">{member.branchName}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Kwartir Cabang</span>
              <span className="font-semibold text-slate-800">{member.regencyName}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Kwartir Daerah</span>
              <span className="font-semibold text-slate-800">{member.provinceName}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Gugus Depan</span>
              <span className="font-semibold text-slate-800">{member.gugusDepan}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-500">Krida Utama</span>
              <span className="font-bold text-emerald-700">{member.krida}</span>
            </div>
          </div>
        </div>

        {/* Keahlian & Riwayat */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 font-heading flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Keahlian & Sertifikasi Terdaftar</span>
          </h3>

          <div className="space-y-2">
            {member.skills && member.skills.length > 0 ? (
              member.skills.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{s.skillName}</p>
                    <p className="text-[10px] text-slate-400">{s.category}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold">
                    {s.proficiency}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Belum ada keahlian terverifikasi.</p>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onOpenVerifyModal(member)}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Buka Tampilan Verifikasi Publik (QR)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
