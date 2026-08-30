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

// Akun Pengguna Multi-Role (Super Admin Nasional, Anggota Terdaftar, dan Pengunjung Publik)
export const DEMO_USERS: CurrentUser[] = [
  {
    id: 'user-superadmin-rohadi',
    username: 'rohadiwijaya',
    password: 'rohadiwijaya',
    email: 'scoutpreneur@gmail.com',
    name: 'Rohadi Wijaya',
    role: 'SUPER_ADMIN',
    jurisdictionName: 'Kwartir Nasional (Pusat)',
    memberId: 'member-1788087636201',
    avatarUrl: 'https://lh3.googleusercontent.com/d/1Ml-oopzoEgnZ75ZoNuA79KytVhYf3qOV'
  },
  {
    id: 'user-mem-rizky',
    username: 'rizkymaulana',
    password: 'rizkymaulana',
    email: 'rizky.maulana@sakapariwisata.id',
    name: 'Rizky Maulana, S.Par',
    role: 'MEMBER',
    jurisdictionName: 'Anggota Krida Pemandu (Kota Bandung)',
    memberId: 'mem-jabar-01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
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
