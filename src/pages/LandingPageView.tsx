import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  QrCode, 
  Compass, 
  Award, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Utensils, 
  Calendar, 
  Lock, 
  UserPlus, 
  FileSpreadsheet, 
  FolderOpen,
  ExternalLink,
  ChevronRight,
  Eye,
  Star,
  Layers,
  Heart,
  Globe2
} from 'lucide-react';
import { Member, TourPackage, CulinarySouvenirItem, CurrentUser } from '../types';
import { SakaLogo } from '../components/common/SakaLogo';
import { DEFAULT_SPREADSHEET_URL } from '../services/spreadsheetService';
import { GOOGLE_DRIVE_MAIN_FOLDER } from '../services/driveRepository';

interface LandingPageViewProps {
  currentUser: CurrentUser;
  members: Member[];
  tours: TourPackage[];
  culinaryItems: CulinarySouvenirItem[];
  onOpenLoginModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenVerifyModal: (member: Member) => void;
  onViewTourDetail: (tour: TourPackage) => void;
  onSelectCulinaryDetail: (item: CulinarySouvenirItem) => void;
  onOpenSpreadsheetModal: () => void;
  onOpenDriveModal?: () => void;
  onEnterDashboard: (tab?: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  currentUser,
  members,
  tours,
  culinaryItems,
  onOpenLoginModal,
  onOpenRegisterModal,
  onOpenVerifyModal,
  onViewTourDetail,
  onSelectCulinaryDetail,
  onOpenSpreadsheetModal,
  onOpenDriveModal,
  onEnterDashboard
}) => {
  const [quickVerifyTerm, setQuickVerifyTerm] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;
  const publishedTours = tours.filter(t => t.status === 'APPROVED_PUBLISHED');

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');

    const term = quickVerifyTerm.trim().toLowerCase();
    if (!term) return;

    const found = members.find(m => 
      (m.nationalMemberNumber && m.nationalMemberNumber.toLowerCase() === term) ||
      (m.verificationToken && m.verificationToken.toLowerCase() === term) ||
      m.id.toLowerCase() === term ||
      m.fullName.toLowerCase().includes(term)
    );

    if (found) {
      onOpenVerifyModal(found);
    } else {
      setVerifyError('Data anggota tidak ditemukan. Pastikan Nomor KTA atau Nama yang dimasukkan sudah benar.');
    }
  };

  const kridaList = [
    {
      title: 'Krida Pemandu',
      subtitle: 'Bina Pemandu Wisata',
      desc: 'Keahlian kepemanduan wisata alam, sejarah, budaya, interpretasi objek wisata, dan keselamatan perjalanan.',
      badge: 'Tour Guide & Storyteller',
      color: 'from-amber-600 to-orange-600'
    },
    {
      title: 'Krida Penyuluh',
      subtitle: 'Bina Objek & Penyuluhan',
      desc: 'Penyuluhan sadar wisata, penerapan 7 unsur Sapta Pesona, pelestarian lingkungan, dan edukasi kepariwisataan.',
      badge: 'Sapta Pesona & Edukasi',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      title: 'Krida Mice & Event',
      subtitle: 'Bina Atraksi & MICE',
      desc: 'Pengelolaan atraksi budaya, festival kepemudaan, pameran pariwisata, pertemuan (MICE), dan kreasi seni tradisi.',
      badge: 'Event Organizer & Atraksi',
      color: 'from-purple-600 to-indigo-600'
    },
    {
      title: 'Krida Kuliner & Cinderamata',
      subtitle: 'Karya Khas Daerah',
      desc: 'Pengembangan kuliner warisan lokal, kerajinan tangan, cinderamata kreatif khas daerah, dan pemberdayaan UMKM.',
      badge: 'Gastronomi & Kriya UMKM',
      color: 'from-rose-600 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SakaLogo size={42} id="landing-saka-logo" />
          <div>
            <h1 className="text-base sm:text-lg font-extrabold font-heading tracking-wide uppercase text-white flex items-center gap-1.5">
              <span>Saka</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">Pariwisata</span>
            </h1>
            <p className="text-[10px] text-purple-200/70 tracking-wider font-semibold uppercase">
              Kwartir Nasional Gerakan Pramuka
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenDriveModal && (
            <button
              type="button"
              onClick={onOpenDriveModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900/90 text-purple-300 border border-purple-700/60 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Google Drive Repository Aset & Gambar"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Media Drive</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSpreadsheetModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Database Google Spreadsheet Terhubung"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database Spreadsheet</span>
          </button>

          <button
            type="button"
            onClick={onOpenLoginModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Masuk / Login</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Anggota</span>
          </button>

          <button
            type="button"
            onClick={() => onEnterDashboard('dashboard')}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <span>Buka Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Digital Resmi Saka Pariwisata Indonesia</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight sm:leading-none">
            Keanggotaan Nasional & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-300 to-teal-300">
              Pemberdayaan Pariwisata Indonesia
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Menghubungkan Pramuka Penegak & Pandega di seluruh Kwartir Daerah, Cabang, dan Ranting dengan KTA Digital Berbasis QR Code, Direktori Keahlian, Paket Wisata Komunitas, serta Katalog Kuliner & Cinderamata Khas Daerah.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenRegisterModal}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/50 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Daftar Anggota Saka Baru</span>
            </button>

            <button
              onClick={() => onEnterDashboard('verify-portal')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Jelajah Paket Wisata & Karya</span>
            </button>

            <button
              onClick={onOpenLoginModal}
              className="px-6 py-3.5 bg-purple-900/60 hover:bg-purple-900 text-purple-200 font-bold text-sm rounded-2xl border border-purple-700/60 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-purple-300" />
              <span>Masuk Akun Pengurus / Operator</span>
            </button>
          </div>

          {/* 3. QUICK VERIFICATION BOX */}
          <div className="pt-8 max-w-2xl mx-auto">
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading">
                    Verifikasi Keaslian KTA & Nomor Anggota
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Sistem Real-Time
                </span>
              </div>

              <form onSubmit={handleQuickVerify} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={quickVerifyTerm}
                    onChange={(e) => setQuickVerifyTerm(e.target.value)}
                    placeholder="Masukkan No. Anggota (31.71.01.2025.0001) atau Nama Anggota..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifikasi</span>
                </button>
              </form>

              {verifyError && (
                <p className="text-xs text-amber-400 bg-amber-950/60 p-2.5 rounded-xl border border-amber-800/60">
                  {verifyError}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. METRICS / STATS BAR */}
      <section className="border-y border-slate-800 bg-slate-950/60 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">{activeMembersCount}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Anggota Terverifikasi</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading">{publishedTours.length}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Paket Wisata Komunitas</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-heading">{culinaryItems.length}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Kuliner & Cinderamata</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-heading">38 Kwarda</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Cakupan Seluruh Indonesia</p>
          </div>
        </div>
      </section>

      {/* 5. 4 KRIDA SAKA PARIWISATA */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            4 Krida Pembinaan Saka Pariwisata
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Spesialisasi keahlian dan kecakapan khusus (SKK) untuk mengembangkan potensi kepariwisataan berbasis kearifan lokal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kridaList.map((k, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/50 transition-all space-y-4 group hover:-translate-y-1 shadow-lg"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${k.color} flex items-center justify-center text-white shadow-md font-bold text-lg font-heading`}>
                {idx + 1}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  {k.badge}
                </span>
                <h3 className="text-lg font-bold text-white font-heading mt-0.5 group-hover:text-purple-300 transition-colors">
                  {k.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400">{k.subtitle}</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {k.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PAKET WISATA & KULINER SPOTLIGHT */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Wisata & Karya Komunitas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
              Jelajahi Paket Wisata & Cinderamata Khas
            </h2>
          </div>

          <button
            onClick={() => onEnterDashboard('tours')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            <span>Lihat Semua Direktori</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedTours.slice(0, 3).map((tour) => (
            <div
              key={tour.id}
              onClick={() => onViewTourDetail(tour)}
              className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-purple-500/60 transition-all cursor-pointer group shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.coverImageUrl}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/85 backdrop-blur-xs text-purple-300 text-[10px] font-bold rounded-lg border border-purple-500/30">
                  {tour.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-emerald-950/90 text-emerald-300 text-xs font-extrabold rounded-lg border border-emerald-500/30">
                  Rp {((tour as any).price ?? tour.pricePerPerson ?? 0).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{tour.regencyName}, {tour.provinceName}</span>
                </div>
                <h4 className="font-bold text-white text-sm font-heading group-hover:text-purple-300 transition-colors line-clamp-1">
                  {tour.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tour.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Krida Approved Products Showcase for Public Visitors */}
        {culinaryItems.filter(c => (c.status || 'APPROVED') === 'APPROVED').length > 0 && (
          <div className="pt-8 border-t border-slate-850 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Karya Anggota 4 Krida Terverifikasi
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1">
                  Produk, Kriya & Kuliner Khas Siap Pesan
                </h3>
              </div>

              <button
                onClick={() => onEnterDashboard('culinary-souvenirs')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <span>Buka Galeri 4 Krida Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {culinaryItems
                .filter(c => (c.status || 'APPROVED') === 'APPROVED')
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectCulinaryDetail(item)}
                    className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                  >
                    <div className="relative h-40 overflow-hidden bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-amber-500/90 text-slate-950 text-[10px] font-extrabold rounded-md backdrop-blur-xs">
                        {item.krida || (item.kind === 'KULINER' ? 'Kuliner' : 'Cinderamata')}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-slate-950/85 text-emerald-400 text-[11px] font-mono font-bold rounded-md">
                        Rp {(item.priceEstimate ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          {item.districtName} • {item.regencyName}
                        </p>
                        <h4 className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-300 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate">Oleh {item.authorName}</span>
                        <span className="text-amber-400 font-bold text-[10px]">Detail →</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* 7. FOOTER & SPREADSHEET DATABASE BADGE */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <SakaLogo size={36} id="landing-footer-logo" />
            <div>
              <p className="font-bold text-white">Saka Pariwisata Indonesia</p>
              <p className="text-[11px] text-slate-500">Kwartir Nasional Gerakan Pramuka</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {onOpenDriveModal && (
              <>
                <button
                  onClick={onOpenDriveModal}
                  className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 cursor-pointer font-semibold"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Media Google Drive</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}
            <button
              onClick={onOpenSpreadsheetModal}
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 cursor-pointer font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Database Google Spreadsheet</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onEnterDashboard('dashboard')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dashboard Pengurus
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenLoginModal}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Masuk / Login
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenRegisterModal}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Daftar Anggota
            </button>
          </div>

          <p className="text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} Satuan Karya Pramuka Pariwisata Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
};
