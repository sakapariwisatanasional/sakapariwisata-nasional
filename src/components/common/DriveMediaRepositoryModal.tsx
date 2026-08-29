import React, { useState } from 'react';
import { 
  X, 
  FolderOpen, 
  ExternalLink, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Users, 
  Compass, 
  Utensils, 
  CreditCard, 
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { GOOGLE_DRIVE_MAIN_FOLDER, formatGoogleDriveUrl } from '../../services/driveRepository';

interface DriveMediaRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'MEMBER_AVATAR' | 'TOUR_PACKAGES' | 'CULINARY_SOUVENIRS' | 'KTA_CARD' | 'ICONS_LOGOS';
  onSelectImageUrl?: (url: string) => void;
}

export const DriveMediaRepositoryModal: React.FC<DriveMediaRepositoryModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'MEMBER_AVATAR',
  onSelectImageUrl
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inputDriveUrl, setInputDriveUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [convertedDirectUrl, setConvertedDirectUrl] = useState('');

  if (!isOpen) return null;

  const handleCopyMainFolder = () => {
    navigator.clipboard.writeText(GOOGLE_DRIVE_MAIN_FOLDER.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConvertUrl = () => {
    if (!inputDriveUrl.trim()) return;
    const direct = formatGoogleDriveUrl(inputDriveUrl.trim());
    setConvertedDirectUrl(direct);
    setPreviewUrl(direct);
  };

  const handleApplyUrl = () => {
    if (onSelectImageUrl && convertedDirectUrl) {
      onSelectImageUrl(convertedDirectUrl);
      onClose();
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'MEMBER_AVATAR':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'TOUR_PACKAGES':
        return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'CULINARY_SOUVENIRS':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'KTA_CARD':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'ICONS_LOGOS':
        return <Sparkles className="w-4 h-4 text-blue-600" />;
      default:
        return <FolderOpen className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <FolderOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading">
                Repository File & Gambar Google Drive
              </h2>
              <p className="text-xs text-purple-200">
                Penyimpanan berkas aset resmi Saka Pariwisata Nasional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-slate-800">
          
          {/* Main Folder Card */}
          <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider bg-purple-100 px-2 py-0.5 rounded-md">
                Folder Utama Cloud
              </span>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                {GOOGLE_DRIVE_MAIN_FOLDER.title}
              </p>
              <p className="text-[11px] text-slate-500 font-mono break-all">
                {GOOGLE_DRIVE_MAIN_FOLDER.url}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={handleCopyMainFolder}
                className="flex-1 sm:flex-initial px-3 py-2 bg-white hover:bg-slate-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
              </button>

              <a
                href={GOOGLE_DRIVE_MAIN_FOLDER.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Drive</span>
              </a>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Kategori Penyimpanan Berkas:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOOGLE_DRIVE_MAIN_FOLDER.categories.map((cat) => {
                const isSelected = activeCategory === cat.category;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500/20'
                        : 'border-slate-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getCategoryIcon(cat.category)}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900">{cat.name}</p>
                        <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{cat.description}</p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-700 font-semibold uppercase">
                        {cat.category}
                      </span>
                      <a
                        href={cat.folderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
                      >
                        <span>Buka Folder</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Link Converter & Direct Importer */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-purple-700" />
              <h3 className="text-xs font-bold text-slate-900">
                Konversi & Pasang Link Google Drive
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Salin link share dari file gambar di Google Drive (pastikan akses file di-set ke <em>"Anyone with the link can view"</em>), tempel di bawah untuk otomatis dikonversi ke gambar langsung.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputDriveUrl}
                onChange={(e) => setInputDriveUrl(e.target.value)}
                placeholder="Tempel link file Google Drive di sini..."
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleConvertUrl}
                className="px-4 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>
            </div>

            {/* Preview Converted Image */}
            {previewUrl && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Preview Google Drive"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-slate-100"
                  referrerPolicy="no-referrer"
                  onError={() => alert('Gagal memuat gambar. Pastikan izin berbagi file di Google Drive adalah "Siapa saja yang memiliki link dapat melihat (Public)".')}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1 text-emerald-700">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gambar Berhasil Dikonversi</span>
                  </p>
                  <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{previewUrl}</p>
                </div>

                {onSelectImageUrl && (
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Gunakan Gambar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-amber-900 text-xs">
            <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px] leading-relaxed">
              <p className="font-bold">Tips Pengunggahan Berkas:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
                <li>Buka folder kategori di Google Drive sesuai kebutuhan (Anggota, Wisata, Kuliner, dll).</li>
                <li>Unggah berkas foto/gambar Anda ke folder tersebut.</li>
                <li>Klik kanan pada file gambar &gt; <strong>Bagikan (Share)</strong> &gt; pilih <strong>"Siapa saja yang memiliki link"</strong>.</li>
                <li>Salin link dan tempelkan ke aplikasi untuk langsung terpasang pada KTA/Profil/Katalog.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Terhubung ke Google Drive ID: <code className="font-mono text-purple-700">{GOOGLE_DRIVE_MAIN_FOLDER.folderId}</code>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
