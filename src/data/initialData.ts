import { Skill, Member, TourPackage, Activity, AuditLog, CurrentUser, CulinarySouvenirItem } from '../types';

export const MASTER_SKILLS: Skill[] = [
  {
    id: 'skill-tour-guide',
    name: 'Pemandu Wisata & Tour Guide',
    category: 'Pemanduan & Tour Guide',
    description: 'Keahlian memandu wisatawan domestik dan mancanegara dengan standar BNSP/HPI.'
  },
  {
    id: 'skill-storytelling',
    name: 'Cultural Storytelling & Sejarah',
    category: 'Budaya & Storytelling',
    description: 'Penyampaian narasi sejarah, cagar budaya, mitologi lokal, dan kearifan lokal.'
  },
  {
    id: 'skill-fotografi',
    name: 'Fotografi Destinasi & Landscape',
    category: 'Fotografi & Media',
    description: 'Pengambilan gambar estetika tinggi untuk promosi daya tarik wisata dan media sosial.'
  },
  {
    id: 'skill-videografi',
    name: 'Videografi & Drone Operator',
    category: 'Fotografi & Media',
    description: 'Pembuatan video sinematik pariwisata, reels, vlog perjalanan, dan pemetaan udara.'
  },
  {
    id: 'skill-ekowisata',
    name: 'Konservasi & Ekowisata Alam',
    category: 'Ekowisata & Alam',
    description: 'Manajemen jejak ekologis, trekking hutan lindung, edukasi flora-fauna, dan birdwatching.'
  },
  {
    id: 'skill-digital-marketing',
    name: 'Digital Marketing & Content Creator',
    category: 'Digital Marketing & UMKM',
    description: 'Promosi wisata berbasis TikTok/Instagram, SEO travel, dan kampanye digital destinasi.'
  },
  {
    id: 'skill-hospitality',
    name: 'Homestay & Hospitality Service',
    category: 'Hospitality & Kuliner',
    description: 'Standar kebersihan CHSE, pelayanan tamu desa wisata, dan manajemen akomodasi lokal.'
  },
  {
    id: 'skill-kuliner',
    name: 'Eksplorasi Kuliner Tradisional',
    category: 'Hospitality & Kuliner',
    description: 'Pengembangan produk oleh-oleh khas daerah dan gastro-tourism nusantara.'
  },
  {
    id: 'skill-mice',
    name: 'MICE & Event Organizer Wisata',
    category: 'MICE & Event',
    description: 'Penyelenggaraan festival budaya, perkemahan akbar kepariwisataan, dan expo travel.'
  },
  {
    id: 'skill-bahasa-inggris',
    name: 'Pemandu Bahasa Asing (English/Mandarin)',
    category: 'Pemanduan & Tour Guide',
    description: 'Komunikasi fasih untuk memandu turis mancanegara di objek wisata prioritas.'
  }
];

import { SHOWCASE_MEMBERS, SHOWCASE_TOURS, SHOWCASE_PRODUCTS, SHOWCASE_ACTIVITIES } from './showcaseData';

// Database Anggota (Dilengkapi data percontohan kader terverifikasi di berbagai provinsi)
export const INITIAL_MEMBERS: Member[] = SHOWCASE_MEMBERS;

// Database Paket Wisata (Dilengkapi paket ekowisata & destinasi unggulan)
export const INITIAL_TOUR_PACKAGES: TourPackage[] = SHOWCASE_TOURS;

// Database Agenda & Kegiatan Saka Pariwisata (Diupload Super Admin Kwarnas & Operator Daerah)
export const INITIAL_ACTIVITIES: Activity[] = SHOWCASE_ACTIVITIES;

// Database Riwayat Audit Log (Kosong)
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

// Akun Pengguna Multi-Role (Super Admin, Operator Provinsi, Operator Kab/Kota, Operator Ranting, Anggota, Publik)
export const DEMO_USERS: CurrentUser[] = [
  {
    id: 'user-superadmin-rohadi',
    username: 'rohadiwijaya',
    password: 'rohadiwijaya',
    email: 'rohadiwijaya@sakapariwisata.id',
    name: 'Rohadi Wijaya',
    role: 'SUPER_ADMIN',
    jurisdictionName: 'Kwartir Nasional (Semua Wilayah)',
    memberId: 'mem-nasional-01',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-kwarda-jabar',
    username: 'kwardajabar',
    password: 'kwardajabar',
    email: 'kwarda.jabar@sakapariwisata.id',
    name: 'Kak Hendra (Kwarda Jawa Barat)',
    role: 'ADMIN_PROVINCE',
    jurisdictionName: 'Kwarda Jawa Barat',
    jurisdictionId: '32',
    memberId: 'mem-jabar-01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-kwarcab-bandung',
    username: 'kwarcabbandung',
    password: 'kwarcabbandung',
    email: 'kwarcab.bandung@sakapariwisata.id',
    name: 'Kak Asep (Kwarcab Kab. Bandung)',
    role: 'ADMIN_REGENCY',
    jurisdictionName: 'Kwarcab Kabupaten Bandung',
    jurisdictionId: '32.04',
    memberId: 'mem-jabar-02',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-kwarran-ciwidey',
    username: 'kwarranciwidey',
    password: 'kwarranciwidey',
    email: 'kwarran.ciwidey@sakapariwisata.id',
    name: 'Kak Deden (Kwarran Ciwidey)',
    role: 'ADMIN_BRANCH',
    jurisdictionName: 'Kwarran Ciwidey',
    jurisdictionId: 'br-ciwidey-01',
    memberId: 'mem-jabar-03',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-mem-siti',
    username: 'sitinurhaliza',
    password: 'sitinurhaliza',
    email: 'siti.nurhaliza@sakapariwisata.id',
    name: 'Siti Nurhaliza, S.Tr.Par',
    role: 'MEMBER',
    jurisdictionName: 'Anggota Krida Penyuluh (Kab. Bandung)',
    memberId: 'mem-jabar-02',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-public-guest',
    username: 'wisatawan',
    email: 'wisatawan@nusantara.id',
    name: 'Wisatawan / Pengunjung Publik',
    role: 'PUBLIC',
    jurisdictionName: 'Pengunjung Umum',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
];

// Database Kuliner & Cinderamata 4 Krida Daerah
export const INITIAL_CULINARY_SOUVENIRS: CulinarySouvenirItem[] = SHOWCASE_PRODUCTS;
