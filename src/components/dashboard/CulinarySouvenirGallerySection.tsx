import React, { useState } from 'react';
import { 
  Utensils, 
  Gift, 
  MapPin, 
  Heart, 
  Plus, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Store, 
  Phone,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { CulinarySouvenirItem, CurrentUser, ProductKind } from '../../types';
import { storage } from '../../services/storage';

interface CulinarySouvenirGallerySectionProps {
  items: CulinarySouvenirItem[];
  currentUser: CurrentUser;
  onOpenFormModal: (itemToEdit?: CulinarySouvenirItem) => void;
  onSelectItemDetail: (item: CulinarySouvenirItem) => void;
}

export const CulinarySouvenirGallerySection: React.FC<CulinarySouvenirGallerySectionProps> = ({
  items,
  currentUser,
  onOpenFormModal,
  onSelectItemDetail
}) => {
  const [selectedKind, setSelectedKind] = useState<'ALL' | ProductKind>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');

  // Likes local state tracking
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const handleQuickLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!likedIds[id]) {
      storage.likeCulinarySouvenir(id);
      setLikedIds(prev => ({ ...prev, [id]: true }));
    }
  };

  // Extract unique provinces
  const provinces = Array.from(new Set(items.map(i => i.provinceName).filter(Boolean)));

  // Filter items
  const filteredItems = items.filter(item => {
    const matchKind = selectedKind === 'ALL' || item.kind === selectedKind;
    const matchProvince = selectedProvince === 'ALL' || item.provinceName === selectedProvince;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      item.name.toLowerCase().includes(q) ||
      item.districtName.toLowerCase().includes(q) ||
      item.regencyName.toLowerCase().includes(q) ||
      item.provinceName.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      item.tags?.some(t => t.toLowerCase().includes(q));

    return matchKind && matchProvince && matchQuery;
  });

  const culinaryCount = items.filter(i => i.kind === 'KULINER').length;
  const souvenirCount = items.filter(i => i.kind === 'CINDERAMATA').length;

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden space-y-4 sm:space-y-6">
      {/* Decorative Gradient Background Highlights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Showcase Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-900 text-[11px] sm:text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Etalase Potensi Lokal Nusantara</span>
          </div>

          <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            Galeri Kuliner & Cinderamata Khas Daerah
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Dokumentasi cita rasa kuliner legendaris dan kriya cenderamata khas daerah yang dihimpun dan dipromosikan langsung oleh anggota Saka Pariwisata di tingkat <strong className="text-purple-900 font-bold">Kwartir Ranting</strong>.
          </p>
        </div>

        {/* Action Button: Unggah Produk Kwarran */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onOpenFormModal()}
            className="w-full sm:w-auto px-4 sm:px-5 py-3 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/20 active:scale-95 transition-all cursor-pointer group min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-amber-300 group-hover:rotate-90 transition-transform duration-200" />
            <span>+ Input Produk Kwarran Anda</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
        
        {/* Category Tabs: Semua, Kuliner, Cinderamata */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setSelectedKind('ALL')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              selectedKind === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>Semua Karya</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              selectedKind === 'ALL' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {items.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedKind('KULINER')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              selectedKind === 'KULINER'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Kuliner Khas</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              selectedKind === 'KULINER' ? 'bg-amber-950 text-amber-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {culinaryCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedKind('CINDERAMATA')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              selectedKind === 'CINDERAMATA'
                ? 'bg-purple-700 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Cinderamata & Kriya</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              selectedKind === 'CINDERAMATA' ? 'bg-purple-950 text-purple-200' : 'bg-slate-200 text-slate-600'
            }`}>
              {souvenirCount}
            </span>
          </button>
        </div>

        {/* Search & Province Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 lg:max-w-md">
          {/* Province Filter Dropdown */}
          <div className="w-full sm:w-44 flex-shrink-0">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl sm:rounded-2xl text-xs text-slate-700 font-semibold outline-none focus:border-purple-600 cursor-pointer min-h-[40px]"
            >
              <option value="ALL">Semua Provinsi</option>
              {provinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-2 focus-within:bg-white focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-500/20 min-h-[40px]">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kuliner, cinderamata, Kwarran..."
              className="bg-transparent outline-none text-xs w-full text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Culinary & Souvenir Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-800">Belum ada produk yang sesuai filter</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Jadilah yang pertama mengunggah kuliner atau cinderamata khas dari Kwartir Ranting Anda!
            </p>
          </div>
          <button
            onClick={() => onOpenFormModal()}
            className="px-4 sm:px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Produk Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
          {filteredItems.map((item) => {
            const isLiked = likedIds[item.id];
            const currentLikes = (item.likesCount || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={item.id}
                onClick={() => onSelectItemDetail(item)}
                className="group bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer justify-between transform hover:-translate-y-1"
              >
                <div>
                  {/* Photo Thumbnail with Badges */}
                  <div className="relative h-44 sm:h-44 overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Kind Pill (Top Left) */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md shadow-xs ${
                        item.kind === 'KULINER'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-purple-900/90 text-purple-100 border border-purple-400/30'
                      }`}>
                        {item.kind === 'KULINER' ? <Utensils className="w-3 h-3" /> : <Gift className="w-3 h-3" />}
                        <span>{item.kind === 'KULINER' ? 'Kuliner' : 'Cinderamata'}</span>
                      </span>
                    </div>

                    {/* Quick Like Button (Top Right) */}
                    <button
                      onClick={(e) => handleQuickLike(e, item.id)}
                      className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-75 z-10 cursor-pointer ${
                        isLiked 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'
                      }`}
                      title="Sukai Karya Ini"
                      aria-label="Sukai karya"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                    </button>

                    {/* Location Overlay (Bottom of Photo) */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-medium z-10">
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[10px] truncate max-w-[65%]">
                        <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span className="truncate font-semibold">{item.districtName}</span>
                      </div>

                      <span className="text-[10px] text-amber-300 font-semibold drop-shadow-xs truncate max-w-[32%] text-right">
                        {item.regencyName?.replace('Kabupaten', 'Kab.').replace('Kota', 'Kota')}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 sm:p-4 space-y-1.5 sm:space-y-2">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block truncate">
                      {item.categoryLabel}
                    </span>

                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-purple-900 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Price, Author, Action */}
                <div className="p-3.5 sm:p-4 pt-0 space-y-2.5 sm:space-y-3">
                  {/* Price Row */}
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-2.5">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Mulai dari</span>
                      <span className="text-sm sm:text-base font-extrabold font-heading text-emerald-700">
                        Rp {item.priceEstimate.toLocaleString('id-ID')}
                        <span className="text-[10px] font-normal text-slate-400">/{item.priceUnit || 'porsi'}</span>
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>{currentLikes}</span>
                    </div>
                  </div>

                  {/* Author Mini Bar & View Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {item.authorAvatarUrl ? (
                        <img
                          src={item.authorAvatarUrl}
                          alt={item.authorName}
                          className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {item.authorName.charAt(0)}
                        </div>
                      )}
                      <span className="text-[10px] text-slate-600 truncate font-medium max-w-[100px]">
                        {item.authorName}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-purple-700 group-hover:text-purple-900 flex items-center gap-0.5">
                      <span>Detail</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
