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

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'member-001',
    userId: 'user-member-001',
    nationalMemberNumber: '32.06.12.000123',
    fullName: 'Aris Setiawan, S.Par.',
    nikMasked: '320612******0003',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    gender: 'LAKI_LAKI',
    birthPlace: 'Tasikmalaya',
    birthDate: '1998-06-14',
    phone: '0812-3344-5566',
    email: 'aris.setiawan@sakapariwisata.id',
    address: 'Kp. Sukaresmi RT 02/04 Desa Ciawi, Kec. Ciawi, Tasikmalaya',
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.06',
    regencyName: 'Kabupaten Tasikmalaya',
    districtId: '32.06.12',
    districtName: 'Ciawi',
    branchId: 'branch-32-06-12',
    branchName: 'Saka Pariwisata Kwarran Ciawi',
    gugusDepan: 'Gudep 06.121-06.122 Pangkalan SMKN 1 Ciawi',
    joinYear: 2021,
    status: 'ACTIVE',
    currentPosition: 'Ketua Krida Pemandu',
    krida: 'Krida Pemandu',
    educationLevel: 'Sarjana Terapan Pariwisata',
    occupation: 'Tour Guide & Konsultan Wisata Desa',
    bio: 'Pramuka Penegak Garuda yang mendedikasikan diri untuk pengembangan desa wisata berbasis kearifan lokal di Priangan Timur.',
    skills: [
      {
        id: 'ms-1',
        skillId: 'skill-tour-guide',
        skillName: 'Pemandu Wisata & Tour Guide',
        category: 'Pemanduan & Tour Guide',
        proficiency: 'EXPERT',
        yearsOfExperience: 5,
        portfolioUrl: 'https://instagram.com/aris_tourguide',
        isVerified: true
      },
      {
        id: 'ms-2',
        skillId: 'skill-storytelling',
        skillName: 'Cultural Storytelling & Sejarah',
        category: 'Budaya & Storytelling',
        proficiency: 'ADVANCED',
        yearsOfExperience: 4,
        isVerified: true
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        memberId: 'member-001',
        name: 'Sertifikat Kompetensi Pemandu Wisata Ekowisata',
        certNumber: 'BNSP-PAR-2023-00918',
        issuer: 'BNSP / LSP Pariwisata Indonesia',
        issueDate: '2023-04-12',
        expiryDate: '2026-04-12',
        isVerified: true
      }
    ],
    locationHistory: [
      {
        id: 'loc-1',
        memberId: 'member-001',
        prevBranchName: 'Saka Pariwisata Kwarran Kadipaten',
        newBranchName: 'Saka Pariwisata Kwarran Ciawi',
        prevMemberNumber: '32.06.13.000088',
        newMemberNumber: '32.06.12.000123',
        transferDate: '2023-01-15',
        reason: 'Pindah domisili dan penugasan koordinator pemandu wisata',
        authorizedByName: 'Kak Hendra Purnama (Admin Cabang)'
      }
    ],
    registeredAt: '2021-08-14T09:00:00Z',
    verifiedAt: '2021-08-16T14:30:00Z',
    verifiedBy: 'Kak Hendra Purnama (Kwarran Ciawi)',
    verificationToken: 'VERIFY-SP-320612-000123-AUTHENTIC'
  },
  {
    id: 'member-002',
    userId: 'user-member-002',
    nationalMemberNumber: '32.01.24.000045',
    fullName: 'Nabila Maharani, S.I.Kom.',
    nikMasked: '320124******0012',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    gender: 'PEREMPUAN',
    birthPlace: 'Bogor',
    birthDate: '2000-11-20',
    phone: '0813-8899-7711',
    email: 'nabila.maharani@sakapariwisata.id',
    address: 'Jl. Raya Puncak Cisarua No. 89, Bogor',
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.01',
    regencyName: 'Kabupaten Bogor',
    districtId: '32.01.24',
    districtName: 'Cisarua (Puncak)',
    branchId: 'branch-32-01-24',
    branchName: 'Saka Pariwisata Kwarran Cisarua',
    gugusDepan: 'Gudep 01.245-01.246 Pangkalan SMAN 1 Cisarua',
    joinYear: 2022,
    status: 'ACTIVE',
    currentPosition: 'Anggota Krida Penyuluh',
    krida: 'Krida Penyuluh',
    educationLevel: 'S1 Ilmu Komunikasi',
    occupation: 'Travel Content Creator & Fotografer',
    bio: 'Aktif mendokumentasikan keindahan alam pegunungan Puncak dan memberdayakan promosi digital homestay lokal.',
    skills: [
      {
        id: 'ms-3',
        skillId: 'skill-fotografi',
        skillName: 'Fotografi Destinasi & Landscape',
        category: 'Fotografi & Media',
        proficiency: 'EXPERT',
        yearsOfExperience: 3,
        portfolioUrl: 'https://unsplash.com/@nabilaphoto',
        isVerified: true
      },
      {
        id: 'ms-4',
        skillId: 'skill-digital-marketing',
        skillName: 'Digital Marketing & Content Creator',
        category: 'Digital Marketing & UMKM',
        proficiency: 'ADVANCED',
        yearsOfExperience: 3,
        isVerified: true
      }
    ],
    certifications: [
      {
        id: 'cert-2',
        memberId: 'member-002',
        name: 'Sertifikasi Keahlian Pembuatan Konten Pariwisata Digital',
        certNumber: 'KEMENPAREKRAF-DIG-2023-551',
        issuer: 'Kemenparekraf RI',
        issueDate: '2023-09-10',
        isVerified: true
      }
    ],
    locationHistory: [],
    registeredAt: '2022-03-10T10:15:00Z',
    verifiedAt: '2022-03-12T11:00:00Z',
    verifiedBy: 'Kak Ridwan Hakim',
    verificationToken: 'VERIFY-SP-320124-000045-AUTHENTIC'
  },
  {
    id: 'member-003',
    userId: 'user-member-003',
    nationalMemberNumber: undefined,
    fullName: 'Fikri Haikal',
    nikMasked: '327301******0089',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    gender: 'LAKI_LAKI',
    birthPlace: 'Bandung',
    birthDate: '2003-02-18',
    phone: '0857-1122-3344',
    email: 'fikri.haikal@email.com',
    address: 'Jl. Dago Asri No. 14, Coblong, Kota Bandung',
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.73',
    regencyName: 'Kota Bandung',
    districtId: '32.73.01',
    districtName: 'Coblong',
    branchId: 'branch-32-73-01',
    branchName: 'Saka Pariwisata Kwarran Coblong',
    gugusDepan: 'Gudep 03.111 Pangkalan ITB',
    joinYear: 2024,
    status: 'PENDING',
    currentPosition: 'Calon Anggota Krida Pemandu',
    krida: 'Krida Pemandu',
    educationLevel: 'Diploma 3 Perhotelan',
    occupation: 'Mahasiswa',
    bio: 'Ingin mengabdikan ilmu hospitality dan pemanduan untuk kemajuan destinasi heritage Kota Bandung bersama Saka Pariwisata.',
    skills: [
      {
        id: 'ms-5',
        skillId: 'skill-bahasa-inggris',
        skillName: 'Pemandu Bahasa Asing (English/Mandarin)',
        category: 'Pemanduan & Tour Guide',
        proficiency: 'INTERMEDIATE',
        yearsOfExperience: 2,
        isVerified: false
      }
    ],
    certifications: [],
    locationHistory: [],
    registeredAt: '2026-08-20T08:30:00Z',
    verificationToken: 'VERIFY-PENDING-FIKRI-HAIKAL'
  },
  {
    id: 'member-004',
    userId: 'user-member-004',
    nationalMemberNumber: '51.71.01.000312',
    fullName: 'I Wayan Gede Pratama',
    nikMasked: '517101******0045',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    gender: 'LAKI_LAKI',
    birthPlace: 'Denpasar',
    birthDate: '1997-08-17',
    phone: '0819-2233-4455',
    email: 'wayan.pratama@sakapariwisata.id',
    address: 'Jl. Danau Tamblingan No. 22, Sanur, Denpasar Selatan',
    provinceId: '51',
    provinceName: 'Bali',
    regencyId: '51.71',
    regencyName: 'Kota Denpasar',
    districtId: '51.71.01',
    districtName: 'Denpasar Selatan',
    branchId: 'branch-51-71-01',
    branchName: 'Saka Pariwisata Kwarran Denpasar Selatan',
    gugusDepan: 'Gudep 01.001 Pangkalan Universitas Udayana',
    joinYear: 2020,
    status: 'ACTIVE',
    currentPosition: 'Pamong Krida Mice & Event',
    krida: 'Krida Mice & Event',
    educationLevel: 'S1 Manajemen Kepariwisataan',
    occupation: 'Pengelola Atraksi Wisata Bahari & Event Kepariwisataan',
    bio: 'Pemandu dan pengelola event ekowisata pesisir Sanur. Berkomitmen memajukan pariwisata berkelanjutan berbasis konservasi dan MICE.',
    skills: [
      {
        id: 'ms-6',
        skillId: 'skill-ekowisata',
        skillName: 'Konservasi & Ekowisata Alam',
        category: 'Ekowisata & Alam',
        proficiency: 'EXPERT',
        yearsOfExperience: 6,
        isVerified: true
      },
      {
        id: 'ms-7',
        skillId: 'skill-tour-guide',
        skillName: 'Pemandu Wisata & Tour Guide',
        category: 'Pemanduan & Tour Guide',
        proficiency: 'EXPERT',
        yearsOfExperience: 7,
        isVerified: true
      }
    ],
    certifications: [
      {
        id: 'cert-3',
        memberId: 'member-004',
        name: 'Master Dive Guide & PADI Marine Conservation',
        certNumber: 'PADI-BALI-9921',
        issuer: 'PADI International & Kwarda Bali',
        issueDate: '2021-05-18',
        isVerified: true
      }
    ],
    locationHistory: [],
    registeredAt: '2020-02-14T09:00:00Z',
    verifiedAt: '2020-02-15T10:00:00Z',
    verifiedBy: 'Kak I Wayan Sudarsana',
    verificationToken: 'VERIFY-SP-517101-000312-AUTHENTIC'
  },
  {
    id: 'member-005',
    userId: 'user-member-005',
    nationalMemberNumber: '64.03.05.000078',
    fullName: 'Rahmat Syahputra, S.Hut.',
    nikMasked: '640305******0019',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    gender: 'LAKI_LAKI',
    birthPlace: 'Tanjung Redeb',
    birthDate: '1999-04-25',
    phone: '0812-7788-9900',
    email: 'rahmat.berau@sakapariwisata.id',
    address: 'Pulau Derawan, Kab. Berau, Kalimantan Timur',
    provinceId: '64',
    provinceName: 'Kalimantan Timur',
    regencyId: '64.03',
    regencyName: 'Kabupaten Berau',
    districtId: '64.03.05',
    districtName: 'Derawan Islands',
    branchId: 'branch-64-03-05',
    branchName: 'Saka Pariwisata Kwarran Kepulauan Derawan',
    gugusDepan: 'Gudep 05.012 Pangkalan Kwarcab Berau',
    joinYear: 2021,
    status: 'ACTIVE',
    currentPosition: 'Anggota Krida Kuliner & Cinderamata',
    krida: 'Krida Kuliner & Cinderamata',
    educationLevel: 'S1 Kehutanan & Konservasi',
    occupation: 'Naturalist Guide & Pengembang Cinderamata Alam',
    bio: 'Penggerak konservasi penyu hijau di Kepulauan Derawan dan pembina sentra cinderamata ramah lingkungan.',
    skills: [
      {
        id: 'ms-8',
        skillId: 'skill-ekowisata',
        skillName: 'Konservasi & Ekowisata Alam',
        category: 'Ekowisata & Alam',
        proficiency: 'EXPERT',
        yearsOfExperience: 5,
        isVerified: true
      },
      {
        id: 'ms-9',
        skillId: 'skill-storytelling',
        skillName: 'Cultural Storytelling & Sejarah',
        category: 'Budaya & Storytelling',
        proficiency: 'ADVANCED',
        yearsOfExperience: 4,
        isVerified: true
      }
    ],
    certifications: [
      {
        id: 'cert-4',
        memberId: 'member-005',
        name: 'Sertifikasi Pemandu Wisata Bahari & Geopark',
        certNumber: 'BNSP-BERAU-2022-108',
        issuer: 'BNSP & Dispar Kaltim',
        issueDate: '2022-07-20',
        isVerified: true
      }
    ],
    locationHistory: [],
    registeredAt: '2021-06-11T13:00:00Z',
    verifiedAt: '2021-06-12T15:00:00Z',
    verifiedBy: 'Kak Muhammad Syahrizal',
    verificationToken: 'VERIFY-SP-640305-000078-AUTHENTIC'
  },
  {
    id: 'member-006',
    userId: 'user-member-006',
    nationalMemberNumber: '00.00.00.000001',
    fullName: 'Dr. H. Budi Santoso, M.Par.',
    nikMasked: '317101******0001',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    gender: 'LAKI_LAKI',
    birthPlace: 'Jakarta',
    birthDate: '1985-08-17',
    phone: '0811-2233-4455',
    email: 'budi.santoso@sakapariwisata.id',
    address: 'Jl. Medan Merdeka Timur No. 6, Gambir, Jakarta Pusat',
    provinceId: '00',
    provinceName: 'Kwartir Nasional',
    regencyId: '00.00',
    regencyName: 'Kwartir Nasional (Pusat)',
    districtId: '00.00.00',
    districtName: 'Kwartir Nasional',
    branchId: 'branch-00-00-00',
    branchName: 'Pimpinan Saka Pariwisata Tingkat Nasional',
    gugusDepan: 'Pimpinan Saka Tingkat Nasional',
    joinYear: 2018,
    status: 'ACTIVE',
    currentPosition: 'Pimpinan Saka Tingkat Nasional',
    krida: 'Krida Pemandu',
    educationLevel: 'Doktor Manajemen Pariwisata',
    occupation: 'Pengurus Kwarnas & Konsultan Pariwisata Nasional',
    bio: 'Pimpinan Saka Pariwisata Tingkat Nasional yang mengoordinasikan standardisasi kompetensi dan digitalisasi KTA Saka Pariwisata seluruh Indonesia.',
    skills: [
      {
        id: 'ms-nat-1',
        skillId: 'skill-mice',
        skillName: 'MICE & Event Organizer Wisata',
        category: 'MICE & Event',
        proficiency: 'EXPERT',
        yearsOfExperience: 10,
        isVerified: true
      }
    ],
    certifications: [
      {
        id: 'cert-nat-1',
        memberId: 'member-006',
        name: 'Sertifikasi Asesor BNSP Bidang Kepariwisataan',
        certNumber: 'BNSP-NASIONAL-2020-001',
        issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
        issueDate: '2020-01-15',
        isVerified: true
      }
    ],
    locationHistory: [],
    registeredAt: '2018-08-14T08:00:00Z',
    verifiedAt: '2018-08-14T09:00:00Z',
    verifiedBy: 'Kwartir Nasional Gerakan Pramuka',
    verificationToken: 'VERIFY-SP-000000-000001-AUTHENTIC'
  }
];

