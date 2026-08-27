import React, { useState, useEffect } from 'react';
import { 
  X, 
  Utensils, 
  Gift, 
  MapPin, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  DollarSign, 
  Phone, 
  Tag, 
  BookOpen, 
  Store, 
  Image as ImageIcon 
} from 'lucide-react';
import { CulinarySouvenirItem, CurrentUser, ProductKind, Province, Regency, District } from '../../types';
import { storage } from '../../services/storage';
import { PROVINCES_DATA, REGENCIES_DATA, getDistrictsForRegency } from '../../data/indonesiaTerritories';

interface CulinarySouvenirFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  editItem?: CulinarySouvenirItem | null;
  onSuccess: (savedItem: CulinarySouvenirItem) => void;
}

// Preset photo selections for rapid & beautiful input
const PRESET_PHOTOS = {
  KULINER: [
    { label: 'Nasi Tutug Oncom', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80' },
    { label: 'Asinan & Rujak', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ayam Rempah / Betutu', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80' },
    { label: 'Soto / Coto Rempah', url: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=800&auto=format&fit=crop&q=80' },
    { label: 'Kue Tradisional & Jajanan', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80' },
    { label: 'Minuman Herbal & Jamu', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80' },
  ],
  CINDERAMATA: [
    { label: 'Payung Geulis / Kriya Bambu', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80' },
    { label: 'Kain Tenun Ikat Daerah', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Batik Tulis & Cap Tradisional', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80' },
    { label: 'Anyaman Serat Alam & Noken', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ukiran Kayu & Topeng', url: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?w=800&auto=format&fit=crop&q=80' },
    { label: 'Kerajinan Kulit & Manik', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80' },
  ]
};

export const CulinarySouvenirFormModal: React.FC<CulinarySouvenirFormModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  editItem,
  onSuccess
}) => {
  const members = storage.getMembers();
  const currentMember = members.find(m => m.id === currentUser.memberId || m.userId === currentUser.id);

  // Form State
  const [kind, setKind] = useState<ProductKind>('KULINER');
  const [name, setName] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('Makanan Tradisional Khas');
  const [description, setDescription] = useState('');
  const [storyOrigin, setStoryOrigin] = useState('');
  const [priceEstimate, setPriceEstimate] = useState<number>(25000);
  const [priceUnit, setPriceUnit] = useState('per porsi');
  const [imageUrl, setImageUrl] = useState('');
  const [umkmName, setUmkmName] = useState('');
  const [contactPhone, setContactPhone] = useState('0812-3456-7890');
  const [address, setAddress] = useState('');
  const [tagInput, setTagInput] = useState('Halal, Khas Daerah, Binaan Saka');

  // Territory Selection
  const [provinceId, setProvinceId] = useState('32'); // Default Jawa Barat
  const [regencyId, setRegencyId] = useState('32.06'); // Default Kab. Tasikmalaya
  const [districtId, setDistrictId] = useState('32.06.01'); // Default Kwarran Ciawi
  const [gudepOrPangkalan, setGudepOrPangkalan] = useState('');

  // Available Regencies & Districts
  const [availableRegencies, setAvailableRegencies] = useState<Regency[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);

  // Initialize or Reset Form
  useEffect(() => {
    if (!isOpen) return;

    if (editItem) {
      setKind(editItem.kind);
      setName(editItem.name);
      setCategoryLabel(editItem.categoryLabel);
      setDescription(editItem.description);
      setStoryOrigin(editItem.storyOrigin || '');
      setPriceEstimate(editItem.priceEstimate);
      setPriceUnit(editItem.priceUnit || 'per porsi');
      setImageUrl(editItem.imageUrl);
      setUmkmName(editItem.umkmName || '');
      setContactPhone(editItem.contactPhone || '');
      setAddress(editItem.address || '');
      setTagInput(editItem.tags.join(', '));
      setProvinceId(editItem.provinceId || '32');
      setRegencyId(editItem.regencyId || '32.06');
      setDistrictId(editItem.districtId || '32.06.01');
      setGudepOrPangkalan(editItem.gudepOrPangkalan || '');
    } else {
      // Default to Member's territory if available
      const initProv = currentMember?.provinceId || (currentUser.jurisdictionId ? currentUser.jurisdictionId.split('.')[0] : '32');
      const initReg = currentMember?.regencyId || (currentUser.jurisdictionId?.length === 5 ? currentUser.jurisdictionId : '32.06');
      const initDist = currentMember?.districtId || '32.06.01';

      setKind('KULINER');
      setName('');
      setCategoryLabel('Makanan Tradisional Khas');
      setDescription('');
      setStoryOrigin('');
      setPriceEstimate(25000);
      setPriceUnit('per porsi');
      setImageUrl(PRESET_PHOTOS.KULINER[0].url);
      setUmkmName('');
      setContactPhone(currentMember?.phone || '0812-3456-7890');
      setAddress(currentMember?.address || '');
      setTagInput('Halal, Khas Daerah, UMKM Binaan Saka');
      setProvinceId(initProv);
      setRegencyId(initReg);
      setDistrictId(initDist);
      setGudepOrPangkalan(currentMember?.gugusDepan || `Pangkalan Saka Pariwisata ${currentMember?.branchName || 'Kwarran Ciawi'}`);
    }
  }, [isOpen, editItem, currentMember, currentUser]);

  // Update regencies when province changes
  useEffect(() => {
    const regList = REGENCIES_DATA.filter(r => r.provinceId === provinceId);
    setAvailableRegencies(regList);
    if (regList.length > 0 && !regList.some(r => r.id === regencyId)) {
      setRegencyId(regList[0].id);
    }
  }, [provinceId]);

  // Update districts when regency changes
  useEffect(() => {
    const distList = getDistrictsForRegency(regencyId);
    setAvailableDistricts(distList);
    if (distList.length > 0 && !distList.some(d => d.id === districtId)) {
      setDistrictId(distList[0].id);
    }
  }, [regencyId]);

  if (!isOpen) return null;

  const currentProvObj = PROVINCES_DATA.find(p => p.id === provinceId);
  const currentRegObj = REGENCIES_DATA.find(r => r.id === regencyId);
  const currentDistObj = availableDistricts.find(d => d.id === districtId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Mohon isi nama kuliner atau cinderamata khas daerah.');
      return;
    }
    if (!description.trim()) {
      alert('Mohon isi deskripsi atau keunikan rasa/kriya.');
      return;
    }
    if (!imageUrl.trim()) {
      alert('Mohon sertakan tautan foto produk.');
      return;
    }

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      name: name.trim(),
      kind,
      categoryLabel: categoryLabel.trim(),
      description: description.trim(),
      storyOrigin: storyOrigin.trim() || undefined,
      priceEstimate: Number(priceEstimate) || 0,
      priceUnit: priceUnit.trim() || (kind === 'KULINER' ? 'per porsi' : 'per buah'),
      imageUrl: imageUrl.trim(),
      provinceId,
      provinceName: currentProvObj?.name || 'Jawa Barat',
      regencyId,
      regencyName: currentRegObj?.name || 'Kabupaten Tasikmalaya',
      districtId,
      districtName: currentDistObj ? `Kwarran ${currentDistObj.name}` : (currentMember?.branchName || 'Kwarran Ciawi'),
      gudepOrPangkalan: gudepOrPangkalan.trim() || undefined,
      authorMemberId: currentMember?.id || currentUser.memberId || 'member-001',
      authorName: currentMember?.fullName || currentUser.name,
      authorNta: currentMember?.nationalMemberNumber || '32.06.01.000001',
      authorAvatarUrl: currentMember?.avatarUrl || currentUser.avatarUrl,
      authorRole: currentMember?.currentPosition || 'Anggota Saka Pariwisata',
      umkmName: umkmName.trim() || undefined,
      contactPhone: contactPhone.trim() || '0812-3456-7890',
      address: address.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Khas Daerah', 'Binaan Saka'],
      status: 'PUBLISHED' as const
    };

    if (editItem) {
      const updated = storage.updateCulinarySouvenir(editItem.id, payload, currentUser);
      if (updated) {
        onSuccess(updated);
        onClose();
      }
    } else {
      const created = storage.addCulinarySouvenir(payload, currentUser);
      onSuccess(created);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between flex-shrink-0 relative overflow-hidden">
          <div className="flex items-center gap-3.5 z-10">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              kind === 'KULINER' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
            }`}>
              {kind === 'KULINER' ? <Utensils className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/10 rounded-full text-purple-200">
                  Input Anggota Kwartir Ranting
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                {editItem ? 'Edit Data Kuliner / Cinderamata' : 'Unggah Kuliner & Cinderamata Khas Daerah'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* 1. Pilih Jenis Produk: Kuliner vs Cinderamata */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Jenis Karya Khas Daerah <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setKind('KULINER');
                  if (!editItem) {
                    setCategoryLabel('Makanan Tradisional Khas');
                    setPriceUnit('per porsi');
                    setImageUrl(PRESET_PHOTOS.KULINER[0].url);
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  kind === 'KULINER'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  kind === 'KULINER' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">🍜 Kuliner & Makanan Khas</p>
                  <p className="text-[11px] text-slate-500">Masakan tradisi, jajanan pasar, olahan rempah, minuman khas</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setKind('CINDERAMATA');
                  if (!editItem) {
                    setCategoryLabel('Kriya & Kerajinan Tangan');
                    setPriceUnit('per buah');
                    setImageUrl(PRESET_PHOTOS.CINDERAMATA[0].url);
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  kind === 'CINDERAMATA'
                    ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  kind === 'CINDERAMATA' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">🎁 Cinderamata & Kriya Daerah</p>
                  <p className="text-[11px] text-slate-500">Batik, tenun, anyaman bambu, ukiran kayu, kerajinan tangan</p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Informasi Utama Produk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Nama Kuliner / Cinderamata Khas</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={kind === 'KULINER' ? 'Contoh: Nasi Tutug Oncom & Sambal Goang' : 'Contoh: Payung Geulis Lukis Bambu'}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Kategori Spesifik
              </label>
              <select
                value={categoryLabel}
                onChange={(e) => setCategoryLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none"
              >
                {kind === 'KULINER' ? (
                  <>
                    <option value="Makanan Tradisional Khas">Makanan Tradisional Khas</option>
                    <option value="Jajanan Pasar & Camilan">Jajanan Pasar & Camilan</option>
                    <option value="Kuliner Rempah Tradisional">Kuliner Rempah Tradisional</option>
                    <option value="Minuman Tradisional & Herbal">Minuman Tradisional & Herbal</option>
                    <option value="Oleh-oleh Olahan Makanan">Oleh-oleh Olahan Makanan</option>
                  </>
                ) : (
                  <>
                    <option value="Kriya & Kerajinan Tangan Tradisional">Kriya & Kerajinan Tangan Tradisional</option>
                    <option value="Batik Tulis & Cap Daerah">Batik Tulis & Cap Daerah</option>
                    <option value="Kain Tenun Tradisional">Kain Tenun Tradisional</option>
                    <option value="Anyaman Serat Alam & Bambu">Anyaman Serat Alam & Bambu</option>
                    <option value="Kriya Ukir Kayu Nusantara">Kriya Ukir Kayu Nusantara</option>
                    <option value="Aksesoris & Suvenir Khas">Aksesoris & Suvenir Khas</option>
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Estimasi Harga (Rp)
                </label>
                <input
                  type="number"
                  value={priceEstimate}
                  onChange={(e) => setPriceEstimate(Number(e.target.value))}
                  placeholder="25000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none font-mono font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Satuan
                </label>
                <input
                  type="text"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  placeholder="per porsi / per pcs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Wilayah Kwartir Ranting & Cabang */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Lokasi Asal Kwartir Ranting (Kwarran)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Kwarda (Provinsi)</label>
                <select
                  value={provinceId}
                  onChange={(e) => setProvinceId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                >
                  {PROVINCES_DATA.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Kwarcab (Kab/Kota)</label>
                <select
                  value={regencyId}
                  onChange={(e) => setRegencyId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                >
                  {availableRegencies.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Kwarran (Kecamatan)</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                >
                  {availableDistricts.map(d => (
                    <option key={d.id} value={d.id}>Kwarran {d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Gugus Depan / Pangkalan Penginput</label>
              <input
                type="text"
                value={gudepOrPangkalan}
                onChange={(e) => setGudepOrPangkalan(e.target.value)}
                placeholder="Contoh: Pangkalan Saka Pariwisata Kwarran Ciawi"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
              />
            </div>
          </div>

          {/* 4. Foto Produk & Preset Cepat */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Foto Produk / Kuliner</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Pilih preset atau masukkan URL foto</span>
            </div>

            {/* Quick Preset Selector */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(kind === 'KULINER' ? PRESET_PHOTOS.KULINER : PRESET_PHOTOS.CINDERAMATA).map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(item.url)}
                  className={`group relative rounded-xl overflow-hidden border text-left cursor-pointer transition-all aspect-video ${
                    imageUrl === item.url ? 'ring-2 ring-purple-600 border-transparent' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-bold text-white leading-tight line-clamp-1">{item.label}</span>
                  </div>
                  {imageUrl === item.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xs">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-purple-600"
                required
              />
            </div>
          </div>

          {/* 5. Deskripsi & Cerita Asal-Usul */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Deskripsi Cita Rasa / Bahan / Keunikan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={kind === 'KULINER' 
                  ? 'Jelaskan cita rasa, komposisi rempah, bumbu rahasia, tekstur, dan kelezatan hidangan ini...' 
                  : 'Jelaskan bahan alami yang digunakan, teknik pembuatan tangan, dan fungsi cinderamata ini...'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none leading-relaxed"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Sejarah, Filosofi Budaya, atau Asal-Usul Khas Daerah</span>
                <span className="text-[11px] font-normal text-slate-400">(Opsional)</span>
              </label>
              <textarea
                rows={2}
                value={storyOrigin}
                onChange={(e) => setStoryOrigin(e.target.value)}
                placeholder="Ceritakan latar belakang sejarah, tradisi leluhur, atau nilai kearifan lokal yang terkandung..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-600 outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* 6. Info Pengrajin / UMKM & Kontak Pemesanan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-slate-500" />
                <span>Nama UMKM / Pengrajin / Dapur Binaan</span>
              </label>
              <input
                type="text"
                value={umkmName}
                onChange={(e) => setUmkmName(e.target.value)}
                placeholder="Contoh: Dapur Warisan Binaan Saka"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Pemesanan / Info</span>
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Label / Tagar (Pisahkan dengan koma)</span>
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Halal, Khas Sunda, Warisan Budaya, Oleh-oleh"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-slate-500">
            Diinput oleh: <strong className="text-slate-800">{currentMember?.fullName || currentUser.name}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-950/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{editItem ? 'Simpan Perubahan' : 'Terbitkan ke Galeri'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
