import React, { useState } from 'react';
import { 
  Users, 
  Compass, 
  Clock, 
  MapPin, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight, 
  UserPlus, 
  ExternalLink,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  Sliders,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { Member, TourPackage, CurrentUser, Province, CulinarySouvenirItem } from '../types';
import { DigitalMemberCard } from '../components/member/DigitalMemberCard';
import { NationalMapVisual } from '../components/dashboard/NationalMapVisual';
import { CulinarySouvenirGallerySection } from '../components/dashboard/CulinarySouvenirGallerySection';
import { TourPackageCarouselSection } from '../components/dashboard/TourPackageCarouselSection';
import { IntegratedTourismShowcaseGallery } from '../components/dashboard/IntegratedTourismShowcaseGallery';
import { DashboardWidget } from '../components/dashboard/DashboardWidget';
import { SakaLogo } from '../components/common/SakaLogo';
import { storage } from '../services/storage';

interface DashboardViewProps {
  currentUser: CurrentUser;
  members: Member[];
  tours: TourPackage[];
  provinces: Province[];
  culinaryItems?: CulinarySouvenirItem[];
  onSelectTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onVerifyMember: (member: Member) => void;
  onApproveMemberQuick: (memberId: string) => void;
  onViewTourDetail: (tour: TourPackage) => void;
  onOpenEditCardModal?: () => void;
  onOpenCulinaryFormModal?: (item?: CulinarySouvenirItem) => void;
  onSelectCulinaryDetail?: (item: CulinarySouvenirItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  members,
  tours,
  provinces,
  culinaryItems,
  onSelectTab,
  onOpenRegisterModal,
  onVerifyMember,
  onApproveMemberQuick,
  onViewTourDetail,
  onOpenEditCardModal,
  onOpenCulinaryFormModal,
  onSelectCulinaryDetail
}) => {
  const isPublic = currentUser.role === 'PUBLIC';
  const isAdmin = currentUser.role !== 'MEMBER' && currentUser.role !== 'GUEST' && !isPublic;
  const ktaSettings = storage.getKtaSettings();
  const currentOpacityPct = Math.round((ktaSettings.bgOpacity ?? 0.10) * 100);

  // Live Culinary & Souvenir items
  const liveCulinaryItems = culinaryItems || storage.getCulinarySouvenirs();

  // Stats Calculation
  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;
  const pendingMembers = members.filter(m => m.status === 'PENDING');
  const publishedTours = tours.filter(t => t.status === 'APPROVED_PUBLISHED');
  
  // State for Public Dashboard Tour Filters
  const [selectedTourCategory, setSelectedTourCategory] = useState<string>('ALL');
  const [tourSearch, setTourSearch] = useState<string>('');

  // Extract categories from published tours
  const tourCategories = Array.from(new Set(publishedTours.map(t => t.category).filter(Boolean)));

  const filteredPublicTours = publishedTours.filter(t => {
    const matchCat = selectedTourCategory === 'ALL' || t.category === selectedTourCategory;
    const q = tourSearch.toLowerCase().trim();
    const matchQuery = !q || 
      t.title.toLowerCase().includes(q) ||
      t.locationName.toLowerCase().includes(q) ||
      t.provinceName.toLowerCase().includes(q) ||
      t.regencyName.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  // =========================================================================
  // TAMPILAN DASHBOARD KHUSUS PERAN PUBLIK (WISATAWAN / PENGUNJUNG UMUM)
  // Hanya menampilkan Ucapan Selamat Datang dan Paket-Paket Wisata (Tanpa KTA & Tanpa Pendaftaran Anggota)
  // =========================================================================
  if (isPublic) {
    return (
      <div className="space-y-6 sm:space-y-8 pb-16">
        {/* 1. Welcome Banner Publik */}
        <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-white shadow-xl border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-12 -bottom-10 opacity-10 pointer-events-none">
            <SakaLogo size={220} />
          </div>
          
          <div className="flex items-center gap-4 z-10 max-w-2xl">
            <SakaLogo size={60} id="public-dashboard-logo" className="hidden sm:inline-flex flex-shrink-0" />
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-purple-500/20 border border-purple-400/40 rounded-full text-purple-200 text-[11px] sm:text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Portal Eksplorasi Saka Pariwisata Indonesia</span>
              </div>
              <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight text-white">
                Selamat Datang di Saka Pariwisata
              </h2>
              <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
                Jelajahi keindahan destinasi nusantara, desa wisata, dan ekowisata binaan kader Gerakan Pramuka Saka Pariwisata dari Sabang sampai Merauke.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 z-10 w-full md:w-auto">
            <button
              onClick={() => onSelectTab('tours')}
              className="flex-1 md:flex-none px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Compass className="w-4 h-4 text-slate-900" />
              <span>Semua Paket Wisata</span>
            </button>

            <button
              onClick={() => onSelectTab('verify-portal')}
              className="flex-1 md:flex-none px-4 sm:px-5 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-xs border border-white/20 transition-all cursor-pointer min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Verifikasi QR</span>
            </button>
          </div>
        </div>

        {/* 1. Galeri Terpadu Cerdas Saka Pariwisata (Destinasi Unggulan, Produk 4 Krida & Rekomendasi IP Location/Pilihan Wisata) */}
        <IntegratedTourismShowcaseGallery
          tours={tours}
          products={liveCulinaryItems}
          members={members}
          currentUser={currentUser}
          onViewTourDetail={onViewTourDetail}
          onSelectMember={onVerifyMember}
          onSelectTab={onSelectTab}
        />

        {/* 2. Galeri Paket Wisata (Carousel) */}
        <TourPackageCarouselSection
          tours={tours}
          currentUser={currentUser}
          onViewTourDetail={onViewTourDetail}
          onSelectTab={onSelectTab}
        />

        {/* 3. Galeri Kuliner & Cinderamata Khas Daerah */}
        <CulinarySouvenirGallerySection
          items={liveCulinaryItems}
          currentUser={currentUser}
          onOpenFormModal={onOpenCulinaryFormModal || (() => {})}
          onSelectItemDetail={onSelectCulinaryDetail || (() => {})}
        />

        {/* 3. Highlight Stats Publik */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Paket Wisata</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold font-heading text-slate-900">
              {publishedTours.length} Destinasi
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Wisata edukatif</p>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold font-heading text-slate-900">
              {tourCategories.length} Ragam
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Ekowisata & budaya</p>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Wilayah</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold font-heading text-slate-900">
              38 Provinsi
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Jejaring destinasi</p>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Pemandu</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold font-heading text-slate-900">
              Standar BNSP
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Ramah & profesional</p>
          </div>
        </div>

        {/* 3. Katalog Utama: Paket-Paket Wisata */}
        <section id="katalog-wisata" className="space-y-4 sm:space-y-6 scroll-mt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Katalog Destinasi Pilihan</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold font-heading text-slate-900 mt-1">
                Paket Wisata Binaan Saka Pariwisata
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih paket perjalanan wisata edukatif, ramah lingkungan, dan mendukung ekonomi masyarakat lokal
              </p>
            </div>

            {/* Filter Search */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl sm:rounded-2xl px-3.5 py-2 w-full md:w-80 shadow-xs focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 min-h-[40px]">
              <Compass className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={tourSearch}
                onChange={(e) => setTourSearch(e.target.value)}
                placeholder="Cari destinasi atau nama paket..."
                className="bg-transparent outline-none text-xs w-full text-slate-800 placeholder:text-slate-400"
              />
              {tourSearch && (
                <button
                  onClick={() => setTourSearch('')}
                  className="text-xs text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button
              onClick={() => setSelectedTourCategory('ALL')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                selectedTourCategory === 'ALL'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua Kategori ({publishedTours.length})
            </button>
            {tourCategories.map((cat) => {
              const count = publishedTours.filter(t => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedTourCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    selectedTourCategory === cat
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid Paket Wisata */}
          {filteredPublicTours.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 text-slate-400">
              <Compass className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-slate-300 stroke-1 mb-2" />
              <p className="font-bold text-slate-700 text-sm">Tidak ada paket wisata yang sesuai.</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPublicTours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group justify-between"
                >
                  <div>
                    {/* Cover Image & Category */}
                    <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                      <img
                        src={tour.coverImage}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                      
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-2 z-10">
                        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white rounded-lg text-xs font-bold border border-white/20">
                          {tour.category}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white z-10">
                        <div>
                          <p className="text-[10px] text-white/80 uppercase font-medium">Mulai dari</p>
                          <p className="text-sm sm:text-base font-extrabold font-heading text-emerald-300 leading-tight">
                            Rp {(tour.pricePerPerson ?? 0).toLocaleString('id-ID')}
                            <span className="text-[10px] font-normal text-white/80"> / org</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] bg-black/40 backdrop-blur-xs px-2 py-1 rounded-lg border border-white/10 font-medium">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{tour.durationDays} Hari</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{tour.regencyName}, {tour.provinceName}</span>
                      </div>

                      <h4
                        onClick={() => onViewTourDetail(tour)}
                        className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer font-heading leading-snug"
                      >
                        {tour.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {tour.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Button */}
                  <div className="p-4 sm:p-5 pt-0">
                    <button
                      onClick={() => onViewTourDetail(tour)}
                      className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-xl sm:rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-purple-200 min-h-[40px]"
                    >
                      <span>Lihat Detail Paket & Reservasi</span>
                      <ChevronRight className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Sapta Pesona & Keramahan Indonesia */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white border border-emerald-700/50 shadow-xl space-y-3">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
              Komitmen Sapta Pesona
            </span>
            <h4 className="text-base sm:text-xl font-bold font-heading text-white">
              Pariwisata Berkelanjutan & Berbudaya
            </h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Seluruh paket wisata binaan Saka Pariwisata mengedepankan prinsip Sapta Pesona: Aman, Tertib, Bersih, Sejuk, Indah, Ramah Tamah, dan Kenangan bagi wisatawan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TAMPILAN DASHBOARD UNTUK PERAN ADMIN & MEMBER (Lengkap dengan Statistik & KTA)
  // =========================================================================
  const previewMember = members.find(m => m.id === currentUser.memberId) || members.find(m => m.status === 'ACTIVE') || members[0];
  const recentRegistrations = members.slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Welcome Banner with SakaLogo Key Visual */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative overflow-hidden">
        {/* Background glow and watermark */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 -bottom-10 opacity-10 pointer-events-none">
          <SakaLogo size={200} />
        </div>
        
        <div className="flex items-center gap-4 z-10 max-w-2xl">
          <SakaLogo size={56} id="dashboard-banner-logo" className="hidden sm:inline-flex flex-shrink-0" />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-purple-500/20 border border-purple-400/40 rounded-full text-purple-200 text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Platform Terpadu Saka Pariwisata Indonesia</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
              Selamat Datang, {currentUser.name}
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
              Pusat manajemen terintegrasi untuk pendataan keanggotaan, verifikasi KTA ber-QR Code, direktori kompetensi, dan promosi paket wisata komunitas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 z-10 w-full md:w-auto">
          {isAdmin && onOpenEditCardModal && (
            <button
              onClick={onOpenEditCardModal}
              className="flex-1 md:flex-none px-3.5 sm:px-4 py-2.5 sm:py-3 bg-purple-900/60 hover:bg-purple-800 text-purple-100 font-semibold rounded-xl sm:rounded-2xl text-xs flex items-center justify-center gap-2 backdrop-blur-xs border border-purple-500/40 transition-all cursor-pointer shadow-xs min-h-[44px]"
            >
              <Sliders className="w-4 h-4 text-purple-300" />
              <span>Desain KTA ({currentOpacityPct}%)</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('verify-portal')}
            className="flex-1 md:flex-none px-4 sm:px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl sm:rounded-2xl text-xs flex items-center justify-center gap-2 backdrop-blur-xs border border-white/20 transition-all cursor-pointer min-h-[44px]"
          >
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span>Verifikasi QR</span>
          </button>
        </div>
      </div>

      {/* 1. Galeri Terpadu Cerdas Saka Pariwisata (Destinasi Unggulan, Produk 4 Krida & Rekomendasi IP Location/Pilihan Wisata) */}
      <IntegratedTourismShowcaseGallery
        tours={tours}
        products={liveCulinaryItems}
        members={members}
        currentUser={currentUser}
        onViewTourDetail={onViewTourDetail}
        onSelectMember={onVerifyMember}
        onSelectTab={onSelectTab}
      />

      {/* 2. Galeri Paket Wisata (Carousel) */}
      <TourPackageCarouselSection
        tours={tours}
        currentUser={currentUser}
        onViewTourDetail={onViewTourDetail}
        onSelectTab={onSelectTab}
      />

      {/* 3. Galeri Kuliner & Cinderamata Khas Daerah */}
      <CulinarySouvenirGallerySection
        items={liveCulinaryItems}
        currentUser={currentUser}
        onOpenFormModal={onOpenCulinaryFormModal || (() => {})}
        onSelectItemDetail={onSelectCulinaryDetail || (() => {})}
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => onSelectTab('members')}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Anggota</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              {activeMembersCount.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12% bln ini
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1">Terdata aktif di Kwartir</p>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onSelectTab('tours')}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Paket Wisata</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              {publishedTours.length} Paket
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-600">
              Potensi Daerah
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1">Dipromosikan ke publik</p>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onSelectTab('members')}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Verifikasi</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-extrabold font-heading text-amber-700">
              {pendingMembers.length} Calon
            </span>
            <span className="text-[9px] sm:text-[10px] bg-amber-100 text-amber-800 px-1.5 sm:px-2 py-0.5 rounded-md font-bold w-fit">
              Review
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1">Pendaftaran baru anggota</p>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onSelectTab('territories')}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Wilayah</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              38 Prov
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-indigo-600">
              514 Kab/Kota
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1">Cakupan Nasional RI</p>
        </div>
      </div>

      {/* Visualisasi Pertumbuhan Anggota Menggunakan Recharts */}
      <DashboardWidget 
        members={members}
        title="Visualisasi Pertumbuhan Anggota Saka Pariwisata"
        subtitle="Analisis dinamika registrasi, kader aktif terverifikasi, dan tren penambahan berkala"
      />

      {/* Main Grid: Left Table & Right Digital Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Recent Registrations Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 font-heading">
                Pendaftaran Anggota Terbaru
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Calon anggota terdata di pangkalan kwartir ranting
              </p>
            </div>
            <button
              onClick={() => onSelectTab('members')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer p-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs min-w-[340px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Anggota</th>
                  <th className="pb-3">Wilayah</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRegistrations.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 sm:py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={m.avatarUrl}
                          alt={m.fullName}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-[110px] sm:max-w-[160px]">{m.fullName}</p>
                          <p className="text-[9px] sm:text-[10px] font-mono text-emerald-700 font-medium truncate max-w-[110px] sm:max-w-[160px]">
                            {m.nationalMemberNumber || 'Menunggu No. KTA'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 sm:py-3 px-2">
                      <p className="text-slate-700 font-medium truncate max-w-[100px] sm:max-w-[130px]">{m.regencyName}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-[100px] sm:max-w-[130px]">{m.branchName}</p>
                    </td>
                    <td className="py-2.5 sm:py-3 px-2">
                      {m.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          AKTIF
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 sm:py-3 pl-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {m.status === 'PENDING' && (
                          <button
                            onClick={() => onApproveMemberQuick(m.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-colors min-h-[32px]"
                            title="Setujui dan terbitkan Nomor Anggota Nasional"
                          >
                            Setujui
                          </button>
                        )}
                        <button
                          onClick={() => onVerifyMember(m)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                          title="Cek Verifikasi"
                          aria-label="Cek Verifikasi Anggota"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Interactive Digital KTA Card Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  Kartu Tanda Anggota (KTA)
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                  Identitas Digital Saka
                </h3>
              </div>

              {isAdmin && onOpenEditCardModal ? (
                <button
                  onClick={onOpenEditCardModal}
                  className="px-2.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Ubah Desain Latar Belakang & Opasitas KTA"
                >
                  <Palette className="w-3.5 h-3.5 text-purple-300" />
                  <span>Desain KTA ({currentOpacityPct}%)</span>
                </button>
              ) : (
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-400/30">
                  KTA Fisik & Digital
                </span>
              )}
            </div>

            {/* Embedded 3D Member Card */}
            {previewMember && (
              <DigitalMemberCard
                member={previewMember}
                onVerifyClick={onVerifyMember}
                onEditCard={onOpenEditCardModal}
                allowAdminEdit={isAdmin}
                showControls={true}
              />
            )}

            {/* Quick Admin Transparency & Background Status Indicator */}
            {isAdmin && onOpenEditCardModal && (
              <div className="p-2.5 bg-purple-950/40 rounded-2xl border border-purple-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-purple-200">
                    Transparansi Latar: <strong className="text-white font-mono">{currentOpacityPct}%</strong>
                    {currentOpacityPct === 90 && <span className="text-emerald-400 font-normal"> (Standar Terbaca)</span>}
                  </span>
                </div>
                <button
                  onClick={onOpenEditCardModal}
                  className="text-[10px] font-bold text-purple-300 hover:text-white underline cursor-pointer"
                >
                  Ubah Desain
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-[11px] text-slate-300 leading-relaxed flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>KTA dilengkapi QR Code anti-pemalsuan dan dapat langsung diverifikasi petugas atau pemangku pariwisata.</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Regional Map Visual & Featured Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Territory Distribution */}
        <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
          <NationalMapVisual provinces={provinces} />
        </div>

        {/* Featured Tours */}
        <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 font-heading">
                Paket Wisata Unggulan Komunitas
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Pemberdayaan potensi destinasi oleh kader Saka Pariwisata
              </p>
            </div>
            <button
              onClick={() => onSelectTab('tours')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer p-1"
            >
              <span>Jelajah Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {publishedTours.slice(0, 2).map((tour) => (
              <div 
                key={tour.id} 
                onClick={() => onViewTourDetail(tour)}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-28 rounded-xl overflow-hidden relative">
                    <img
                      src={tour.coverImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-white rounded-md">
                      {tour.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {tour.title}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-800 font-heading">
                    Rp {(tour.pricePerPerson ?? 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400">{tour.durationDays} Hari</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