export const INITIAL_TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'tour-001',
    title: 'Eksplorasi Desa Wisata Taraju & Tea Walk Priangan Timur',
    slug: 'desa-wisata-taraju-tasikmalaya',
    description: 'Menyusuri pesona perbukitan kebun teh Taraju yang asri, belajar memetik daun teh bersama warga lokal, mencicipi kuliner khas nasi liwet pandan, dan menyaksikan pertunjukan seni calung bambu Saka Pariwisata.',
    category: 'Desa Wisata',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80'
    ],
    ownerType: 'BRANCH',
    ownerId: 'branch-32-06-12',
    ownerName: 'Saka Pariwisata Kwarran Ciawi & Pokdarwis Taraju',
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.06',
    regencyName: 'Kabupaten Tasikmalaya',
    districtName: 'Taraju & Ciawi',
    branchName: 'Saka Pariwisata Kwarran Ciawi',
    locationAddress: 'Desa Taraju, Kec. Taraju, Kab. Tasikmalaya, Jawa Barat',
    coordinates: { lat: -7.4231, lng: 108.0124 },
    googleMapsUrl: 'https://maps.google.com/?q=-7.4231,108.0124',
    durationDays: 2,
    pricePerPerson: 450000,
    minCapacity: 4,
    maxCapacity: 25,
    facilities: [
      'Homestay Rumah Warga Berstandar CHSE (1 Malam)',
      'Konsumsi 4x (Menu Tradisional Sunda Liwet)',
      'Pemandu Saka Pariwisata Berlisensi',
      'Workshop Petik Teh & Souvenir Teh Organik',
      'Dokumentasi Foto & Video Perjalanan',
      'Tiket Masuk & Asuransi Perjalanan'
    ],
    lodgingType: 'Homestay Desa Wisata',
    transportationType: 'Mobil Antar-Jemput Stasiun / Shuttle Desa',
    guideProvided: true,
    contactPhone: '0812-3344-5566',
    contactEmail: 'wisata.taraju@sakapariwisata.id',
    itinerary: [
      {
        day: 1,
        title: 'Kedatangan, Penyambutan Adat & Eksplorasi Kebun Teh',
        description: 'Tiba di desa wisata, penyambutan dengan teh seduh segar, penempatan homestay, dan dilanjutkan tea walk menyusuri lereng perbukitan.',
        timeRange: '09:00 - 17:30'
      },
      {
        day: 2,
        title: 'Workshop Pengolahan Teh Tradisional & Pentas Seni Calung',
        description: 'Melihat proses sangrai teh artisan, sarapan liwet pagi, workshop kerajinan bambu, dan penutupan kegiatan.',
        timeRange: '06:30 - 13:00'
      }
    ],
    status: 'APPROVED_PUBLISHED',
    submittedAt: '2026-06-10T10:00:00Z',
    publishedAt: '2026-06-12T14:00:00Z',
    reviewedBy: 'Admin Kwarda Jawa Barat',
    viewsCount: 1420,
    featured: true
  },
  {
    id: 'tour-002',
    title: 'Sanur Sunrise & Eco-Marine Coral Garden Trail',
    slug: 'sanur-sunrise-eco-marine-bali',
    description: 'Petualangan edukasi ekowisata bahari di Pantai Sanur Denpasar. Menikmati matahari terbit, snorkeling konservasi karang dengan panduan instruktur Saka Pariwisata, dan pelepasan tukik penyu.',
    category: 'Bahari',
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    ],
    ownerType: 'MEMBER',
    ownerId: 'member-004',
    ownerName: 'Kak I Wayan Gede Pratama (Anggota Saka Denpasar)',
    provinceId: '51',
    provinceName: 'Bali',
    regencyId: '51.71',
    regencyName: 'Kota Denpasar',
    districtName: 'Denpasar Selatan',
    branchName: 'Saka Pariwisata Kwarran Denpasar Selatan',
    locationAddress: 'Pantai Sanur, Jl. Hang Tuah, Denpasar Selatan, Bali',
    coordinates: { lat: -8.6705, lng: 115.2638 },
    googleMapsUrl: 'https://maps.google.com/?q=-8.6705,115.2638',
    durationDays: 1,
    pricePerPerson: 375000,
    minCapacity: 2,
    maxCapacity: 15,
    facilities: [
      'Perahu Tradisional Jukung Snorkeling',
      'Peralatan Lengkap Snorkeling (Mask, Snorkel, Fin)',
      'Edukasi Transplantasi Terumbu Karang',
      'Sarapan Pagi di Tepi Pantai & Kelapa Muda',
      'Instruktur Bersertifikat PADI / Saka Pariwisata',
      'Dokumentasi Bawah Air (GoPro HD)'
    ],
    lodgingType: 'Tidak Menginap (One Day Eco Tour)',
    transportationType: 'Perahu Jukung Tradisional',
    guideProvided: true,
    contactPhone: '0819-2233-4455',
    contactEmail: 'wayan.eco@sakapariwisata.id',
    itinerary: [
      {
        day: 1,
        title: 'Sanur Sunrise Watching, Snorkeling Karang & Pelepasan Tukik',
        description: 'Berkumpul pukul 05.30 untuk menyaksikan golden sunrise Sanur, briefing konservasi, snorkeling di coral nursery, dan pelepasan bibit penyu.',
        timeRange: '05:30 - 11:30'
      }
    ],
    status: 'APPROVED_PUBLISHED',
    submittedAt: '2026-07-01T08:00:00Z',
    publishedAt: '2026-07-02T16:00:00Z',
    reviewedBy: 'Admin Kwarda Bali',
    viewsCount: 2310,
    featured: true
  },
  {
    id: 'tour-003',
    title: 'Surga Bahari Kepulauan Derawan & Danau Ubur-ubur Kakaban',
    slug: 'kepulauan-derawan-danau-kakaban-berau',
    description: 'Jelajah gugusan kepulauan tropis Berau: berenang bersama ubur-ubur tanpa sengat di Danau Kakaban, melihat manta ray di Sangalaki, dan menyaksikan penyu bertelur di Pulau Derawan.',
    category: 'Ekowisata',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80'
    ],
    ownerType: 'MEMBER',
    ownerId: 'member-005',
    ownerName: 'Kak Rahmat Syahputra (Saka Berau)',
    provinceId: '64',
    provinceName: 'Kalimantan Timur',
    regencyId: '64.03',
    regencyName: 'Kabupaten Berau',
    districtName: 'Kepulauan Derawan',
    locationAddress: 'Pulau Derawan, Maratua & Kakaban, Kab. Berau, Kaltim',
    coordinates: { lat: 2.2858, lng: 118.2435 },
    googleMapsUrl: 'https://maps.google.com/?q=2.2858,118.2435',
    durationDays: 3,
    pricePerPerson: 1850000,
    minCapacity: 4,
    maxCapacity: 12,
    facilities: [
      'Speedboat Eksklusif 3 Hari Keliling 4 Pulau',
      'Water Villa / Cottage Apung Derawan (2 Malam)',
      'Pemandu Ahli Konservasi Saka Pariwisata',
      'Makan 7x Spesial Olahan Laut Segar',
      'Retribusi Masuk Danau Kakaban & Konservasi Maratua',
      'Alat Snorkeling & Life Jacket Standar Internasional'
    ],
    lodgingType: 'Water Villa Apung Derawan',
    transportationType: 'Speedboat Twin Engine 200HP',
    guideProvided: true,
    contactPhone: '0812-7788-9900',
    contactEmail: 'derawan.saka@sakapariwisata.id',
    itinerary: [
      {
        day: 1,
        title: 'Penjemputan Tanjung Batu & Sunset Pulau Derawan',
        description: 'Tiba di dermaga Tanjung Batu, transfer boat ke Pulau Derawan, check-in water villa, dan susur dermaga melihat penyu liar.',
        timeRange: '12:00 - 19:00'
      },
      {
        day: 2,
        title: 'Danau Purba Kakaban, Manta Point Sangalaki & Goa Haji Mangku',
        description: 'Snorkeling di danau ubur-ubur Kakaban, melihat pari manta raksasa di Sangalaki, dan cliff jumping di Maratua.',
        timeRange: '07:30 - 17:00'
      },
      {
        day: 3,
        title: 'Gusung Pasir Derawan & Kepulangan',
        description: 'Foto di pulau pasir timbul Gusung Sanggalau, sarapan pagi, dan kembali menuju dermaga utama.',
        timeRange: '06:00 - 12:00'
      }
    ],
    status: 'APPROVED_PUBLISHED',
    submittedAt: '2026-07-15T09:00:00Z',
    publishedAt: '2026-07-16T12:00:00Z',
    reviewedBy: 'Admin Super Nasional',
    viewsCount: 3120,
    featured: true
  },
  {
    id: 'tour-004',
    title: 'Walking Tour Heritage & Arsitektur Kolonial Dago Bandung',
    slug: 'walking-tour-heritage-bandung',
    description: 'Jelajah jalan kaki menyusuri mahakarya arsitektur Art Deco Bandung tempo doeloe bersama pemandu Saka Pariwisata dengan narasi sejarah hidup.',
    category: 'Heritage & Sejarah',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    galleryImages: [],
    ownerType: 'BRANCH',
    ownerId: 'branch-32-73-01',
    ownerName: 'Saka Pariwisata Kwarran Coblong Bandung',
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.73',
    regencyName: 'Kota Bandung',
    districtName: 'Coblong & Dago',
    locationAddress: 'Titik Kumpul: Taman Ganesha ITB, Coblong, Kota Bandung',
    coordinates: { lat: -6.8932, lng: 107.6105 },
    durationDays: 1,
    pricePerPerson: 95000,
    minCapacity: 5,
    maxCapacity: 30,
    facilities: [
      'Pemandu Heritage Bersertifikasi & Storyteller',
      'Wireless Audio Tour Guide System (Receiver)',
      'Snack Box Tradisional & Kopi Susu Dago',
      'Buku Saku Peta Sejarah Bandung Heritage',
      'Stiker & Pin Kenang-kenangan Saka Pariwisata'
    ],
    lodgingType: 'Tanpa Menginap',
    transportationType: 'Walking Tour (Jalan Kaki)',
    guideProvided: true,
    contactPhone: '0821-4433-2211',
    contactEmail: 'heritage.bandung@sakapariwisata.id',
    itinerary: [
      {
        day: 1,
        title: 'Menelusuri Jejak Arsitektur Wolff Schoemaker & Dago Heritage',
        description: 'Rute: Kampus ITB Ganesha - Villa Isola - Rumah Bersejarah Jl. Dago - Coffee Break & Diskusi Sejarah.',
        timeRange: '15:30 - 18:30'
      }
    ],
    status: 'SUBMITTED',
    submittedAt: '2026-08-22T11:00:00Z',
    viewsCount: 180,
    featured: false
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    title: 'Perkemahan Bakti Saka Pariwisata Nasional (Pertisaka) 2026',
    slug: 'pertisaka-nasional-2026',
    description: 'Ajang akbar perjumpaan 3.000 Pramuka Penegak & Pandega Saka Pariwisata se-Indonesia. Mengusung tema "Ekowisata Berkelanjutan & Digitalisasi Destinasi Nusantara" dengan agenda jambore wisata, workshop CHSE, lomba pemandu wisata muda, dan bakti bersih destinasi prioritas.',
    bannerUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1000&auto=format&fit=crop&q=80',
    category: 'Perkemahan & Jambore',
    organizerLevel: 'NASIONAL',
    organizerName: 'Pimpinan Saka Pariwisata Tingkat Nasional / Kwarnas',
    locationName: 'Bumi Perkemahan & Graha Wisata (Buperta) Cibubur, Jakarta Timur',
    provinceName: 'DKI Jakarta',
    regencyName: 'Kota Jakarta Timur',
    startDate: '2026-10-15',
    endDate: '2026-10-20',
    timeString: '07:30 WIB - Selesai',
    capacity: 3000,
    registeredCount: 2410,
    isPublic: true,
    status: 'UPCOMING',
    requirements: [
      'Anggota Aktif Saka Pariwisata dengan KTA Digital Terverifikasi',
      'Mendapat Surat Mandat dari Kwarda/Kwarcab Masing-Masing',
      'Memiliki Kualifikasi Minimal 1 Krida Saka Pariwisata'
    ]
  },
  {
    id: 'act-002',
    title: 'Pelatihan Sertifikasi Pemandu Ekowisata & Storytelling Jawa Barat',
    slug: 'pelatihan-pemandu-ekowisata-jabar',
    description: 'Program peningkatan kompetensi teknis bagi anggota Saka Pariwisata untuk mendapatkan sertifikasi pemandu wisata berskala BNSP dan pembekalan teknik narasi budaya lokal.',
    bannerUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80',
    category: 'Pelatihan & Sertifikasi',
    organizerLevel: 'PROVINSI',
    organizerName: 'Pimpinan Saka Pariwisata Kwarda Jawa Barat',
    locationName: 'Pusdiklatda Jawa Barat, Jatinangor',
    provinceName: 'Jawa Barat',
    regencyName: 'Kabupaten Sumedang',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    timeString: '08:00 - 17:00 WIB',
    capacity: 150,
    registeredCount: 138,
    isPublic: true,
    status: 'UPCOMING',
    requirements: [
      'Anggota Saka Pariwisata di wilayah Kwarda Jawa Barat',
      'Telah aktif minimal 1 tahun di Gugus Depan / Ranting',
      'Membawa portofolio pemanduan atau eksplorasi wisata lokal'
    ]
  },
  {
    id: 'act-003',
    title: 'Gerakan Bersih Pantai & Transplantasi Karang Pesisir Bali',
    slug: 'bersih-pantai-transplantasi-karang-bali',
    description: 'Aksi nyata Krida Penyuluh dan Krida Mice & Event dalam memulihkan ekosistem pesisir serta edukasi pelancong tanpa sampah plastik.',
    bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    category: 'Bakti Wisata & Lingkungan',
    organizerLevel: 'KABUPATEN',
    organizerName: 'Kwarcab Denpasar & Saka Pariwisata Denpasar',
    locationName: 'Pantai Mertasari Sanur, Denpasar',
    provinceName: 'Bali',
    regencyName: 'Kota Denpasar',
    startDate: '2026-09-12',
    endDate: '2026-09-12',
    timeString: '06:00 - 12:00 WITA',
    capacity: 300,
    registeredCount: 285,
    isPublic: true,
    status: 'UPCOMING',
    requirements: [
      'Terbuka untuk seluruh anggota Pramuka & relawan pariwisata'
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'user-admin-nasional',
    userName: 'Kak Reza Pahlevi',
    userRole: 'SUPER_ADMIN',
    action: 'MEMBER_VERIFIED',
    entityType: 'MEMBER',
    entityId: 'member-001',
    description: 'Memverifikasi dan menerbitkan Nomor Anggota Nasional 32.06.12.000123 untuk Aris Setiawan',
    timestamp: '2026-08-25T14:30:00Z',
    ipAddress: '180.252.164.12'
  },
  {
    id: 'log-002',
    userId: 'user-admin-jabar',
    userName: 'Kak Hj. Ratna Sari, S.E.',
    userRole: 'ADMIN_PROVINCE',
    action: 'TOUR_PACKAGE_APPROVED',
    entityType: 'TOUR_PACKAGE',
    entityId: 'tour-001',
    description: 'Menyetujui publikasi paket wisata "Eksplorasi Desa Wisata Taraju"',
    timestamp: '2026-08-24T11:15:00Z',
    ipAddress: '114.122.34.89'
  },
  {
    id: 'log-003',
    userId: 'user-admin-ciawi',
    userName: 'Kak Hendra Purnama, S.Par.',
    userRole: 'ADMIN_BRANCH',
    action: 'MEMBER_LOCATION_TRANSFER',
    entityType: 'MEMBER',
    entityId: 'member-001',
    description: 'Mencatat mutasi wilayah anggota dari Kwarran Kadipaten ke Kwarran Ciawi',
    timestamp: '2026-08-23T09:00:00Z',
    ipAddress: '103.28.12.45'
  }
];

