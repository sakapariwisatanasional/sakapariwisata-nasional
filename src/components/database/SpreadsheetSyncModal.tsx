import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  FileSpreadsheet, 
  Code2, 
  Download, 
  ShieldCheck,
  Sparkles,
  Link2
} from 'lucide-react';
import { spreadsheetService, DEFAULT_SPREADSHEET_ID, DEFAULT_SPREADSHEET_URL, SpreadsheetConfig } from '../../services/spreadsheetService';
import { storage } from '../../services/storage';

interface SpreadsheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpreadsheetSyncModal: React.FC<SpreadsheetSyncModalProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<SpreadsheetConfig>(spreadsheetService.getConfig());
  const [scriptUrlInput, setScriptUrlInput] = useState(config.scriptUrl || '');
  const [spreadsheetIdInput, setSpreadsheetIdInput] = useState(config.spreadsheetId || DEFAULT_SPREADSHEET_ID);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'setup' | 'export'>('status');

  useEffect(() => {
    if (isOpen) {
      const cfg = spreadsheetService.getConfig();
      setConfig(cfg);
      setScriptUrlInput(cfg.scriptUrl || '');
      setSpreadsheetIdInput(cfg.spreadsheetId || DEFAULT_SPREADSHEET_ID);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const membersCount = storage.getMembers().length;
  const toursCount = storage.getTourPackages().length;
  const culinaryCount = storage.getCulinarySouvenirs().length;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    // Save ID if changed
    spreadsheetService.saveConfig({
      spreadsheetId: spreadsheetIdInput.trim() || DEFAULT_SPREADSHEET_ID,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetIdInput.trim() || DEFAULT_SPREADSHEET_ID}/edit?usp=sharing`,
      scriptUrl: scriptUrlInput.trim()
    });

    const result = await spreadsheetService.syncFromSpreadsheet();
    setIsSyncing(false);
    setSyncResult({
      success: result.success,
      message: result.message
    });
    setConfig(spreadsheetService.getConfig());
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = spreadsheetService.saveConfig({
      spreadsheetId: spreadsheetIdInput.trim() || DEFAULT_SPREADSHEET_ID,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetIdInput.trim() || DEFAULT_SPREADSHEET_ID}/edit?usp=sharing`,
      scriptUrl: scriptUrlInput.trim()
    });
    setConfig(updated);
    alert('Pengaturan database Google Spreadsheet berhasil disimpan.');
  };

  const handleCopyScript = () => {
    const code = spreadsheetService.getGoogleAppsScriptTemplate();
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadCsv = () => {
    const members = storage.getMembers();
    const headers = ['ID', 'Nomor Anggota', 'Nama Lengkap', 'NIK', 'Email', 'No WA', 'Provinsi', 'Kabupaten/Kota', 'Kecamatan/Kwarran', 'Gudep', 'Krida', 'Status', 'Tanggal Daftar', 'Foto URL'];
    const rows = members.map(m => [
      m.id,
      m.nationalMemberNumber || '',
      `"${m.fullName}"`,
      m.nikMasked,
      m.email,
      m.phone,
      `"${m.provinceName}"`,
      `"${m.regencyName}"`,
      `"${m.branchName}"`,
      `"${m.gugusDepan}"`,
      `"${m.krida || ''}"`,
      m.status,
      m.registeredAt,
      m.avatarUrl
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Database_Saka_Pariwisata_Anggota_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 overflow-hidden">
        
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
            <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <span>Database Google Spreadsheet</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] rounded-md font-bold">
                Terhubung
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Sinkronisasi data anggota, KTA, paket wisata, dan kuliner langsung dengan Google Spreadsheet
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'status' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Status & Sinkronisasi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'setup' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pengaturan API Web App
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'export' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ekspor / Cadangan Data
          </button>
        </div>

        {/* TAB 1: STATUS & SYNC */}
        {activeTab === 'status' && (
          <div className="space-y-5">
            {/* Connected Sheet Card */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Google Spreadsheet Database Aktif</span>
                </div>
                <a
                  href={config.spreadsheetUrl || DEFAULT_SPREADSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  <span>Buka di Google Sheets</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-xl border border-emerald-100 break-all select-all">
                ID: {config.spreadsheetId || DEFAULT_SPREADSHEET_ID}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Anggota</p>
                  <p className="text-base font-extrabold text-slate-900 font-heading">{membersCount}</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Paket Wisata</p>
                  <p className="text-base font-extrabold text-slate-900 font-heading">{toursCount}</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Kuliner/Karya</p>
                  <p className="text-base font-extrabold text-slate-900 font-heading">{culinaryCount}</p>
                </div>
              </div>
            </div>

            {/* Sync Feedback Message */}
            {syncResult && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                syncResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {syncResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span>{syncResult.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan Data...' : 'Sinkronkan Database Sekarang'}</span>
              </button>

              <a
                href={config.spreadsheetUrl || DEFAULT_SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Buka Dokumen Sheets</span>
              </a>
            </div>

            {config.lastSyncedAt && !isNaN(new Date(config.lastSyncedAt).getTime()) && (
              <p className="text-[11px] text-slate-400 text-center">
                Terakhir disinkronkan: {new Date(config.lastSyncedAt).toLocaleString('id-ID')}
              </p>
            )}
          </div>
        )}

        {/* TAB 2: SETUP & GOOGLE APPS SCRIPT */}
        {activeTab === 'setup' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
            <form onSubmit={handleSaveConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Spreadsheet ID
                </label>
                <input
                  type="text"
                  value={spreadsheetIdInput}
                  onChange={(e) => setSpreadsheetIdInput(e.target.value)}
                  placeholder="ID Spreadsheet Google"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Apps Script Web App URL (Opsional untuk Penulisan Otomatis)
                </label>
                <input
                  type="url"
                  value={scriptUrlInput}
                  onChange={(e) => setScriptUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Jika diisi, pendaftaran anggota baru atau perubahan data akan langsung tersimpan ke Google Spreadsheet Anda secara otomatis.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-700" />
                  <span>Kode Google Apps Script Web App:</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-purple-700" />
                  <span>{copiedScript ? 'Tersalin!' : 'Salin Kode Script'}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto max-h-48 custom-scrollbar">
                {spreadsheetService.getGoogleAppsScriptTemplate()}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: EXPORT CSV */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Cadangkan Data ke File CSV / Excel</h4>
              <p className="text-xs text-slate-500">
                Unduh seluruh data anggota terdaftar untuk diimpor secara langsung ke Google Spreadsheet atau arsip Kwartir Nasional.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV Data Anggota Lengkap ({membersCount} Data)</span>
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
