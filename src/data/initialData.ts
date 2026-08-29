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

// Akun Utama Aplikasi: Super Admin Rohadi Wijaya
export const DEMO_USERS: CurrentUser[] = [
  {
    id: 'user-superadmin-rohadi',
    username: 'rohadiwijaya',
    password: 'rohadiwijaya',
    email: 'rohadiwijaya@sakapariwisata.id',
    name: 'Rohadi Wijaya',
    role: 'SUPER_ADMIN',
    jurisdictionName: 'Kwartir Nasional (Semua Wilayah)',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

// Database Kuliner & Cinderamata 4 Krida Daerah
export const INITIAL_CULINARY_SOUVENIRS: CulinarySouvenirItem[] = SHOWCASE_PRODUCTS;