export const DEMO_USERS: CurrentUser[] = [
  {
    id: 'user-admin-nasional',
    email: 'superadmin@sakapariwisata.id',
    name: 'Kak Reza Pahlevi',
    role: 'SUPER_ADMIN',
    jurisdictionName: 'Kwartir Nasional (Semua Wilayah)',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-admin-jabar',
    email: 'kwarda.jabar@sakapariwisata.id',
    name: 'Kak Hj. Ratna Sari, S.E.',
    role: 'ADMIN_PROVINCE',
    jurisdictionName: 'Kwarda Jawa Barat (32)',
    jurisdictionId: '32',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-operator-bogor',
    email: 'operator.kwarcab.bogor@sakapariwisata.id',
    name: 'Kak Ridwan Hakim (Operator Kwarcab Bogor)',
    role: 'ADMIN_REGENCY',
    jurisdictionName: 'Kwarcab Kab. Bogor (32.01)',
    jurisdictionId: '32.01',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-operator-tasik',
    email: 'operator.kwarcab.tasik@sakapariwisata.id',
    name: 'Kak Hendra Purnama, S.Par. (Operator Kwarcab Tasikmalaya)',
    role: 'ADMIN_REGENCY',
    jurisdictionName: 'Kwarcab Kab. Tasikmalaya (32.06)',
    jurisdictionId: '32.06',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-admin-coblong',
    email: 'kwarran.coblong@sakapariwisata.id',
    name: 'Kak Dedi Supardi (Admin Kwarran Coblong)',
    role: 'ADMIN_BRANCH',
    jurisdictionName: 'Kwarran Coblong Kota Bandung (32.73.01)',
    jurisdictionId: '32.73.01',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-member-001',
    email: 'aris.setiawan@sakapariwisata.id',
    name: 'Kak Aris Setiawan, S.Par.',
    role: 'MEMBER',
    jurisdictionName: 'Anggota Saka Aktif (Tasikmalaya)',
    memberId: 'member-001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-public',
    email: 'tamu@wisataindonesia.com',
    name: 'Pengunjung Publik / Wisatawan',
    role: 'PUBLIC',
    jurisdictionName: 'Portal Wisata & Verifikasi',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CULINARY_SOUVENIRS: CulinarySouvenirItem[] = [
  {
    id: 'cs-001',
    name: 'Nasi Tutug Oncom & Sambal Goang Khas Tasikmalaya',
    kind: 'KULINER',
    categoryLabel: 'Makanan Tradisional Khas',
    description: 'Nasi hangat pulen yang diaduk dengan oncom bakar berbumbu kencur gurih, disajikan dengan ayam goreng kampung lengkuas, tahu tempe goreng, lalapan segar, dan sambal goang pedas segar.',
    storyOrigin: 'Kuliner warisan Parahyangan Timur yang telah ada sejak abad ke-19. Dahulu menjadi santapan bersahaja masyarakat agraris Tasikmalaya yang kini menjadi ikon gastronomi kebanggaan Jawa Barat.',
    priceEstimate: 28000,
    priceUnit: 'per porsi lengkap',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.06',
    regencyName: 'Kabupaten Tasikmalaya',
    districtId: '32.06.01',
    districtName: 'Kwarran Ciawi',
    gudepOrPangkalan: 'Pangkalan Saka Pariwisata Kwarran Ciawi',
    authorMemberId: 'member-001',
    authorName: 'Kak Aris Setiawan, S.Par.',
    authorNta: '32.06.01.000001',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Instruktur Saka Pariwisata',
    umkmName: 'Dapur Oncom Warisan Kang Aris & Karang Taruna Ciawi',
    contactPhone: '0812-3456-7890',
    address: 'Jl. Raya Ciawi No. 45, Ciawi, Kab. Tasikmalaya, Jawa Barat',
    tags: ['Halal', 'Khas Sunda', 'Ikonik', 'UMKM Binaan Saka'],
    status: 'PUBLISHED',
    createdAt: '2026-07-15T09:00:00Z',
    likesCount: 142,
    featured: true
  },
  {
    id: 'cs-002',
    name: 'Payung Geulis Lukis Bambu Khas Tasikmalaya',
    kind: 'CINDERAMATA',
    categoryLabel: 'Kriya & Kerajinan Tangan Tradisional',
    description: 'Payung tradisional artistik berbahan rangka bambu pilihan dan kertas semen/kain sutra yang dilukis tangan bermotif flora Sunda warna-warni cerah. Merupakan Warisan Budaya Takbenda Indonesia.',
    storyOrigin: 'Payung Geulis diciptakan sejak dekade 1930-an oleh perajin di Indihiang Tasikmalaya sebagai pelengkap busana noni Belanda dan putri bangsawan Sunda yang memesona.',
    priceEstimate: 85000,
    priceUnit: 'per buah (diameter 60cm)',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.06',
    regencyName: 'Kabupaten Tasikmalaya',
    districtId: '32.06.02',
    districtName: 'Kwarran Indihiang',
    gudepOrPangkalan: 'Sanggar Seni & Kerajinan Saka Tasikmalaya',
    authorMemberId: 'member-001',
    authorName: 'Kak Aris Setiawan, S.Par.',
    authorNta: '32.06.01.000001',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Instruktur Saka',
    umkmName: 'Sentra Perajin Payung Geulis Karya Mandiri Saka',
    contactPhone: '0812-3456-7890',
    address: 'Kampung Panyingkiran, Indihiang, Tasikmalaya',
    tags: ['Warisan Budaya', 'Handmade', 'Cinderamata Khas', 'Seni Tradisional'],
    status: 'PUBLISHED',
    createdAt: '2026-07-16T11:30:00Z',
    likesCount: 98,
    featured: true
  },
  {
    id: 'cs-003',
    name: 'Asinan Buah & Sayur Gedung Dalam Khas Bogor',
    kind: 'KULINER',
    categoryLabel: 'Jajanan Segar & Manisan Daerah',
    description: 'Perpaduan irisan bengkuang, kedondong, salak, mangga muda, toge, kol, dan tahu sutra kuning yang disiram kuah cuka cabai merah asam manis segar bertabur kacang tanah sangrai renyah.',
    storyOrigin: 'Diciptakan pertama kali pada tahun 1970-an di kawasan cagar budaya Gedung Dalam Sukasari Bogor, memadukan cita rasa pecinan peranakan dan kesegaran rempah bumi Pasundan.',
    priceEstimate: 35000,
    priceUnit: 'per porsi / bungkus',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.01',
    regencyName: 'Kabupaten Bogor',
    districtId: '32.01.01',
    districtName: 'Kwarran Sukaraja',
    gudepOrPangkalan: 'Pangkalan Saka Pariwisata Kwarran Sukaraja',
    authorMemberId: 'member-002',
    authorName: 'Kak Nurlina Fitriani, A.Md.Par.',
    authorNta: '32.01.01.000002',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Pamong Saka Pariwisata',
    umkmName: 'Asinan Asli Segar Binaan Saka Sukaraja',
    contactPhone: '0813-8899-0011',
    address: 'Jl. Raya Sukaraja No. 88, Kab. Bogor, Jawa Barat',
    tags: ['Halal', 'Segar', 'Oleh-oleh Legendaris', 'Kuliner Sehat'],
    status: 'PUBLISHED',
    createdAt: '2026-07-20T14:15:00Z',
    likesCount: 167,
    featured: true
  },
  {
    id: 'cs-004',
    name: 'Kain Tenun Ikat Sikka Pewarna Alam Flores',
    kind: 'CINDERAMATA',
    categoryLabel: 'Kain Tenun Tradisional',
    description: 'Kain tenun ikat tangan khas suku Sikka Maumere yang ditenun secara tradisional dengan benang kapas pintal tangan dan menggunakan pewarna alami dari akar mengkudu dan daun nila.',
    storyOrigin: 'Setiap motif tenun ikat Sikka mencerminkan status sosial, doa keselamatan, serta hubungan harmonis antara manusia, leluhur, dan alam pegunungan Flores yang suci.',
    priceEstimate: 380000,
    priceUnit: 'per lembar kain (200x110cm)',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '53',
    provinceName: 'Nusa Tenggara Timur',
    regencyId: '53.07',
    regencyName: 'Kabupaten Sikka',
    districtId: '53.07.01',
    districtName: 'Kwarran Alok Timur',
    gudepOrPangkalan: 'Saka Pariwisata Kwarran Alok Timur Maumere',
    authorMemberId: 'member-003',
    authorName: 'Kak Yohanes Baptista, S.Pd.',
    authorNta: '53.07.01.000003',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Pamong Krida Pemanduan',
    umkmName: 'Kelompok Tenun Lepo Lorun Sikka Binaan Saka',
    contactPhone: '0821-4567-8901',
    address: 'Desa Nita, Alok Timur, Kab. Sikka, NTT',
    tags: ['Pewarna Alami', 'Tenun Tradisional', 'Eksklusif', 'Kriya Nusantara'],
    status: 'PUBLISHED',
    createdAt: '2026-07-22T16:40:00Z',
    likesCount: 215,
    featured: true
  },
  {
    id: 'cs-005',
    name: 'Ayam Betutu Gilimanuk Rempah 16 Khas Bali',
    kind: 'KULINER',
    categoryLabel: 'Kuliner Rempah Tradisional',
    description: 'Ayam utuh yang dibumbui dengan base genep (16 rempah rahasia Bali), dibungkus pelepah pinang/daun pisang, kemudian dimasak perlahan hingga daging empuk meresap dan sangat wangi.',
    storyOrigin: 'Betutu merupakan hidangan persembahan sakral dalam upacara keagamaan Hindu Bali yang berasal dari desa-desa di pesisir Jembrana dan Tabanan sejak abad ke-16.',
    priceEstimate: 95000,
    priceUnit: 'per ekor (lengkap plecing & sambal matah)',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '51',
    provinceName: 'Bali',
    regencyId: '51.71',
    regencyName: 'Kota Denpasar',
    districtId: '51.71.01',
    districtName: 'Kwarran Denpasar Selatan',
    gudepOrPangkalan: 'Pangkalan Saka Pariwisata Sanur',
    authorMemberId: 'member-004',
    authorName: 'Kak I Wayan Gede Pratama',
    authorNta: '51.71.01.000004',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Instruktur Krida Kuliner Saka',
    umkmName: 'Warung Betutu Segar Sanur Binaan Pramuka',
    contactPhone: '0819-2233-4455',
    address: 'Jl. Danau Tamblingan No. 72, Sanur, Denpasar Selatan, Bali',
    tags: ['Halal Ready', 'Kaya Rempah', 'Ikon Bali', 'Binaan Saka'],
    status: 'PUBLISHED',
    createdAt: '2026-07-25T10:00:00Z',
    likesCount: 189,
    featured: true
  },
  {
    id: 'cs-006',
    name: 'Topeng Kayu Pahat Barong & Kriya Seni Ubud',
    kind: 'CINDERAMATA',
    categoryLabel: 'Kriya Ukir Kayu Nusantara',
    description: 'Ukiran topeng kayu pule dan albasiah khas seniman Gianyar dengan detail pahatan tangan halus, disepuh dengan cat pigmen alami emas prada dan ornamen bulu ijuk tradisional.',
    storyOrigin: 'Seni ukir topeng di Gianyar berakar dari tradisi sakral tarian Barong dan Calonarang untuk mengusir energi negatif serta menjaga keseimbangan alam dan spiritual.',
    priceEstimate: 165000,
    priceUnit: 'per pcs (include dudukan pajang)',
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '51',
    provinceName: 'Bali',
    regencyId: '51.04',
    regencyName: 'Kabupaten Gianyar',
    districtId: '51.04.01',
    districtName: 'Kwarran Ubud',
    gudepOrPangkalan: 'Sanggar Seni Saka Gianyar',
    authorMemberId: 'member-004',
    authorName: 'Kak I Wayan Gede Pratama',
    authorNta: '51.71.01.000004',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Instruktur Saka',
    umkmName: 'Studio Pahat Kayu Putra Bali Saka',
    contactPhone: '0819-2233-4455',
    address: 'Desa Mas, Ubud, Kab. Gianyar, Bali',
    tags: ['Pahatan Tangan', 'Kayu Alami', 'Artistik', 'Suvenir Elegan'],
    status: 'PUBLISHED',
    createdAt: '2026-07-28T13:20:00Z',
    likesCount: 130,
    featured: true
  },
  {
    id: 'cs-007',
    name: 'Kain Batik Tulis Mega Mendung Keraton Cirebon',
    kind: 'CINDERAMATA',
    categoryLabel: 'Batik Tulis Tradisional',
    description: 'Kain batik tulis canting tembaga asli bermotif awan Mega Mendung dengan 7 gradasi warna biru indigo tegas yang melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa pemimpin.',
    storyOrigin: 'Diciptakan oleh Pangeran Losari pada abad ke-16, memadukan falsafah Sufisme Islam Cirebon dan pengaruh estetika ornamen Tiongkok dari Putri Ong Tien.',
    priceEstimate: 295000,
    priceUnit: 'per lembar kain (220x115cm)',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596464716127-f2a829822301?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '32',
    provinceName: 'Jawa Barat',
    regencyId: '32.09',
    regencyName: 'Kabupaten Cirebon',
    districtId: '32.09.01',
    districtName: 'Kwarran Weru',
    gudepOrPangkalan: 'Pangkalan Saka Pariwisata Trusmi',
    authorMemberId: 'member-001',
    authorName: 'Kak Aris Setiawan, S.Par.',
    authorNta: '32.06.01.000001',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Instruktur Saka',
    umkmName: 'Sentra Batik Tulis Trusmi Cirebon',
    contactPhone: '0812-7788-9900',
    address: 'Jl. Trusmi Kulon No. 12, Weru, Cirebon, Jawa Barat',
    tags: ['Batik Tulis Asli', 'Warisan Keraton', 'Koleksi Seni', 'Ikonik Cirebon'],
    status: 'PUBLISHED',
    createdAt: '2026-08-01T08:00:00Z',
    likesCount: 176,
    featured: true
  },
  {
    id: 'cs-008',
    name: 'Tas Anyaman Noken Serat Kayu Asli Papua',
    kind: 'CINDERAMATA',
    categoryLabel: 'Anyaman Tradisional Warisan UNESCO',
    description: 'Tas tradisional masyarakat Papua yang dirajut tangan dari serat pohon mahkota dewa atau anggrek hutan tanpa bantuan mesin. Kuat, lentur, elastis, dan diakui sebagai Warisan Dunia UNESCO.',
    storyOrigin: 'Simbol kehidupan, kesuburan, cinta kasih seorang ibu, dan kebijaksanaan masyarakat adat Papua. Digunakan untuk membawa hasil panen hingga perlengkapan sehari-hari.',
    priceEstimate: 140000,
    priceUnit: 'per tas noken',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    provinceId: '91',
    provinceName: 'Papua',
    regencyId: '91.03',
    regencyName: 'Kabupaten Jayapura',
    districtId: '91.03.01',
    districtName: 'Kwarran Sentani',
    gudepOrPangkalan: 'Pangkalan Saka Pariwisata Kwarran Sentani',
    authorMemberId: 'member-003',
    authorName: 'Kak Yohanes Baptista, S.Pd.',
    authorNta: '53.07.01.000003',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Pamong Saka',
    umkmName: 'Mama-Mama Pengrajin Noken Sentani Binaan Saka',
    contactPhone: '0812-9988-1122',
    address: 'Pasar Seni Phinisi Sentani, Jayapura, Papua',
    tags: ['UNESCO Heritage', 'Serat Alami', 'Handmade Papua', 'Ramah Lingkungan'],
    status: 'PUBLISHED',
    createdAt: '2026-08-05T15:10:00Z',
    likesCount: 248,
    featured: true
  }
];

