import { Destination, ClimateMonthData } from '../types';

// Helper to quickly generate 12-month climate data for typical winter destinations
function createClimate(
  winterMin: number,
  winterMax: number,
  springMin: number,
  springMax: number,
  summerMin: number,
  summerMax: number,
  autumnMin: number,
  autumnMax: number,
  snowPeak: 'Tinggi' | 'Sedang' | 'Rendah' | 'Nol' = 'Tinggi',
  winterNote: string = 'Salju & dingin menusuk'
): Record<number, ClimateMonthData> {
  return {
    1: {
      min: winterMin,
      max: winterMax,
      label: 'Puncak Musim Dingin (Peak Winter)',
      condition: snowPeak === 'Tinggi' ? 'Salju tebal & suhu beku' : 'Dingin menusuk',
      snowLikelihood: snowPeak,
      feelsLikeOffset: -4,
      description: winterNote
    },
    2: {
      min: winterMin + 1,
      max: winterMax + 1,
      label: 'Musim Dingin Akhir',
      condition: 'Salju padat & angin dingin',
      snowLikelihood: snowPeak === 'Nol' ? 'Nol' : 'Sedang',
      feelsLikeOffset: -3,
      description: 'Udara masih sangat dingin terutama malam hari.'
    },
    3: {
      min: springMin - 2,
      max: springMax - 2,
      label: 'Awal Musim Semi (Early Spring)',
      condition: 'Sisa salju mencair, angin sejuk',
      snowLikelihood: snowPeak === 'Tinggi' ? 'Sedang' : 'Rendah',
      feelsLikeOffset: -2,
      description: 'Transisi musim, siang sejuk malam masih menusuk.'
    },
    4: {
      min: springMin,
      max: springMax,
      label: 'Musim Semi Sejuk (Spring Blossom)',
      condition: 'Bunga bermekaran, sejuk nyaman',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Udara segar, butuh jaket ringan atau trench coat.'
    },
    5: {
      min: springMin + 4,
      max: springMax + 4,
      label: 'Musim Semi Hangat',
      condition: 'Hangat bersahabat',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Nyaman untuk jalan kaki santai seharian.'
    },
    6: {
      min: summerMin,
      max: summerMax,
      label: 'Awal Musim Panas',
      condition: 'Cerah hangat',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Hangat dan cerah.'
    },
    7: {
      min: summerMin + 2,
      max: summerMax + 3,
      label: 'Musim Panas',
      condition: 'Hangat',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Puncak musim panas.'
    },
    8: {
      min: summerMin + 1,
      max: summerMax + 2,
      label: 'Musim Panas Akhir',
      condition: 'Hangat',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Suhu mulai menurun perlahan.'
    },
    9: {
      min: autumnMin + 4,
      max: autumnMax + 3,
      label: 'Awal Musim Gugur (Early Autumn)',
      condition: 'Sejuk segar berangin',
      snowLikelihood: 'Nol',
      feelsLikeOffset: -1,
      description: 'Dedaunan mulai menguning, jaket windbreaker pas.'
    },
    10: {
      min: autumnMin,
      max: autumnMax,
      label: 'Puncak Musim Gugur (Autumn Foliage)',
      condition: 'Sejuk berangin, daun merah spektakuler',
      snowLikelihood: 'Rendah',
      feelsLikeOffset: -2,
      description: 'Waktu favorit wisatawan; butuh wool coat atau jaket mid layer.'
    },
    11: {
      min: winterMin + 4,
      max: winterMax + 5,
      label: 'Pra-Musim Dingin (Late Autumn)',
      condition: 'Dingin menusuk, embun beku',
      snowLikelihood: snowPeak === 'Tinggi' ? 'Sedang' : 'Rendah',
      feelsLikeOffset: -3,
      description: 'Udara mulai beku di malam hari, wajib heattech dan mantel tebal.'
    },
    12: {
      min: winterMin + 1,
      max: winterMax + 2,
      label: 'Awal Musim Dingin (Festive Winter)',
      condition: 'Salju pertama turun, lampu natal meriah',
      snowLikelihood: snowPeak,
      feelsLikeOffset: -4,
      description: 'Suasana liburan akhir tahun yang syahdu dan dingin.'
    }
  };
}


// Helper to generate 12-month climate data for Southern Hemisphere (New Zealand & Australia)
// where Winter/Snow is in June-August, and Summer is in December-February
function createSouthernClimate(
  winterMin: number,
  winterMax: number,
  springMin: number,
  springMax: number,
  summerMin: number,
  summerMax: number,
  autumnMin: number,
  autumnMax: number,
  snowPeak: 'Tinggi' | 'Sedang' | 'Rendah' | 'Nol' = 'Tinggi',
  winterNote: string = 'Puncak salju & musim dingin belahan bumi selatan.'
): Record<number, ClimateMonthData> {
  return {
    6: {
      min: winterMin + 1,
      max: winterMax + 2,
      label: 'Awal Musim Dingin (Opening Ski)',
      condition: 'Resort salju mulai buka, udara beku',
      snowLikelihood: snowPeak === 'Nol' ? 'Rendah' : 'Sedang',
      feelsLikeOffset: -3,
      description: 'Awal musim ski Selandia Baru & Australia, udara mulai dingin menusuk.'
    },
    7: {
      min: winterMin,
      max: winterMax,
      label: 'Puncak Musim Dingin Salju (Peak Winter)',
      condition: snowPeak === 'Tinggi' ? 'Salju tebal & suhu beku' : 'Dingin menusuk berkabut',
      snowLikelihood: snowPeak,
      feelsLikeOffset: -4,
      description: winterNote || 'Puncak liburan salju musim dingin dan ski resort ramai.'
    },
    8: {
      min: winterMin + 1,
      max: winterMax + 1,
      label: 'Musim Dingin Akhir (Deep Snow)',
      condition: 'Salju tebal melimpah, angin dingin',
      snowLikelihood: snowPeak,
      feelsLikeOffset: -3,
      description: 'Salju bubuk terbaik untuk ski dan snowboarding.'
    },
    9: {
      min: springMin - 1,
      max: springMax - 1,
      label: 'Awal Musim Semi (Early Spring)',
      condition: 'Sisa salju mencair di pegunungan, sejuk',
      snowLikelihood: snowPeak === 'Tinggi' ? 'Sedang' : 'Rendah',
      feelsLikeOffset: -2,
      description: 'Transisi musim semi, siang hari sejuk nyaman.'
    },
    10: {
      min: springMin,
      max: springMax,
      label: 'Musim Semi Sejuk (Spring Blossom)',
      condition: 'Bunga bermekaran, sejuk segar',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Pemandangan alam menghijau, udara segar berangin sejuk.'
    },
    11: {
      min: springMin + 3,
      max: springMax + 3,
      label: 'Musim Semi Hangat',
      condition: 'Hangat cerah bersahabat',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Nyaman untuk hiking dan jalan-jalan santai.'
    },
    12: {
      min: summerMin,
      max: summerMax,
      label: 'Awal Musim Panas (Festive Summer)',
      condition: 'Cerah hangat berangin',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Musim panas libur akhir tahun.'
    },
    1: {
      min: summerMin + 2,
      max: summerMax + 3,
      label: 'Puncak Musim Panas (Peak Summer)',
      condition: 'Hangat cerah',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Hari panjang berlimpah sinar matahari.'
    },
    2: {
      min: summerMin + 1,
      max: summerMax + 2,
      label: 'Musim Panas Akhir',
      condition: 'Hangat nyaman',
      snowLikelihood: 'Nol',
      feelsLikeOffset: 0,
      description: 'Cuaca stabil untuk outdoor adventure.'
    },
    3: {
      min: autumnMin + 3,
      max: autumnMax + 3,
      label: 'Awal Musim Gugur (Early Autumn)',
      condition: 'Sejuk nyaman berangin',
      snowLikelihood: 'Nol',
      feelsLikeOffset: -1,
      description: 'Dedaunan mulai berubah warna keemasan.'
    },
    4: {
      min: autumnMin,
      max: autumnMax,
      label: 'Puncak Musim Gugur (Golden Autumn)',
      condition: 'Sejuk dingin, daun keemasan spektakuler',
      snowLikelihood: 'Rendah',
      feelsLikeOffset: -2,
      description: 'Pemandangan golden foliage yang sangat memukau di Arrowtown & Wanaka.'
    },
    5: {
      min: winterMin + 3,
      max: winterMax + 4,
      label: 'Pra-Musim Dingin (Late Autumn)',
      condition: 'Dingin menusuk, embun es pertama',
      snowLikelihood: snowPeak === 'Tinggi' ? 'Sedang' : 'Rendah',
      feelsLikeOffset: -3,
      description: 'Puncak gunung mulai bersalju putih, udara dingin menusuk.'
    }
  };
}

export const ALL_DESTINATIONS: Destination[] = [
  // ==========================================
  // JEPANG (20 KOTA & RESORT SALJU)
  // ==========================================
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Shinjuku, Shibuya, Ginza & Illumination Festival',
    months: createClimate(1, 9, 7, 16, 21, 28, 14, 21, 'Rendah', 'Angin kering Tokyo menusuk tulang, wajib coat windproof.')
  },
  {
    id: 'sapporo',
    name: 'Sapporo (Hokkaido)',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Sapporo Snow Festival & Odori Park',
    months: createClimate(-8, -1, 3, 11, 16, 24, 10, 18, 'Tinggi', 'Salju bubuk tebal sepanjang hari, butuh parka tebal -15°C.')
  },
  {
    id: 'osaka_kyoto',
    name: 'Osaka & Kyoto',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Fushimi Inari, Kiyomizu-dera & Dotonbori',
    months: createClimate(2, 9, 6, 17, 22, 30, 15, 23, 'Rendah', 'Kuil bersejarah berselimut salju tipis yang sangat estetik.')
  },
  {
    id: 'shirakawago',
    name: 'Shirakawa-go',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Desa Tradisional Warisan Dunia UNESCO & Rumah Gassho',
    months: createClimate(-6, 2, 2, 12, 17, 26, 9, 18, 'Tinggi', 'Tumpukan salju bisa mencapai 2 meter, wajib boots anti-slip & jaket tebal.')
  },
  {
    id: 'mt_fuji',
    name: 'Mt. Fuji & Kawaguchiko',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Pemandangan Gunung Fuji bersalju & Pagoda Chureito',
    months: createClimate(-4, 5, 4, 15, 18, 27, 11, 20, 'Sedang', 'Angin danau sangat dingin, wajib beanie, syal & sarung tangan tebal.')
  },
  {
    id: 'niseko',
    name: 'Niseko',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Powder Snow Skiing & Onsen Air Panas Alami',
    months: createClimate(-11, -3, 0, 8, 14, 22, 8, 16, 'Tinggi', 'Salah satu salju bubuk terbaik di dunia, jaket ski waterproof wajib.')
  },
  {
    id: 'otaru',
    name: 'Otaru',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800',
    popularHighlight: 'Kanal Otaru & Festival Lentera Salju',
    months: createClimate(-7, 0, 2, 10, 15, 23, 11, 18, 'Tinggi', 'Kota pelabuhan romantis berlapis salju dan lampu gas kuno.')
  },
  {
    id: 'hakodate',
    name: 'Hakodate',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    popularHighlight: 'Pemandangan Malam Gunung Hakodate & Pasar Pagi Ikan',
    months: createClimate(-6, 1, 2, 11, 15, 23, 11, 19, 'Tinggi', 'Pemandangan malam spektakuler dengan tiupan angin laut dingin.')
  },
  {
    id: 'nagano',
    name: 'Nagano',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Monyet Salju Berendam Onsen & Pegunungan Alpen Jepang',
    months: createClimate(-7, 2, 2, 13, 16, 25, 10, 18, 'Tinggi', 'Jalur trekking salju ke onsen monyet, butuh sepatu grip kuat.')
  },
  {
    id: 'yuzawa',
    name: 'Echigo-Yuzawa',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Negeri Salju (Snow Country) & Resort Ski Shinkansen Langsung',
    months: createClimate(-5, 2, 3, 12, 18, 26, 12, 20, 'Tinggi', 'Hanya 75 menit dari Tokyo dengan Shinkansen, salju sangat melimpah.')
  },
  {
    id: 'kusatsu',
    name: 'Kusatsu Onsen',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800',
    popularHighlight: 'Yubatake Air Belerang Panas di Tengah Salju Gunung',
    months: createClimate(-8, -1, 0, 9, 13, 21, 7, 15, 'Tinggi', 'Mandi onsen air panas di tengah suhu minus berhawa segar.')
  },
  {
    id: 'nikko',
    name: 'Nikko (Tochigi)',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800',
    popularHighlight: 'Kuil Toshogu Bersalju, Danau Chuzenji & Air Terjun Kegon',
    months: createClimate(-5, 4, 3, 13, 15, 24, 10, 19, 'Sedang', 'Warisan spiritual Jepang dengan nuansa mistis di musim dingin.')
  },
  {
    id: 'kanazawa',
    name: 'Kanazawa',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Taman Kenrokuen dengan Tali Pelindung Salju (Yukizuri)',
    months: createClimate(1, 7, 5, 15, 17, 25, 13, 21, 'Tinggi', 'Salju basah khas pesisir laut Jepang, jaket waterproof sangat disarankan.')
  },
  {
    id: 'kobe',
    name: 'Kobe',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kobe Beef, Gunung Rokko Snow Park & Harborland',
    months: createClimate(3, 10, 8, 17, 19, 27, 16, 24, 'Rendah', 'Suhu kota sejuk namun puncak Gunung Rokko dingin bersalju.')
  },
  {
    id: 'hiroshima',
    name: 'Hiroshima & Miyajima',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Torii Terapung Kuil Itsukushima & Perdamaian Dunia',
    months: createClimate(2, 10, 7, 17, 18, 27, 15, 23, 'Rendah', 'Pemandangan pulau suci yang damai dan sejuk bersahabat.')
  },
  {
    id: 'fukuoka',
    name: 'Fukuoka (Kyushu)',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kuliner Yatai Tonkotsu Ramen & Dazaifu Tenmangu',
    months: createClimate(4, 11, 8, 18, 19, 27, 16, 24, 'Rendah', 'Musim dingin lebih ramah dibanding Honshu, coat medium sudah cukup.')
  },
  {
    id: 'sendai',
    name: 'Sendai & Matsushima',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Teluk Matsushima & Festival Cahaya Musim Dingin',
    months: createClimate(-2, 5, 4, 14, 16, 24, 12, 20, 'Sedang', 'Kota pepohonan di utara Jepang, butuh padding down jacket.')
  },
  {
    id: 'aomori',
    name: 'Aomori & Hakkoda',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Snow Monsters (Pohon Es Hakkoda) & Salju Tertebal di Dunia',
    months: createClimate(-9, -2, 1, 10, 14, 22, 10, 18, 'Tinggi', 'Wilayah dengan curah salju tertinggi di dunia, wajib perlengkapan ekstrem.')
  },
  {
    id: 'karuizawa',
    name: 'Karuizawa (Nagano)',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Belanja Outlet Mewah & Resort Ski Keluarga',
    months: createClimate(-8, 1, 1, 12, 13, 23, 7, 17, 'Sedang', 'Resort pegunungan favorit keluarga ekspatriat dan peseluncur es.')
  },
  {
    id: 'okinawa_winter',
    name: 'Okinawa',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Melihat Paus Bungkuk (Whale Watching) & Cherry Blossom Pertama',
    months: createClimate(14, 20, 18, 24, 24, 30, 22, 28, 'Nol', 'Tropis subtropis Jepang, cukup cardigan atau jaket ringan.')
  },

  // ==========================================
  // KOREA SELATAN (14 KOTA & RESORT)
  // ==========================================
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Myeongdong, Istana Gyeongbokgung, Hongdae & Namsan Tower',
    months: createClimate(-7, 2, 3, 14, 17, 26, 12, 21, 'Sedang', 'Angin dingin Siberia menusuk (windchill ekstrem), butuh Long Padding Down.')
  },
  {
    id: 'nami_island',
    name: 'Nami Island',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800',
    popularHighlight: 'Lorong Pohon Metasequoia Ikonis Winter Sonata',
    months: createClimate(-10, 1, 1, 13, 15, 25, 9, 19, 'Tinggi', 'Pulau di tengah sungai berhawa beku, wajib penutup telinga dan sarung tangan.')
  },
  {
    id: 'busan',
    name: 'Busan',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Desa Budaya Gamcheon, Pantai Haeundae & Jembatan Gwangan',
    months: createClimate(0, 8, 7, 16, 17, 24, 15, 23, 'Rendah', 'Kota pantai selatan lebih hangat dari Seoul, namun angin laut tetap tajam.')
  },
  {
    id: 'jeju',
    name: 'Jeju Island',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Gunung Hallasan Salju, Kebun Jeruk Hallabong & Seongsan Ilchulbong',
    months: createClimate(3, 9, 8, 16, 17, 24, 16, 23, 'Sedang', 'Puncak Gunung Hallasan tertutup salju tebal, angin pulau sangat kencang.')
  },
  {
    id: 'pyeongchang',
    name: 'Pyeongchang',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Tuan Rumah Olimpiade Musim Dingin & Wisata Peternakan Domba Salju',
    months: createClimate(-13, -2, -2, 8, 12, 21, 6, 15, 'Tinggi', 'Sangat dingin ekstrem di pegunungan timur Korea, wajib pakaian alpine.')
  },
  {
    id: 'vivaldi_park',
    name: 'Vivaldi Park',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Taman Bermain Kereta Luncur Salju (Sledding) Favorit Keluarga WNI',
    months: createClimate(-11, 0, 0, 11, 14, 23, 8, 18, 'Tinggi', 'Favorit turis Indonesia untuk main salju tanpa ski berat, wajib celana tahan air.')
  },
  {
    id: 'incheon',
    name: 'Incheon & Songdo',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Chinatown Incheon & Kota Masa Depan Pintar Songdo Central Park',
    months: createClimate(-5, 2, 4, 14, 16, 25, 13, 21, 'Sedang', 'Pintu gerbang Korea, angin pesisir barat terasa lebih dingin dari suhu tercatat.')
  },
  {
    id: 'gyeongju',
    name: 'Gyeongju',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800',
    popularHighlight: 'Makam Kuno Dinasti Silla & Kuil Bulguksa Bersejarah',
    months: createClimate(-3, 6, 5, 16, 16, 25, 13, 22, 'Rendah', 'Museum tanpa dinding dengan panorama makam bukit rumput berselimut salju.')
  },
  {
    id: 'daegu',
    name: 'Daegu',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Pasar Tradisional Seomun & Jalur Kereta Gantung Gunung Palgongsan',
    months: createClimate(-2, 6, 6, 17, 18, 27, 14, 23, 'Rendah', 'Lembah terlindung, udara sejuk dingin dengan kuliner pedas menghangatkan.')
  },
  {
    id: 'sokcho',
    name: 'Sokcho / Seoraksan',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Tebing Batu Gunung Seoraksan Bersalju & Kereta Gantung',
    months: createClimate(-6, 3, 2, 13, 15, 23, 12, 19, 'Tinggi', 'Pegunungan terindah di Korea, pemandangan salju tebing spektakuler.')
  },
  {
    id: 'suwon',
    name: 'Suwon',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Tembok Benteng Megah UNESCO & Suwon Galbi Bakar',
    months: createClimate(-6, 2, 3, 14, 16, 25, 12, 21, 'Sedang', 'Jalan kaki mengelilingi benteng di atas bukit, butuh mantel penahan angin.')
  },
  {
    id: 'jeonju',
    name: 'Jeonju Hanok Village',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800',
    popularHighlight: 'Sewa Baju Hanbok Tradisional di Desa Rumah Kayu Kuno',
    months: createClimate(-3, 5, 4, 16, 17, 26, 12, 22, 'Sedang', 'Foto memakai Hanbok musim dingin dengan jubah bulu tradisional istimewa.')
  },
  {
    id: 'yongpyong',
    name: 'Yongpyong Ski Resort',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1546726747-421c6d69c929?q=80&w=800',
    popularHighlight: 'Resort Ski Tertua dan Terbesar di Korea (Lokasi Syuting Goblin)',
    months: createClimate(-12, -1, -1, 9, 13, 22, 7, 16, 'Tinggi', 'Pegunungan Dragon Valley, suhu beku wajib sarung tangan tebal dan beanie.')
  },
  {
    id: 'chuncheon',
    name: 'Chuncheon',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800',
    popularHighlight: 'Mengayuh Sepeda Rel Kereta Melewati Terowongan Bersalju',
    months: createClimate(-9, 1, 1, 13, 15, 25, 10, 19, 'Tinggi', 'Aktivitas luar ruangan menyusuri sungai beku, wajib sarung tangan rapat.')
  },

  // ==========================================
  // TIONGKOK, HONG KONG, TAIWAN & ASIA LAINNYA (12 KOTA)
  // ==========================================
  {
    id: 'harbin',
    name: 'Harbin',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Festival Patung Es & Istana Kristal Terbesar di Dunia',
    months: createClimate(-24, -12, -7, 6, 13, 25, 6, 16, 'Tinggi', 'Suhu ekstrem minus 30 derajat! Wajib Down Jacket 800FP, boots wol tebal & thermal pack.')
  },
  {
    id: 'beijing',
    name: 'Beijing',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800',
    popularHighlight: 'Tembok Besar Tiongkok (Great Wall) Berselimut Salju & Forbidden City',
    months: createClimate(-8, 2, 4, 16, 18, 28, 12, 21, 'Sedang', 'Angin kencang di atas Tembok Besar sangat dingin, wajib syal & kupluk tebal.')
  },
  {
    id: 'shanghai',
    name: 'Shanghai',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=800',
    popularHighlight: 'The Bund, Menara Oriental Pearl & Disney Resort Shanghai',
    months: createClimate(2, 9, 8, 16, 20, 27, 17, 24, 'Rendah', 'Dingin lembab menusuk tulang karena dekat muara sungai Yangtze.')
  },
  {
    id: 'taipei',
    name: 'Taipei & Jiufen',
    country: 'Taiwan',
    region: 'Tiongkok & Asia Timur',
    flag: '🇹🇼',
    imageUrl: 'https://images.unsplash.com/photo-1508247967583-7d982ea01526?q=80&w=800',
    popularHighlight: 'Pasar Malam Shilin, Taipei 101 & Desa Lentera Jiufen',
    months: createClimate(13, 19, 17, 24, 23, 30, 21, 27, 'Nol', 'Musim dingin sejuk gerimis, jaket anti-air ringan atau trench coat sangat cocok.')
  },
  {
    id: 'hehuanshan',
    name: 'Hehuanshan',
    country: 'Taiwan',
    region: 'Tiongkok & Asia Timur',
    flag: '🇹🇼',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Melihat Salju Langka di Ketinggian 3.000 mdpl Taiwan',
    months: createClimate(-2, 6, 3, 12, 9, 17, 6, 14, 'Sedang', 'Titik tertinggi jalan raya Taiwan, suhu bisa drop di bawah titik beku.')
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    country: 'Hong Kong',
    region: 'Tiongkok & Asia Timur',
    flag: '🇭🇰',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Victoria Peak, Disneyland HK & Belanja Tsim Sha Tsui',
    months: createClimate(14, 20, 18, 24, 25, 30, 23, 28, 'Nol', 'Musim dingin sejuk favorit belanja, jaket stylish medium tanpa perlu parka tebal.')
  },
  {
    id: 'macau',
    name: 'Macau',
    country: 'Macau',
    region: 'Tiongkok & Asia Timur',
    flag: '🇲🇴',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Reruntuhan Katedral St. Paul & Gemerlap Venetian Macau',
    months: createClimate(13, 19, 18, 23, 25, 30, 23, 28, 'Nol', 'Arsitektur kolonial Portugis dalam balutan cuaca sejuk kering bersahabat.')
  },
  {
    id: 'huangshan',
    name: 'Huangshan',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Pohon Pinus Es Kuno & Lautan Awan Putih Spektakuler',
    months: createClimate(-6, 1, 3, 12, 14, 21, 9, 17, 'Tinggi', 'Pegunungan batu legendaris lukisan klasik Tiongkok berbalut kristal es.')
  },
  {
    id: 'zhangjiajie',
    name: 'Zhangjiajie',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Pilar Batu Melayang Avatar & Jembatan Kaca Ketinggian Ekstrem',
    months: createClimate(1, 9, 9, 18, 19, 27, 14, 22, 'Sedang', 'Kabut mistis dan salju tipis di atas pilar batu pasir raksasa.')
  },
  {
    id: 'lijiang',
    name: 'Lijiang',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kota Kuno Naxi & Puncak Gunung Salju Naga Giok 4.500 mdpl',
    months: createClimate(-3, 14, 6, 19, 12, 23, 8, 18, 'Tinggi', 'Ketinggian tinggi dataran Yunnan, radiasi UV kuat namun angin es menusuk.')
  },
  {
    id: 'ulaanbaatar',
    name: 'Ulaanbaatar',
    country: 'Mongolia',
    region: 'Tiongkok & Asia Timur',
    flag: '🇲🇳',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Ibukota Terdingin di Dunia & Menginap di Tenda Yurt Tradisional Ger',
    months: createClimate(-26, -15, -10, 4, 10, 23, 1, 14, 'Tinggi', 'Pengalaman iklim stepa beku terdingin di dunia, butuh perlengkapan wol maksimal.')
  },
  {
    id: 'almaty',
    name: 'Almaty',
    country: 'Kazakhstan',
    region: 'Tiongkok & Asia Timur',
    flag: '🇰🇿',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Pegunungan Tian Shan Salju Abadi & Danau Almaty yang Membeku',
    months: createClimate(-10, 0, 1, 13, 13, 24, 7, 18, 'Tinggi', 'Destinasi bebas visa favorit WNI yang mencari salju pegunungan megah Asia Tengah.')
  },

  // ==========================================
  // TURKI & TIMUR TENGAH DINGIN (6 KOTA)
  // ==========================================
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
    popularHighlight: 'Hagia Sophia, Masjid Biru, Selat Bosphorus & Grand Bazaar',
    months: createClimate(3, 9, 7, 15, 16, 25, 14, 20, 'Sedang', 'Salju sering turun menutupi kubah masjid bersejarah, angin selat sangat dingin.')
  },
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1609137144822-3786802112e4?q=80&w=800',
    popularHighlight: 'Balon Udara di Atas Lembah Batu Peri (Fairy Chimneys) Bersalju',
    months: createClimate(-7, 3, 0, 12, 9, 23, 5, 18, 'Tinggi', 'Suhu sub-zero pagi hari saat terbang balon udara, wajib jaket tebal berlapis.')
  },
  {
    id: 'uludag',
    name: 'Uludag (Bursa)',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1546726747-421c6d69c929?q=80&w=800',
    popularHighlight: 'Gunung Ski Terpopuler Turki & Kereta Gantung Terpanjang Teleferik',
    months: createClimate(-6, 1, 0, 10, 8, 18, 4, 14, 'Tinggi', 'Pusat olahraga musim dingin Turki, salju tebal dan pemandangan hutan pinus putih.')
  },
  {
    id: 'erzurum',
    name: 'Erzurum (Palandoken)',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Lereng Ski Terpanjang di Eropa Timur & Salju Kering Berkualitas Tinggi',
    months: createClimate(-15, -4, -6, 6, 6, 19, 2, 14, 'Tinggi', 'Dataran tinggi Anatolia Timur dengan suhu musim dingin sangat menusuk.')
  },
  {
    id: 'pamukkale',
    name: 'Pamukkale',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Teras Kalsium Putih Air Panas Mineral Alami Cotton Castle',
    months: createClimate(2, 10, 6, 18, 15, 29, 12, 22, 'Rendah', 'Kontras air hangat mineral alami dengan udara dingin segar musim dingin.')
  },
  {
    id: 'trabzon',
    name: 'Trabzon',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Biara Kuno di Tebing Karang Laut Hitam & Danau Uzungol',
    months: createClimate(4, 11, 7, 14, 18, 25, 14, 20, 'Sedang', 'Kawasan pesisir Laut Hitam dengan bukit pinus hijau berbalut salju tebal.')
  },

  // ==========================================
  // EROPA BARAT & ALPEN (20 KOTA)
  // ==========================================
  {
    id: 'zermatt',
    name: 'Zermatt (Matterhorn)',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800',
    popularHighlight: 'Puncak Piramida Es Matterhorn & Desa Tanpa Mobil Bebas Polusi',
    months: createClimate(-12, -3, -4, 5, 5, 16, 2, 11, 'Tinggi', 'Alpen beku spektakuler, wajib spesifikasi salju ekstrem & kacamata hitam salju.')
  },
  {
    id: 'interlaken',
    name: 'Interlaken',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800',
    popularHighlight: 'Puncak Tertinggi Stasiun Kereta Eropa (Top of Europe) 3.454 mdpl',
    months: createClimate(-5, 4, 3, 14, 11, 22, 7, 16, 'Tinggi', 'Di Jungfraujoch suhu konstan beku minus 10 s/d minus 20 derajat sepanjang tahun.')
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Danau Zurich, Kota Tua Altstadt & Pasar Natal Bahnhofstrasse',
    months: createClimate(-2, 4, 4, 14, 12, 23, 8, 16, 'Sedang', 'Kota elegan tepi danau, butuh coat wol berkelas atau down jacket hangat.')
  },
  {
    id: 'lucerne',
    name: 'Lucerne (Titlis)',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800',
    popularHighlight: 'Jembatan Kayu Chapel Bridge & Kereta Gantung Rotair Gunung Titlis',
    months: createClimate(-3, 5, 3, 15, 11, 23, 7, 16, 'Sedang', 'Puncak Titlis bersalju abadi dengan Cliff Walk jembatan gantung tertinggi Eropa.')
  },
  {
    id: 'geneva',
    name: 'Geneva (Jenewa)',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Air Mancur Jet d’Eau & Danau Jenewa Berlatar Pegunungan Alpen',
    months: createClimate(-1, 5, 4, 15, 11, 23, 8, 16, 'Rendah', 'Pusat diplomatik dunia yang tertib dengan pemandangan Mont Blanc di kejauhan.')
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    popularHighlight: 'Menara Eiffel Lampu Malam, Museum Louvre & Champs-Elysees',
    months: createClimate(2, 7, 6, 16, 12, 23, 10, 17, 'Rendah', 'Dingin berangin romantis, jaket stylish trench atau wool long coat sangat diminati.')
  },
  {
    id: 'chamonix',
    name: 'Chamonix-Mont-Blanc',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Atap Pegunungan Alpen Mont Blanc & Kereta Gantung Aiguille du Midi',
    months: createClimate(-9, 1, 0, 11, 8, 19, 4, 13, 'Tinggi', 'Surga olahraga musim dingin ekstrem dengan gletser salju terbesar di Prancis.')
  },
  {
    id: 'london',
    name: 'London',
    country: 'Inggris',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    popularHighlight: 'Winter Wonderland Hyde Park, Big Ben & Oxford Street Lights',
    months: createClimate(2, 8, 6, 14, 11, 21, 10, 16, 'Rendah', 'Gerimis dingin lembab khas Inggris, mantel waterproof windbreaker sangat krusial.')
  },
  {
    id: 'edinburgh',
    name: 'Edinburgh',
    country: 'Inggris',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kastil Edinburgh Abad Pertengahan & Hogmanay Festival Tahun Baru',
    months: createClimate(1, 6, 4, 11, 9, 17, 8, 13, 'Sedang', 'Angin kencang utara yang sangat dingin, butuh syal kasmir dan jaket tebal tahan angin.')
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Belanda',
    region: 'Eropa Barat & Alpen',
    flag: '🇳🇱',
    imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=800',
    popularHighlight: 'Kanal Bersejarah Membeku, Museum Van Gogh & Festival Lampu Cahaya',
    months: createClimate(1, 6, 4, 14, 11, 20, 9, 15, 'Rendah', 'Angin laut Belanda menusuk terutama saat bersepeda atau menyusuri kanal.')
  },
  {
    id: 'brussels',
    name: 'Brussels & Brugge',
    country: 'Belgia',
    region: 'Eropa Barat & Alpen',
    flag: '🇧🇪',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Grand Place Cahaya Natal, Wafel Hangat & Kota Dongeng Brugge',
    months: createClimate(1, 6, 5, 14, 11, 21, 9, 16, 'Rendah', 'Menikmati cokelat hangat Belgia di tengah jalanan batu kuno yang sejuk menusuk.')
  },
  {
    id: 'munich',
    name: 'Munich (Bavaria)',
    country: 'Jerman',
    region: 'Eropa Barat & Alpen',
    flag: '🇩🇪',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=800',
    popularHighlight: 'Kastil Neuschwanstein (Kastil Cinderella) & Marienplatz Pasar Natal',
    months: createClimate(-4, 3, 3, 14, 10, 22, 7, 15, 'Tinggi', 'Kastil dongeng bersalju putih menakjubkan, wajib pakaian hangat penuh.')
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    country: 'Jerman',
    region: 'Eropa Barat & Alpen',
    flag: '🇩🇪',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Alun-alun Kuno Romerberg & Pasar Natal Tertua di Jerman',
    months: createClimate(-1, 5, 4, 15, 12, 23, 9, 16, 'Sedang', 'Pusat transit utama penerbangan dari Jakarta ke Eropa.')
  },
  {
    id: 'vienna',
    name: 'Vienna (Wina)',
    country: 'Austria',
    region: 'Eropa Barat & Alpen',
    flag: '🇦🇹',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Istana Schonbrunn, Konser Musik Klasik Mozart & Ice Skating Balai Kota',
    months: createClimate(-2, 4, 4, 15, 13, 24, 9, 16, 'Sedang', 'Kota musik klasik yang sangat megah dan romantis saat salju turun perlahan.')
  },
  {
    id: 'hallstatt',
    name: 'Hallstatt',
    country: 'Austria',
    region: 'Eropa Barat & Alpen',
    flag: '🇦🇹',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=800',
    popularHighlight: 'Desa Danau Terindah di Dunia (Inspirasi Negeri Arendelle Frozen)',
    months: createClimate(-6, 2, 2, 13, 10, 22, 6, 15, 'Tinggi', 'Pemandangan rumah kayu berselimut salju di tepi danau cermin yang tenang.')
  },
  {
    id: 'salzburg',
    name: 'Salzburg',
    country: 'Austria',
    region: 'Eropa Barat & Alpen',
    flag: '🇦🇹',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Benteng Hohensalzburg & Kota Asal The Sound of Music',
    months: createClimate(-4, 3, 2, 14, 10, 22, 6, 15, 'Tinggi', 'Berada di kaki Alpen Austria dengan arsitektur barok berlapis salju tebal.')
  },
  {
    id: 'innsbruck',
    name: 'Innsbruck (Tirol)',
    country: 'Austria',
    region: 'Eropa Barat & Alpen',
    flag: '🇦🇹',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Ibukota Pegunungan Alpen Tirol & Atap Emas Goldenes Dachl',
    months: createClimate(-6, 2, 2, 14, 10, 22, 6, 15, 'Tinggi', 'Dikelilingi tebing salju vertikal yang tampak menjulang dari ujung jalan kota.')
  },
  {
    id: 'milan',
    name: 'Milan (Milano)',
    country: 'Italia',
    region: 'Eropa Barat & Alpen',
    flag: '🇮🇹',
    imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Katedral Duomo Megah, Galleria Vittorio Emanuele & Kota Mode Dunia',
    months: createClimate(0, 7, 7, 17, 16, 27, 12, 19, 'Rendah', 'Ibukota mode dunia, penampilan stylish dengan mantel hangat sangat diapresiasi.')
  },
  {
    id: 'venice',
    name: 'Venice (Venesia)',
    country: 'Italia',
    region: 'Eropa Barat & Alpen',
    flag: '🇮🇹',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Karnaval Topeng Venesia & Gondola Menyusuri Kanal Tenang',
    months: createClimate(1, 7, 7, 15, 16, 26, 12, 19, 'Rendah', 'Kabut pagi di atas air kanal menciptakan suasana tenang misterius yang indah.')
  },
  {
    id: 'rome',
    name: 'Rome (Roma)',
    country: 'Italia',
    region: 'Eropa Barat & Alpen',
    flag: '🇮🇹',
    imageUrl: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Colosseum Kuno, Vatikan & Air Mancur Trevi Fountain',
    months: createClimate(4, 13, 8, 17, 16, 26, 14, 22, 'Nol', 'Musim dingin Mediterania yang lebih bersahabat, cukup jaket mid-to-outer.')
  },

  // ==========================================
  // EROPA UTARA & NORDIK / AURORA (12 KOTA)
  // ==========================================
  {
    id: 'rovaniemi',
    name: 'Rovaniemi (Lapland)',
    country: 'Finlandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇫🇮',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800',
    popularHighlight: 'Desa Resmi Santa Claus, Kereta Rusa Kutub & Lingkar Arktik',
    months: createClimate(-17, -8, -10, 1, 9, 19, 3, 10, 'Tinggi', 'Kawasan Arktik dingin ekstrem, wajib jaket ekspedisi kutub, thermal socks & balaclava.')
  },
  {
    id: 'tromso',
    name: 'Tromso',
    country: 'Norwegia',
    region: 'Eropa Utara & Nordik',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=800',
    popularHighlight: 'Ibukota Cahaya Aurora Borealis & Safari Paus Bungkuk Laut Arktik',
    months: createClimate(-6, -1, -3, 3, 5, 13, 4, 9, 'Tinggi', 'Titik terbaik di bumi berburu tarian Aurora hijau di langit malam kutub.')
  },
  {
    id: 'oslo',
    name: 'Oslo',
    country: 'Norwegia',
    region: 'Eropa Utara & Nordik',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Museum Kapal Viking, Opera House Oslo & Lompat Ski Holmenkollen',
    months: createClimate(-7, -1, -1, 9, 8, 19, 5, 13, 'Tinggi', 'Kota arsitektur modern Nordik dengan hutan salju luas tepat di perbatasan kota.')
  },
  {
    id: 'lofoten',
    name: 'Lofoten Islands',
    country: 'Norwegia',
    region: 'Eropa Utara & Nordik',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Rumah Nelayan Merah Rorbuer di Bawah Tebing Karang Es Terjal',
    months: createClimate(-2, 2, 0, 5, 9, 14, 7, 11, 'Sedang', 'Kepulauan paling dramatis di dunia dengan kombinasi laut beku dan pegunungan tajam.')
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    country: 'Finlandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇫🇮',
    imageUrl: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Katedral Putih Helsinki & Sauna Tradisional Kayu Tepi Laut Beku',
    months: createClimate(-8, -2, -3, 7, 7, 18, 5, 12, 'Tinggi', 'Laut Baltik sering membeku menjadi lapisan es padat di puncak musim dingin.')
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    country: 'Swedia',
    region: 'Eropa Utara & Nordik',
    flag: '🇸🇪',
    imageUrl: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kota Tua Gamla Stan, Museum Vasa & Kepulauan Skandinavia',
    months: createClimate(-5, 0, 0, 10, 8, 20, 6, 13, 'Sedang', 'Ibukota Skandinavia yang elegan membentang di atas 14 pulau yang saling terhubung.')
  },
  {
    id: 'kiruna_abisko',
    name: 'Kiruna & Abisko',
    country: 'Swedia',
    region: 'Eropa Utara & Nordik',
    flag: '🇸🇪',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Hotel Es Asli Pertama di Dunia (ICEHOTEL) & Langit Bebas Awan Abisko',
    months: createClimate(-20, -10, -11, 0, 4, 16, 0, 8, 'Tinggi', 'Tidur di kamar es berukir tangan pada suhu minus 5 derajat di dalam Icehotel.')
  },
  {
    id: 'reykjavik',
    name: 'Reykjavik',
    country: 'Islandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇮🇸',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=800',
    popularHighlight: 'Pemandian Air Panas Blue Lagoon, Geysir & Air Terjun Gullfoss',
    months: createClimate(-3, 2, -1, 5, 6, 12, 4, 9, 'Sedang', 'Angin Islandia sangat kencang dan tidak tertebak, wajib jaket windproof 100%.')
  },
  {
    id: 'south_coast_iceland',
    name: 'South Coast / Vík',
    country: 'Islandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇮🇸',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Pantai Pasir Hitam Reynisfjara & Gua Es Kristal Gletser Katla',
    months: createClimate(-2, 3, 0, 6, 7, 13, 5, 10, 'Sedang', 'Masuk ke dalam gua es biru kristal alami di bawah gletser raksasa.')
  },
  {
    id: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    region: 'Eropa Utara & Nordik',
    flag: '🇩🇰',
    imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kanal Warna-warni Nyhavn, Taman Hiburan Tivoli & Filosofi Hygge',
    months: createClimate(-1, 3, 2, 11, 9, 18, 7, 13, 'Sedang', 'Merayakan kehangatan kebersamaan "Hygge" di kafe-kafe lilin yang hangat.')
  },
  {
    id: 'tallinn',
    name: 'Tallinn',
    country: 'Estonia',
    region: 'Eropa Utara & Nordik',
    flag: '🇪🇪',
    imageUrl: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kota Tua Abad Pertengahan Terawat Terbaik di Seluruh Eropa',
    months: createClimate(-7, -1, -2, 7, 7, 18, 5, 11, 'Tinggi', 'Dinding benteng batu dan menara kastil runcing berselimut salju dongeng.')
  },
  {
    id: 'bergen',
    name: 'Bergen',
    country: 'Norwegia',
    region: 'Eropa Utara & Nordik',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Dermaga Kayu Warisan UNESCO Bryggen & Gerbang Menuju Fjord',
    months: createClimate(0, 4, 3, 10, 8, 17, 7, 12, 'Sedang', 'Kota cantik dikelilingi 7 gunung dengan curah hujan/salju tinggi; jaket waterproof wajib.')
  },

  // ==========================================
  // EROPA TIMUR, TENGAH & SELATAN (10 KOTA)
  // ==========================================
  {
    id: 'prague',
    name: 'Prague (Praha)',
    country: 'Ceko',
    region: 'Eropa Timur & Tengah',
    flag: '🇨🇿',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Jembatan Charles Bridge Bersalju, Jam Astronomi & Kastil Praha',
    months: createClimate(-3, 2, 2, 13, 9, 21, 7, 14, 'Sedang', 'Kota seratus menara dengan pemandangan atap genteng merah tertutup salju tipis.')
  },
  {
    id: 'budapest',
    name: 'Budapest',
    country: 'Hongaria',
    region: 'Eropa Timur & Tengah',
    flag: '🇭🇺',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20b?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Gedung Parlemen Megah Sungai Danube & Pemandian Air Panas Szechenyi',
    months: createClimate(-3, 3, 3, 15, 11, 24, 8, 16, 'Sedang', 'Sensasi luar biasa berendam air panas belerang di kolam luar ruangan saat salju turun.')
  },
  {
    id: 'krakow',
    name: 'Krakow',
    country: 'Polandia',
    region: 'Eropa Timur & Tengah',
    flag: '🇵🇱',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Alun-Alun Utama Pasar Kain Rynek Glowny & Tambang Garam Wieliczka',
    months: createClimate(-5, 2, 1, 13, 9, 21, 6, 14, 'Tinggi', 'Alun-alun abad pertengahan terbesar di Eropa berbalut lampu hias dan aroma kayu bakar.')
  },
  {
    id: 'warsaw',
    name: 'Warsaw (Warsawa)',
    country: 'Polandia',
    region: 'Eropa Timur & Tengah',
    flag: '🇵🇱',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kota Tua Rekonstruksi Sempurna & Istana Kebudayaan dan Sains',
    months: createClimate(-5, 1, 1, 13, 9, 22, 6, 13, 'Tinggi', 'Musim dingin kontinental khas Eropa Timur dengan suhu beku berangin.')
  },
  {
    id: 'bled',
    name: 'Lake Bled',
    country: 'Slovenia',
    region: 'Eropa Timur & Tengah',
    flag: '🇸🇮',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Gereja di Pulau Tengah Danau Alami Dikelilingi Pegunungan Salju',
    months: createClimate(-4, 3, 2, 14, 9, 22, 6, 15, 'Tinggi', 'Danau dongeng yang memukau saat air membeku dan kabut tipis menyelimuti kastil.')
  },
  {
    id: 'zagreb',
    name: 'Zagreb',
    country: 'Kroasia',
    region: 'Eropa Timur & Tengah',
    flag: '🇭🇷',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Air Terjun Plitvice yang Membeku Menjadi Pilar Es Raksasa',
    months: createClimate(-2, 4, 3, 15, 11, 23, 7, 16, 'Sedang', 'Taman Nasional Danau Plitvice berubah menjadi kerajaan es beku spektakuler.')
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Spanyol',
    region: 'Eropa Timur & Tengah',
    flag: '🇪🇸',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Istana Kerajaan Palacio Real, Museum Prado & Churros Cokelat Hangat',
    months: createClimate(3, 10, 7, 17, 14, 28, 11, 19, 'Rendah', 'Dataran tinggi tengah Spanyol, malam hari terasa sangat dingin dan kering.')
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spanyol',
    region: 'Eropa Timur & Tengah',
    flag: '🇪🇸',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Karya Agung Gaudi Sagrada Familia, Park Guell & Pantai Barceloneta',
    months: createClimate(8, 14, 11, 18, 17, 26, 15, 22, 'Nol', 'Sangat ramah bagi yang tidak kuat suhu beku, cukup mantel medium atau jaket kulit.')
  },
  {
    id: 'granada',
    name: 'Granada',
    country: 'Spanyol',
    region: 'Eropa Timur & Tengah',
    flag: '🇪🇸',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Istana Megah Alhambra dengan Latar Belakang Puncak Salju Sierra Nevada',
    months: createClimate(2, 12, 6, 18, 12, 28, 9, 20, 'Sedang', 'Kota warisan Islam yang hangat, namun 30 menit ke gunung terdapat resort ski salju.')
  },
  {
    id: 'lisbon',
    name: 'Lisbon (Lisboa)',
    country: 'Portugal',
    region: 'Eropa Timur & Tengah',
    flag: '🇵🇹',
    imageUrl: 'https://images.unsplash.com/photo-1508248017024-13d8bc59f711?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Trem Kuning Bersejarah No 28, Menara Belem & Kue Pastel de Nata',
    months: createClimate(8, 15, 11, 19, 14, 25, 15, 22, 'Nol', 'Musim dingin paling hangat di daratan Eropa, sejuk nyaman tanpa salju.')
  },

  // ==========================================
  // AMERIKA UTARA (8 KOTA & RESORT)
  // ==========================================
  {
    id: 'new_york',
    name: 'New York City',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800',
    popularHighlight: 'Pohon Natal Raksasa Rockefeller Center, Central Park & Times Square',
    months: createClimate(-3, 4, 3, 14, 13, 25, 10, 18, 'Sedang', 'Lorong pencakar langit Manhattan menciptakan lorong angin es kencang.')
  },
  {
    id: 'banff',
    name: 'Banff & Lake Louise',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800',
    popularHighlight: 'Danau Louise yang Membeku Jadi Lapangan Ice Skating Alami Berlatar Gletser',
    months: createClimate(-15, -5, -8, 5, 3, 19, 0, 10, 'Tinggi', 'Pegunungan Rocky Kanada yang megah, butuh jaket tebal berbulu angsa asli.')
  },
  {
    id: 'vancouver',
    name: 'Vancouver & Whistler',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Jembatan Gantung Capilano & Resort Ski No. 1 Amerika Utara Whistler',
    months: createClimate(1, 7, 5, 13, 11, 20, 8, 14, 'Sedang', 'Kota hujan sejuk sedangkan Whistler Blackcomb memiliki salju bubuk luar biasa.')
  },
  {
    id: 'toronto',
    name: 'Toronto / Niagara',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Air Terjun Niagara Membeku & Menara CN Tower',
    months: createClimate(-7, 0, 0, 11, 10, 24, 7, 15, 'Tinggi', 'Kabut es Niagara menciptakan formasi patung es alami raksasa.')
  },
  {
    id: 'montreal',
    name: 'Montreal',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Kastil Fairmont Le Chateau Frontenac & Kota Tua Prancis Bersejarah',
    months: createClimate(-13, -4, -4, 9, 8, 23, 4, 12, 'Tinggi', 'Suasana Eropa klasik di benua Amerika, wajib pakaian termal berkualitas tinggi.')
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Patung The Bean Bersalju & Pemandangan Danau Michigan Membeku',
    months: createClimate(-8, 0, 0, 13, 11, 26, 8, 16, 'Tinggi', 'Dijuluki "The Windy City", hembusan angin beku dari Danau Michigan sangat menusuk.')
  },
  {
    id: 'aspen',
    name: 'Aspen (Colorado)',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Resort Ski Termewah Kaum Selebriti Dunia di Pegunungan Rocky',
    months: createClimate(-13, 0, -4, 8, 3, 19, 0, 13, 'Tinggi', 'Kawasan elit musim dingin dengan salju bubuk champagne powder terkenal.')
  },
  {
    id: 'lake_tahoe',
    name: 'Lake Tahoe',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800',
    popularHighlight: 'Danau Biru Alpine Jernih Dikelilingi Pegunungan Salju Sierra Nevada',
    months: createClimate(-7, 4, -2, 10, 4, 21, 2, 15, 'Tinggi', 'Hanya 3,5 jam dari San Francisco, destinasi ski favorit wisatawan pantai barat AS.')
  },

  // ==========================================
  // BELAHAN BUMI SELATAN / WINTER JUNI-AGUSTUS (6 KOTA)
  // ==========================================
  {
    id: 'queenstown',
    name: 'Queenstown',
    country: 'Selandia Baru',
    region: 'Selandia Baru & Australia',
    flag: '🇳🇿',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800',
    popularHighlight: 'Ibukota Petualangan Dunia, Danau Wakatipu & Pegunungan The Remarkables',
    months: {
      6: {
        min: -1,
        max: 8,
        label: 'Awal Musim Dingin (Winter Season)',
        condition: 'Salju menyelimuti puncak The Remarkables',
        snowLikelihood: 'Tinggi',
        feelsLikeOffset: -4,
        description: 'Resor ski Coronet Peak & Remarkables dibuka untuk umum.'
      },
      7: {
        min: -3,
        max: 6,
        label: 'Puncak Musim Dingin Salju',
        condition: 'Suhu beku pagi hari, salju tebal',
        snowLikelihood: 'Tinggi',
        feelsLikeOffset: -4,
        description: 'Waktu terbaik liburan musim dingin saat Indonesia libur sekolah Juni-Juli!'
      },
      8: {
        min: -2,
        max: 8,
        label: 'Musim Dingin Akhir',
        condition: 'Pemandangan puncak salju spektakuler',
        snowLikelihood: 'Sedang',
        feelsLikeOffset: -3,
        description: 'Salju masih sangat prima untuk aktivitas ski dan foto OOTD.'
      },
      9: {
        min: 2,
        max: 13,
        label: 'Awal Musim Semi',
        condition: 'Sejuk segar berangin',
        snowLikelihood: 'Rendah',
        feelsLikeOffset: -1,
        description: 'Bunga mulai bermekaran di tepi danau.'
      },
      10: { min: 4, max: 15, label: 'Musim Semi', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Sejuk dan nyaman.' },
      11: { min: 7, max: 18, label: 'Musim Semi Akhir', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hari semakin panjang.' },
      12: { min: 9, max: 21, label: 'Musim Panas', condition: 'Cerah', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim panas Selandia Baru.' },
      1: { min: 10, max: 22, label: 'Puncak Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Cerah hangat.' },
      2: { min: 9, max: 21, label: 'Musim Panas Akhir', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Udara bersahabat.' },
      3: { min: 7, max: 18, label: 'Awal Musim Gugur', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Warna musim gugur.' },
      4: { min: 4, max: 14, label: 'Puncak Musim Gugur Emas', condition: 'Sejuk dingin', snowLikelihood: 'Rendah', feelsLikeOffset: -1, description: 'Pohon poplar kuning emas memukau.' },
      5: { min: 1, max: 11, label: 'Pra-Musim Dingin', condition: 'Dingin menusuk', snowLikelihood: 'Sedang', feelsLikeOffset: -2, description: 'Embun beku mulai muncul.' }
    }
  },
  {
    id: 'lake_tekapo',
    name: 'Lake Tekapo',
    country: 'Selandia Baru',
    region: 'Selandia Baru & Australia',
    flag: '🇳🇿',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800',
    popularHighlight: 'Gereja Batu Church of the Good Shepherd & Puncak Aoraki Mt. Cook',
    months: {
      6: { min: -2, max: 7, label: 'Musim Dingin Arktik Selatan', condition: 'Salju danau', snowLikelihood: 'Tinggi', feelsLikeOffset: -4, description: 'Langit malam bebas polusi cahaya berbintang galaksi Bima Sakti.' },
      7: { min: -4, max: 5, label: 'Puncak Dingin Ekstrem', condition: 'Beku total', snowLikelihood: 'Tinggi', feelsLikeOffset: -5, description: 'Suhu drop di bawah nol, danau biru toska berbingkai salju putih murni.' },
      8: { min: -3, max: 7, label: 'Musim Dingin', condition: 'Salju pegunungan', snowLikelihood: 'Tinggi', feelsLikeOffset: -4, description: 'Pemandangan puncak tertinggi Selandia Baru.' },
      9: { min: 0, max: 11, label: 'Musim Semi Dingin', condition: 'Sejuk', snowLikelihood: 'Sedang', feelsLikeOffset: -2, description: 'Transisi sejuk.' },
      10: { min: 2, max: 14, label: 'Musim Semi', condition: 'Sejuk', snowLikelihood: 'Rendah', feelsLikeOffset: 0, description: 'Bunga lupin mulai tumbuh.' },
      11: { min: 5, max: 17, label: 'Bunga Lupin Mekar', condition: 'Nyaman', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hamparan bunga ungu merah muda.' },
      12: { min: 8, max: 20, label: 'Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim panas cerah.' },
      1: { min: 9, max: 22, label: 'Puncak Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Suhu hangat.' },
      2: { min: 8, max: 21, label: 'Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hari cerah.' },
      3: { min: 6, max: 18, label: 'Musim Gugur', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim gugur tenang.' },
      4: { min: 2, max: 14, label: 'Musim Gugur Dingin', condition: 'Dingin', snowLikelihood: 'Rendah', feelsLikeOffset: -1, description: 'Suhu malam dingin.' },
      5: { min: 0, max: 10, label: 'Awal Musim Dingin', condition: 'Beku', snowLikelihood: 'Sedang', feelsLikeOffset: -3, description: 'Salju pertama gunung.' }
    }
  },
  {
    id: 'wanaka',
    name: 'Wanaka',
    country: 'Selandia Baru',
    region: 'Selandia Baru & Australia',
    flag: '🇳🇿',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800',
    popularHighlight: 'Pohon Kesepian Ikonis #ThatWanakaTree & Cardrona Alpine Resort',
    months: {
      6: { min: -1, max: 8, label: 'Musim Dingin', condition: 'Salju', snowLikelihood: 'Tinggi', feelsLikeOffset: -4, description: 'Pusat ski Cardrona & Treble Cone beroperasi penuh.' },
      7: { min: -3, max: 6, label: 'Puncak Musim Dingin', condition: 'Salju lebat', snowLikelihood: 'Tinggi', feelsLikeOffset: -4, description: 'Salju bubuk berkualitas tinggi di pegunungan Cardrona.' },
      8: { min: -2, max: 8, label: 'Musim Dingin', condition: 'Salju', snowLikelihood: 'Sedang', feelsLikeOffset: -3, description: 'Bermain salju sambil menikmati pemandangan danau jernih.' },
      9: { min: 2, max: 12, label: 'Musim Semi', condition: 'Sejuk', snowLikelihood: 'Rendah', feelsLikeOffset: -1, description: 'Udara segar pegunungan.' },
      10: { min: 4, max: 15, label: 'Musim Semi', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Bunga bermekaran.' },
      11: { min: 7, max: 18, label: 'Musim Semi', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hangat nyaman.' },
      12: { min: 9, max: 21, label: 'Musim Panas', condition: 'Cerah', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim panas santai.' },
      1: { min: 10, max: 22, label: 'Musim Panas', condition: 'Cerah', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Puncak musim panas.' },
      2: { min: 9, max: 21, label: 'Musim Panas', condition: 'Cerah', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hangat cerah.' },
      3: { min: 7, max: 18, label: 'Musim Gugur', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Pemandangan dedaunan emas.' },
      4: { min: 4, max: 14, label: 'Musim Gugur', condition: 'Sejuk dingin', snowLikelihood: 'Rendah', feelsLikeOffset: -1, description: 'Transisi musim dingin.' },
      5: { min: 1, max: 10, label: 'Pra Musim Dingin', condition: 'Dingin', snowLikelihood: 'Sedang', feelsLikeOffset: -2, description: 'Udara beku malam.' }
    }
  },
  {
    id: 'melbourne_snow',
    name: 'Melbourne (Mt Buller)',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Great Ocean Road & Day Trip Main Salju ke Gunung Mt. Buller',
    months: {
      6: { min: 8, max: 14, label: 'Awal Musim Dingin (Mt Buller -2°C)', condition: 'Hujan sejuk kota, salju di gunung', snowLikelihood: 'Sedang', feelsLikeOffset: -2, description: 'Kota Melbourne sejuk dingin, resor ski Mt. Buller 3 jam dari kota tertutup salju.' },
      7: { min: 7, max: 13, label: 'Puncak Musim Dingin (Mt Buller -3°C)', condition: 'Dingin berangin, salju gunung tebal', snowLikelihood: 'Tinggi', feelsLikeOffset: -3, description: 'Waktu utama main salju ski bagi wisatawan Indonesia saat liburan Juli.' },
      8: { min: 7, max: 15, label: 'Musim Dingin Akhir', condition: 'Sejuk berangin', snowLikelihood: 'Sedang', feelsLikeOffset: -2, description: 'Kafe kopi hangat Melbourne & aktivitas salju Mt. Buller.' },
      9: { min: 9, max: 17, label: 'Musim Semi', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Mulai hangat.' },
      10: { min: 11, max: 20, label: 'Musim Semi', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Cuaca nyaman.' },
      11: { min: 13, max: 22, label: 'Musim Semi Akhir', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim semi hangat.' },
      12: { min: 15, max: 24, label: 'Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Natal di pantai.' },
      1: { min: 16, max: 26, label: 'Puncak Musim Panas', condition: 'Panas cerah', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim panas Australia.' },
      2: { min: 16, max: 26, label: 'Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hangat cerah.' },
      3: { min: 14, max: 24, label: 'Musim Gugur', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Udara mulai sejuk.' },
      4: { min: 12, max: 20, label: 'Musim Gugur', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Dedaunan berubah warna.' },
      5: { min: 10, max: 17, label: 'Pra Musim Dingin', condition: 'Sejuk dingin', snowLikelihood: 'Rendah', feelsLikeOffset: -1, description: 'Mulai terasa dingin.' }
    }
  },
  {
    id: 'sydney_bluemountains',
    name: 'Sydney (Blue Mtns)',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop',
    popularHighlight: 'Sydney Opera House, Harbour Bridge & Kabut Pegunungan Three Sisters',
    months: {
      6: { min: 10, max: 17, label: 'Musim Dingin (Blue Mts 3°C)', condition: 'Sejuk kota, dingin di bukit', snowLikelihood: 'Rendah', feelsLikeOffset: -1, description: 'Kawasan Blue Mountains memiliki udara dingin pegunungan berkabut mistis.' },
      7: { min: 9, max: 16, label: 'Puncak Musim Dingin (Blue Mts 1°C)', condition: 'Dingin malam hari', snowLikelihood: 'Rendah', feelsLikeOffset: -2, description: 'Cocok memakai coat stylish sambil berjalan di Darling Harbour.' },
      8: { min: 9, max: 18, label: 'Musim Dingin Akhir', condition: 'Sejuk cerah', snowLikelihood: 'Nol', feelsLikeOffset: -1, description: 'Udara sejuk dengan sinar matahari hangat.' },
      9: { min: 12, max: 20, label: 'Musim Semi', condition: 'Hangat nyaman', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim semi tiba.' },
      10: { min: 14, max: 22, label: 'Musim Semi', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Pantai Bondi mulai ramai.' },
      11: { min: 16, max: 24, label: 'Musim Semi Akhir', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hangat bersahabat.' },
      12: { min: 18, max: 26, label: 'Musim Panas', condition: 'Hangat pantai', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Liburan musim panas.' },
      1: { min: 20, max: 27, label: 'Puncak Musim Panas', condition: 'Hangat cerah', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Berenang di Bondi Beach.' },
      2: { min: 20, max: 26, label: 'Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Hangat pantai.' },
      3: { min: 18, max: 25, label: 'Musim Gugur', condition: 'Nyaman', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Awal musim gugur.' },
      4: { min: 15, max: 22, label: 'Musim Gugur', condition: 'Sejuk nyaman', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Udara sejuk.' },
      5: { min: 12, max: 20, label: 'Pra Musim Dingin', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Mulai sejuk berangin.' }
    }
  },
  {
    id: 'perisher_thredbo',
    name: 'Perisher / Thredbo',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort Ski Salju Terbesar di Seluruh Benua Australia (Kosciusko National Park)',
    months: {
      6: { min: -4, max: 3, label: 'Musim Dingin Dibuka', condition: 'Salju alpine', snowLikelihood: 'Tinggi', feelsLikeOffset: -4, description: 'Puncak musim dingin Australia dimulai.' },
      7: { min: -6, max: 1, label: 'Puncak Salju Lebat', condition: 'Salju padat', snowLikelihood: 'Tinggi', feelsLikeOffset: -5, description: 'Kondisi ski terbaik di Australia dengan lereng bersalju luas.' },
      8: { min: -5, max: 2, label: 'Peak Ski Season', condition: 'Salju tebal', snowLikelihood: 'Tinggi', feelsLikeOffset: -4, description: 'Salju tebal di atas ketinggian 2.000 mdpl pegunungan Snowy.' },
      9: { min: -2, max: 6, label: 'Musim Dingin Akhir', condition: 'Musim semi ski', snowLikelihood: 'Sedang', feelsLikeOffset: -2, description: 'Hari cerah bersalju.' },
      10: { min: 1, max: 11, label: 'Musim Semi', condition: 'Sejuk', snowLikelihood: 'Rendah', feelsLikeOffset: 0, description: 'Salju mulai mencair.' },
      11: { min: 4, max: 15, label: 'Musim Semi', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Trekking musim semi.' },
      12: { min: 7, max: 18, label: 'Musim Panas', condition: 'Sejuk nyaman', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Jalur pendakian gunung.' },
      1: { min: 8, max: 20, label: 'Musim Panas', condition: 'Cerah', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Puncak Mt Kosciuszko.' },
      2: { min: 8, max: 20, label: 'Musim Panas', condition: 'Hangat', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Musim panas pegunungan.' },
      3: { min: 5, max: 16, label: 'Musim Gugur', condition: 'Sejuk', snowLikelihood: 'Nol', feelsLikeOffset: 0, description: 'Awal musim gugur.' },
      4: { min: 2, max: 12, label: 'Musim Gugur', condition: 'Dingin', snowLikelihood: 'Rendah', feelsLikeOffset: -1, description: 'Embun beku pertama.' },
      5: { min: -1, max: 7, label: 'Pra Musim Dingin', condition: 'Salju pertama', snowLikelihood: 'Sedang', feelsLikeOffset: -3, description: 'Persiapan musim ski.' }
    }
  }
,
  {
    id: 'kamikochi',
    name: 'Kamikochi',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    popularHighlight: 'Kastil Matsumoto hitam berselimut salju dan pegunungan Alpen Jepang.',
    months: createClimate(-6, 3, 2, 12, 17, 26, 9, 18, 'Tinggi', 'Kastil Matsumoto hitam berselimut salju dan pegunungan Alpen Jepang.')
  },
  {
    id: 'tateyama_kurobe',
    name: 'Tateyama Kurobe',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    popularHighlight: 'Dinding koridor salju raksasa setinggi 20 meter yang spektakuler.',
    months: createClimate(-12, -4, -3, 6, 12, 20, 5, 14, 'Tinggi', 'Dinding koridor salju raksasa setinggi 20 meter yang spektakuler.')
  },
  {
    id: 'hakuba',
    name: 'Hakuba Valley',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
    popularHighlight: 'Lembah ski Olimpiade musim dingin favorit wisatawan dunia.',
    months: createClimate(-9, -1, 1, 9, 15, 24, 8, 16, 'Tinggi', 'Lembah ski Olimpiade musim dingin favorit wisatawan dunia.')
  },
  {
    id: 'zao_onsen',
    name: 'Zao Onsen (Yamagata)',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800',
    popularHighlight: 'Fenomena pohon salju monster es (Juhyo) & onsen belerang alami.',
    months: createClimate(-10, -2, -1, 8, 14, 22, 7, 15, 'Tinggi', 'Fenomena pohon salju monster es (Juhyo) & onsen belerang alami.')
  },
  {
    id: 'lake_toya_noboribetsu',
    name: 'Lake Toya',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800',
    popularHighlight: 'Lembah Neraka Jigokudani berasap di tengah hamparan salju Hokkaido.',
    months: createClimate(-7, 0, 2, 10, 15, 23, 10, 18, 'Tinggi', 'Lembah Neraka Jigokudani berasap di tengah hamparan salju Hokkaido.')
  },
  {
    id: 'aomori_hirosaki',
    name: 'Aomori & Hirosaki',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=800',
    popularHighlight: 'Wilayah dengan akumulasi salju terlebat dan festival lentera kastil.',
    months: createClimate(-5, 1, 3, 11, 16, 24, 11, 19, 'Tinggi', 'Wilayah dengan akumulasi salju terlebat dan festival lentera kastil.')
  },
  {
    id: 'sendai_matsushima',
    name: 'Sendai & Matsushima',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    popularHighlight: 'Teluk Matsushima salah satu 3 pemandangan terindah Jepang.',
    months: createClimate(-2, 6, 4, 14, 17, 26, 12, 21, 'Sedang', 'Teluk Matsushima salah satu 3 pemandangan terindah Jepang.')
  },
  {
    id: 'fukuoka_dazaifu',
    name: 'Fukuoka & Dazaifu',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    popularHighlight: 'Kuliner ramen Yatai hangat di tepi kanal malam hari.',
    months: createClimate(3, 10, 7, 18, 20, 29, 16, 25, 'Rendah', 'Kuliner ramen Yatai hangat di tepi kanal malam hari.')
  },
  {
    id: 'beppu_yufuin',
    name: 'Beppu & Yufuin',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    popularHighlight: 'Kota onsen paling terkenal di Kyushu dengan uap air panas magis.',
    months: createClimate(2, 9, 6, 17, 19, 28, 14, 23, 'Rendah', 'Kota onsen paling terkenal di Kyushu dengan uap air panas magis.')
  },
  {
    id: 'hiroshima_miyajima',
    name: 'Hiroshima & Miyajima',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800',
    popularHighlight: 'Gerbang Torii terapung Kuil Itsukushima yang syahdu di musim dingin.',
    months: createClimate(2, 10, 6, 18, 19, 28, 14, 23, 'Rendah', 'Gerbang Torii terapung Kuil Itsukushima yang syahdu di musim dingin.')
  },
  {
    id: 'nara_uji',
    name: 'Nara & Uji',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800',
    popularHighlight: 'Rusa liar di Taman Nara dan perkebunan matcha legendaris Uji.',
    months: createClimate(1, 9, 5, 17, 18, 29, 13, 23, 'Rendah', 'Rusa liar di Taman Nara dan perkebunan matcha legendaris Uji.')
  },
  {
    id: 'kobe_rokko',
    name: 'Kobe & Mt. Rokko',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    popularHighlight: 'Pemandangan malam 10 juta dolar dari puncak Gunung Rokko bersalju.',
    months: createClimate(2, 9, 6, 17, 19, 28, 15, 24, 'Rendah', 'Pemandangan malam 10 juta dolar dari puncak Gunung Rokko bersalju.')
  },
  {
    id: 'kanazawa_kenrokuen',
    name: 'Kanazawa & Kenrokuen',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=800',
    popularHighlight: 'Taman Kenroku-en dengan tali pelindung salju Yukizuri yang ikonik.',
    months: createClimate(-1, 7, 5, 15, 18, 27, 13, 22, 'Tinggi', 'Taman Kenroku-en dengan tali pelindung salju Yukizuri yang ikonik.')
  },
  {
    id: 'asahikawa_biei',
    name: 'Asahikawa / Biei',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?q=80&w=800',
    popularHighlight: 'Pohon salju Biei & kolam biru beku Shirogane yang magis.',
    months: createClimate(-14, -4, -2, 8, 13, 23, 7, 16, 'Tinggi', 'Pohon salju Biei & kolam biru beku Shirogane yang magis.')
  },
  {
    id: 'rusutsu_resort',
    name: 'Rusutsu Ski Resort',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort ski salju bubuk terbaik Hokkaido dengan fasilitas lengkap.',
    months: createClimate(-10, -2, 0, 8, 14, 23, 8, 16, 'Tinggi', 'Resort ski salju bubuk terbaik Hokkaido dengan fasilitas lengkap.')
  },
  {
    id: 'nozawa_onsen',
    name: 'Nozawa Onsen',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=800',
    popularHighlight: 'Desa onsen tradisional dengan lereng ski salju alami melimpah.',
    months: createClimate(-8, 0, 1, 10, 16, 25, 9, 17, 'Tinggi', 'Desa onsen tradisional dengan lereng ski salju alami melimpah.')
  },
  {
    id: 'shiga_kogen',
    name: 'Shiga Kogen',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800',
    popularHighlight: 'Kawasan ski terbesar di Jepang dengan 18 resort terhubung.',
    months: createClimate(-12, -3, -1, 7, 12, 21, 6, 14, 'Tinggi', 'Kawasan ski terbesar di Jepang dengan 18 resort terhubung.')
  },
  {
    id: 'kiroro_resort',
    name: 'Kiroro Snow World',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Salah satu akumulasi salju bubuk terdalam di Hokkaido.',
    months: createClimate(-11, -3, -1, 7, 13, 22, 7, 15, 'Tinggi', 'Salah satu akumulasi salju bubuk terdalam di Hokkaido.')
  },
  {
    id: 'appi_kogen',
    name: 'Appi Kogen',
    country: 'Jepang',
    region: 'Jepang',
    flag: '🇯🇵',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800',
    popularHighlight: 'Resort ski mewah di wilayah Tohoku utara dengan salju aspik halus.',
    months: createClimate(-9, -2, 0, 8, 13, 23, 7, 15, 'Tinggi', 'Resort ski mewah di wilayah Tohoku utara dengan salju aspik halus.')
  },
  {
    id: 'incheon_songdo',
    name: 'Incheon',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800',
    popularHighlight: 'Kota futuristik tepi laut dengan angin musim dingin sejuk.',
    months: createClimate(-5, 3, 3, 14, 17, 27, 13, 22, 'Sedang', 'Kota futuristik tepi laut dengan angin musim dingin sejuk.')
  },
  {
    id: 'yongpyong_resort',
    name: 'Yongpyong Ski Resort',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Lokasi syuting drama Winter Sonata & resort ski Olimpiade Pyeongchang.',
    months: createClimate(-12, -2, -2, 9, 13, 23, 7, 16, 'Tinggi', 'Lokasi syuting drama Winter Sonata & resort ski Olimpiade Pyeongchang.')
  },
  {
    id: 'sokcho_seoraksan',
    name: 'Mt. Seoraksan',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538669715315-155099307775?q=80&w=800',
    popularHighlight: 'Puncak tebing granit bersalju Taman Nasional Seoraksan spektakuler.',
    months: createClimate(-6, 3, 2, 13, 16, 25, 11, 20, 'Tinggi', 'Puncak tebing granit bersalju Taman Nasional Seoraksan spektakuler.')
  },
  {
    id: 'suwon_hwaseong',
    name: 'Suwon Fortress',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800',
    popularHighlight: 'Benteng warisan UNESCO yang megah dihiasi lapisan salju putih.',
    months: createClimate(-6, 3, 3, 15, 17, 27, 12, 22, 'Sedang', 'Benteng warisan UNESCO yang megah dihiasi lapisan salju putih.')
  },
  {
    id: 'gangneung',
    name: 'Gangneung',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538669715315-155099307775?q=80&w=800',
    popularHighlight: 'Pantai pasir bersalju, dermaga syuting drama Goblin & kafe kopi estetik.',
    months: createClimate(-2, 6, 4, 15, 18, 27, 13, 22, 'Sedang', 'Pantai pasir bersalju, dermaga syuting drama Goblin & kafe kopi estetik.')
  },
  {
    id: 'high1_resort',
    name: 'High1 Ski Resort',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort salju tertinggi di Korea dengan panorama pegunungan putih bersih.',
    months: createClimate(-12, -2, -1, 9, 13, 22, 6, 15, 'Tinggi', 'Resort salju tertinggi di Korea dengan panorama pegunungan putih bersih.')
  },
  {
    id: 'elysian_gangchon',
    name: 'Elysian Gangchon Ski',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
    popularHighlight: 'Resort ski paling dekat dari Seoul, bisa dicapai dengan subway.',
    months: createClimate(-9, 1, 1, 13, 16, 26, 9, 19, 'Tinggi', 'Resort ski paling dekat dari Seoul, bisa dicapai dengan subway.')
  },
  {
    id: 'pohang',
    name: 'Pohang',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1538669715315-155099307775?q=80&w=800',
    popularHighlight: 'Patung Tangan Matahari Terbit di laut dan jembatan Space Walk viral.',
    months: createClimate(-1, 7, 5, 17, 19, 27, 14, 23, 'Rendah', 'Patung Tangan Matahari Terbit di laut dan jembatan Space Walk viral.')
  },
  {
    id: 'phoenix_pyeongchang',
    name: 'Phoenix Snow Park',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Arena ski snowboard papan atas tempat kompetisi gaya bebas Olimpiade.',
    months: createClimate(-12, -2, -1, 9, 13, 22, 6, 15, 'Tinggi', 'Arena ski snowboard papan atas tempat kompetisi gaya bebas Olimpiade.')
  },
  {
    id: 'andong_hahoe',
    name: 'Andong Hahoe',
    country: 'Korea Selatan',
    region: 'Korea Selatan',
    flag: '🇰🇷',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800',
    popularHighlight: 'Desa rakyat tradisional tepi sungai beratap jerami dihiasi salju lembut.',
    months: createClimate(-6, 4, 2, 16, 16, 28, 10, 22, 'Sedang', 'Desa rakyat tradisional tepi sungai beratap jerami dihiasi salju lembut.')
  },
  {
    id: 'chengdu',
    name: 'Chengdu & Panda Base',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=800',
    popularHighlight: 'Melihat panda raksasa bermain di cuaca sejuk dan menikmati hotpot Sichuan.',
    months: createClimate(3, 10, 11, 21, 22, 30, 16, 23, 'Rendah', 'Melihat panda raksasa bermain di cuaca sejuk dan menikmati hotpot Sichuan.')
  },
  {
    id: 'jiuzhaigou',
    name: 'Jiuzhaigou',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    popularHighlight: 'Air terjun beku kristal dan danau toska berselimut salju dongeng.',
    months: createClimate(-8, 2, 2, 14, 14, 24, 7, 16, 'Tinggi', 'Air terjun beku kristal dan danau toska berselimut salju dongeng.')
  },
  {
    id: 'shangrila_diqing',
    name: 'Shangri-La (Diqing)',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Negeri utopia Tibet di ketinggian 3.200 mdpl dengan biara bersalju.',
    months: createClimate(-9, 6, -1, 12, 8, 19, 3, 14, 'Tinggi', 'Negeri utopia Tibet di ketinggian 3.200 mdpl dengan biara bersalju.')
  },
  {
    id: 'xian',
    name: "Xi'an",
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=800',
    popularHighlight: 'Tembok kota kuno bersalju dan makam ribuan prajurit terakota.',
    months: createClimate(-3, 6, 7, 18, 21, 31, 13, 21, 'Sedang', 'Tembok kota kuno bersalju dan makam ribuan prajurit terakota.')
  },
  {
    id: 'guilin',
    name: 'Guilin & Yangshuo',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Pemandangan bukit karst Sungai Li yang syahdu di musim dingin sejuk.',
    months: createClimate(6, 12, 13, 21, 24, 32, 18, 26, 'Rendah', 'Pemandangan bukit karst Sungai Li yang syahdu di musim dingin sejuk.')
  },
  {
    id: 'chongqing',
    name: 'Chongqing',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=800',
    popularHighlight: 'Kota 3D cyberpunk tepi Sungai Yangtze berselimut kabut musim dingin.',
    months: createClimate(6, 11, 12, 21, 25, 34, 17, 23, 'Rendah', 'Kota 3D cyberpunk tepi Sungai Yangtze berselimut kabut musim dingin.')
  },
  {
    id: 'yabuli_resort',
    name: 'Yabuli Ski',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort ski terbesar di Tiongkok dengan salju alami super tebal.',
    months: createClimate(-25, -12, -7, 6, 12, 25, 4, 15, 'Tinggi', 'Resort ski terbesar di Tiongkok dengan salju alami super tebal.')
  },
  {
    id: 'urumiqi_tianshan',
    name: 'Urumqi',
    country: 'Tiongkok',
    region: 'Tiongkok & Asia Timur',
    flag: '🇨🇳',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Danau Surgawi beku di pegunungan Tianshan Xinjiang yang eksotis.',
    months: createClimate(-16, -6, 2, 15, 17, 30, 6, 18, 'Tinggi', 'Danau Surgawi beku di pegunungan Tianshan Xinjiang yang eksotis.')
  },
  {
    id: 'jiufen_shifen',
    name: 'Jiufen & Shifen',
    country: 'Taiwan',
    region: 'Tiongkok & Asia Timur',
    flag: '🇹🇼',
    imageUrl: 'https://images.unsplash.com/photo-1508247967583-7d982ea01526?q=80&w=800',
    popularHighlight: 'Menerbangkan lampion harapan di Shifen dan lorong lentera merah Jiufen.',
    months: createClimate(12, 17, 15, 23, 23, 31, 19, 25, 'Nol', 'Menerbangkan lampion harapan di Shifen dan lorong lentera merah Jiufen.')
  },
  {
    id: 'taichung_sunmoon',
    name: 'Sun Moon Lake',
    country: 'Taiwan',
    region: 'Tiongkok & Asia Timur',
    flag: '🇹🇼',
    imageUrl: 'https://images.unsplash.com/photo-1508247967583-7d982ea01526?q=80&w=800',
    popularHighlight: 'Danau berkabut sejuk dan perkebunan teh pegunungan Taiwan.',
    months: createClimate(11, 21, 16, 26, 24, 32, 20, 28, 'Nol', 'Danau berkabut sejuk dan perkebunan teh pegunungan Taiwan.')
  },
  {
    id: 'alishan',
    name: 'Alishan',
    country: 'Taiwan',
    region: 'Tiongkok & Asia Timur',
    flag: '🇹🇼',
    imageUrl: 'https://images.unsplash.com/photo-1508247967583-7d982ea01526?q=80&w=800',
    popularHighlight: 'Kereta api hutan kuno menembus kabut dingin dan lautan awan.',
    months: createClimate(2, 11, 5, 14, 11, 18, 8, 15, 'Sedang', 'Kereta api hutan kuno menembus kabut dingin dan lautan awan.')
  },
  {
    id: 'hong_kong',
    name: 'Hong Kong',
    country: 'Hong Kong',
    region: 'Tiongkok & Asia Timur',
    flag: '🇭🇰',
    imageUrl: 'https://images.unsplash.com/photo-1506970845346-22b0f5286b4f?q=80&w=800',
    popularHighlight: 'Udara sejuk nyaman 15°C berbelanja di Tsim Sha Tsui & Disneyland.',
    months: createClimate(14, 19, 18, 25, 26, 31, 23, 28, 'Nol', 'Udara sejuk nyaman 15°C berbelanja di Tsim Sha Tsui & Disneyland.')
  },
  {
    id: 'macao',
    name: 'Macao',
    country: 'Macao',
    region: 'Tiongkok & Asia Timur',
    flag: '🇲🇴',
    imageUrl: 'https://images.unsplash.com/photo-1506970845346-22b0f5286b4f?q=80&w=800',
    popularHighlight: 'Reruntuhan Katedral St. Paul dan kasino megah berlampu warna-warni.',
    months: createClimate(13, 19, 17, 24, 25, 31, 22, 28, 'Nol', 'Reruntuhan Katedral St. Paul dan kasino megah berlampu warna-warni.')
  },
  {
    id: 'antalya',
    name: 'Antalya & Kaleiçi',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
    popularHighlight: 'Kota tua Mediterania dengan latar belakang Pegunungan Taurus bersalju.',
    months: createClimate(6, 15, 9, 21, 19, 33, 14, 26, 'Rendah', 'Kota tua Mediterania dengan latar belakang Pegunungan Taurus bersalju.')
  },
  {
    id: 'ankara',
    name: 'Ankara (Anitkabir)',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
    popularHighlight: 'Mausoleum Ataturk berselimut salju tebal di dataran tinggi Anatolia.',
    months: createClimate(-3, 5, 2, 16, 13, 29, 7, 20, 'Tinggi', 'Mausoleum Ataturk berselimut salju tebal di dataran tinggi Anatolia.')
  },
  {
    id: 'konya',
    name: 'Konya',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
    popularHighlight: 'Kota sufi Maulana Jalaluddin Rumi dengan tarian Whirling Dervishes.',
    months: createClimate(-4, 5, 1, 16, 12, 30, 6, 20, 'Tinggi', 'Kota sufi Maulana Jalaluddin Rumi dengan tarian Whirling Dervishes.')
  },
  {
    id: 'erzurum_palandoken',
    name: 'Erzurum',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
    popularHighlight: 'Pusat ski paling dingin di Turki dengan jalur terpanjang di Eropa Timur.',
    months: createClimate(-15, -4, -4, 8, 7, 23, 1, 15, 'Tinggi', 'Pusat ski paling dingin di Turki dengan jalur terpanjang di Eropa Timur.')
  },
  {
    id: 'kayseri_erciyes',
    name: 'Mount Erciyes',
    country: 'Turki',
    region: 'Turki & Timur Tengah',
    flag: '🇹🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort ski gunung berapi aktif di samping Cappadocia yang sangat terkenal.',
    months: createClimate(-8, 2, -1, 13, 10, 27, 4, 18, 'Tinggi', 'Resort ski gunung berapi aktif di samping Cappadocia yang sangat terkenal.')
  },
  {
    id: 'al_ula',
    name: 'Al Ula (Hegra)',
    country: 'Arab Saudi',
    region: 'Turki & Timur Tengah',
    flag: '🇸🇦',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800',
    popularHighlight: 'Makam batu kuno Nabatea di gurun berhawa dingin malam hari.',
    months: createClimate(7, 20, 14, 29, 22, 38, 16, 31, 'Nol', 'Makam batu kuno Nabatea di gurun berhawa dingin malam hari.')
  },
  {
    id: 'riyadh_diriyah',
    name: 'Riyadh & Diriyah',
    country: 'Arab Saudi',
    region: 'Turki & Timur Tengah',
    flag: '🇸🇦',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800',
    popularHighlight: 'Ibukota Arab Saudi di musim dingin sejuk dengan kota lumpur bersejarah Diriyah.',
    months: createClimate(9, 21, 18, 32, 29, 43, 20, 35, 'Nol', 'Ibukota Arab Saudi di musim dingin sejuk dengan kota lumpur bersejarah Diriyah.')
  },
  {
    id: 'tbilisi',
    name: 'Tbilisi (Old Town)',
    country: 'Georgia',
    region: 'Turki & Timur Tengah',
    flag: '🇬🇪',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800',
    popularHighlight: 'Balkon kayu warna-warni, pemandian belerang, dan pemandangan salju Kaukasus.',
    months: createClimate(-1, 7, 4, 16, 16, 30, 9, 20, 'Sedang', 'Balkon kayu warna-warni, pemandian belerang, dan pemandangan salju Kaukasus.')
  },
  {
    id: 'gudauri',
    name: 'Gudauri Ski Resort',
    country: 'Georgia',
    region: 'Turki & Timur Tengah',
    flag: '🇬🇪',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Destinasi ski bebas visa paling populer bagi wisatawan Indonesia.',
    months: createClimate(-12, -2, -4, 6, 7, 18, 1, 11, 'Tinggi', 'Destinasi ski bebas visa paling populer bagi wisatawan Indonesia.')
  },
  {
    id: 'kazbegi',
    name: 'Kazbegi',
    country: 'Georgia',
    region: 'Turki & Timur Tengah',
    flag: '🇬🇪',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Gereja abad ke-14 berlatar belakang Gunung Kazbek bersalju 5.047 mdpl.',
    months: createClimate(-13, -3, -5, 5, 6, 17, 0, 10, 'Tinggi', 'Gereja abad ke-14 berlatar belakang Gunung Kazbek bersalju 5.047 mdpl.')
  },
  {
    id: 'baku',
    name: 'Baku (Flame Towers)',
    country: 'Azerbaijan',
    region: 'Turki & Timur Tengah',
    flag: '🇦🇿',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800',
    popularHighlight: 'Kota modern tepi Laut Kaspia dengan arsitektur Zaha Hadid ikonik.',
    months: createClimate(2, 7, 5, 14, 18, 30, 13, 21, 'Rendah', 'Kota modern tepi Laut Kaspia dengan arsitektur Zaha Hadid ikonik.')
  },
  {
    id: 'shahdag',
    name: 'Shahdag',
    country: 'Azerbaijan',
    region: 'Turki & Timur Tengah',
    flag: '🇦🇿',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
    popularHighlight: 'Resort ski mewah bintang lima di pegunungan Kaukasus Azerbaijan.',
    months: createClimate(-11, -1, -3, 7, 8, 19, 2, 12, 'Tinggi', 'Resort ski mewah bintang lima di pegunungan Kaukasus Azerbaijan.')
  },
  {
    id: 'gabala_tufandag',
    name: 'Gabala',
    country: 'Azerbaijan',
    region: 'Turki & Timur Tengah',
    flag: '🇦🇿',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Kereta gantung melintasi hutan pinus bersalju di lereng Kaukasus.',
    months: createClimate(-8, 2, 1, 12, 15, 27, 7, 18, 'Tinggi', 'Kereta gantung melintasi hutan pinus bersalju di lereng Kaukasus.')
  },
  {
    id: 'yerevan_tsaghkadzor',
    name: 'Tsaghkadzor',
    country: 'Armenia',
    region: 'Turki & Timur Tengah',
    flag: '🇦🇲',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800',
    popularHighlight: 'Lembah Bunga Tsaghkadzor yang berselimut salju tebal untuk arena ski.',
    months: createClimate(-9, 0, 1, 14, 15, 30, 7, 20, 'Tinggi', 'Lembah Bunga Tsaghkadzor yang berselimut salju tebal untuk arena ski.')
  },
  {
    id: 'almaty_shymbulak',
    name: 'Shymbulak',
    country: 'Kazakhstan',
    region: 'Turki & Timur Tengah',
    flag: '🇰🇿',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    popularHighlight: 'Gondola tertinggi di Asia Tengah menuju lereng salju spektakuler Tien Shan.',
    months: createClimate(-10, 0, 2, 16, 15, 29, 7, 19, 'Tinggi', 'Gondola tertinggi di Asia Tengah menuju lereng salju spektakuler Tien Shan.')
  },
  {
    id: 'tashkent_amirsoy',
    name: 'Amirsoy',
    country: 'Uzbekistan',
    region: 'Turki & Timur Tengah',
    flag: '🇺🇿',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
    popularHighlight: 'Resort ski modern terbaru di Jalur Sutra pegunungan Chatkal.',
    months: createClimate(-3, 7, 6, 19, 17, 34, 9, 23, 'Sedang', 'Resort ski modern terbaru di Jalur Sutra pegunungan Chatkal.')
  },
  {
    id: 'samarkand',
    name: 'Samarkand & Registan',
    country: 'Uzbekistan',
    region: 'Turki & Timur Tengah',
    flag: '🇺🇿',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800',
    popularHighlight: 'Kubah mozaik pirus Lapangan Registan dihiasi taburan salju anggun.',
    months: createClimate(-3, 7, 5, 20, 16, 33, 8, 22, 'Sedang', 'Kubah mozaik pirus Lapangan Registan dihiasi taburan salju anggun.')
  },
  {
    id: 'bukhara',
    name: 'Bukhara',
    country: 'Uzbekistan',
    region: 'Turki & Timur Tengah',
    flag: '🇺🇿',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800',
    popularHighlight: 'Menara Kalyan berusia 900 tahun di kota oasis Jalur Sutra berselimut salju.',
    months: createClimate(-2, 8, 7, 21, 18, 35, 9, 24, 'Sedang', 'Menara Kalyan berusia 900 tahun di kota oasis Jalur Sutra berselimut salju.')
  },
  {
    id: 'grindelwald',
    name: 'Grindelwald & First',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800',
    popularHighlight: 'Desa gletser di bawah dinding utara Eiger dengan jembatan gantung First Cliff Walk.',
    months: createClimate(-6, 2, 0, 11, 8, 20, 3, 13, 'Tinggi', 'Desa gletser di bawah dinding utara Eiger dengan jembatan gantung First Cliff Walk.')
  },
  {
    id: 'lauterbrunnen',
    name: 'Lauterbrunnen',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Lembah 72 air terjun yang menginspirasi Rivendell dalam Lord of the Rings.',
    months: createClimate(-5, 3, 1, 12, 9, 21, 4, 14, 'Tinggi', 'Lembah 72 air terjun yang menginspirasi Rivendell dalam Lord of the Rings.')
  },
  {
    id: 'davos_klosters',
    name: 'Davos & Klosters',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Kota tertinggi di Eropa (1.560 mdpl) dan arena ski bangsawan Eropa.',
    months: createClimate(-10, -1, -4, 7, 4, 17, 0, 11, 'Tinggi', 'Kota tertinggi di Eropa (1.560 mdpl) dan arena ski bangsawan Eropa.')
  },
  {
    id: 'bern',
    name: 'Bern',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800',
    popularHighlight: 'Ibukota Swiss dengan menara jam Zytglogge dan deretan arkade bersalju.',
    months: createClimate(-3, 3, 2, 13, 11, 23, 6, 15, 'Sedang', 'Ibukota Swiss dengan menara jam Zytglogge dan deretan arkade bersalju.')
  },
  {
    id: 'basel',
    name: 'Basel',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800',
    popularHighlight: 'Pasar natal terindah di Swiss di Barfüsserplatz tepi Sungai Rhine.',
    months: createClimate(-1, 5, 4, 15, 12, 25, 7, 16, 'Sedang', 'Pasar natal terindah di Swiss di Barfüsserplatz tepi Sungai Rhine.')
  },
  {
    id: 'montreux',
    name: 'Montreux',
    country: 'Swiss',
    region: 'Eropa Barat & Alpen',
    flag: '🇨🇭',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800',
    popularHighlight: 'Kastil tepi Danau Jenewa berlatar Pegunungan Alpen berselimut salju.',
    months: createClimate(1, 6, 6, 16, 13, 24, 8, 17, 'Rendah', 'Kastil tepi Danau Jenewa berlatar Pegunungan Alpen berselimut salju.')
  },
  {
    id: 'courchevel',
    name: 'Courchevel',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
    popularHighlight: 'Resort ski paling bergengsi di dunia dengan restoran Michelin star.',
    months: createClimate(-9, -1, -3, 7, 6, 18, 1, 11, 'Tinggi', 'Resort ski paling bergengsi di dunia dengan restoran Michelin star.')
  },
  {
    id: 'val_thorens',
    name: 'Val Thorens',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
    popularHighlight: 'Resort ski tertinggi di Eropa (2.300 mdpl) dengan salju tebal hingga Mei.',
    months: createClimate(-11, -2, -5, 5, 4, 16, 0, 9, 'Tinggi', 'Resort ski tertinggi di Eropa (2.300 mdpl) dengan salju tebal hingga Mei.')
  },
  {
    id: 'annecy',
    name: 'Annecy',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    popularHighlight: 'Danau paling jernih di Eropa dan kanal kota tua berbunga es.',
    months: createClimate(-1, 6, 4, 16, 13, 26, 7, 18, 'Sedang', 'Danau paling jernih di Eropa dan kanal kota tua berbunga es.')
  },
  {
    id: 'strasbourg_colmar',
    name: 'Strasbourg / Colmar',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    popularHighlight: 'Ibukota Pasar Natal Dunia dengan rumah kayu dongeng berhias ribuan lampu.',
    months: createClimate(-1, 5, 4, 15, 13, 25, 7, 16, 'Sedang', 'Ibukota Pasar Natal Dunia dengan rumah kayu dongeng berhias ribuan lampu.')
  },
  {
    id: 'lyon',
    name: 'Lyon',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    popularHighlight: 'Ibukota gastronomi Prancis dan Festival Cahaya Fête des Lumières.',
    months: createClimate(1, 7, 6, 17, 14, 27, 9, 18, 'Rendah', 'Ibukota gastronomi Prancis dan Festival Cahaya Fête des Lumières.')
  },
  {
    id: 'nice_cotedazur',
    name: 'Nice',
    country: 'Prancis',
    region: 'Eropa Barat & Alpen',
    flag: '🇫🇷',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800',
    popularHighlight: 'Musim dingin Mediterania yang hangat dan pemandangan laut biru Promenade des Anglais.',
    months: createClimate(6, 13, 10, 18, 18, 27, 14, 22, 'Nol', 'Musim dingin Mediterania yang hangat dan pemandangan laut biru Promenade des Anglais.')
  },
  {
    id: 'manchester',
    name: 'Manchester',
    country: 'Inggris',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    popularHighlight: 'Kunjungan stadion Old Trafford / Etihad dan pasar natal legendaris.',
    months: createClimate(2, 7, 5, 13, 11, 20, 8, 14, 'Rendah', 'Kunjungan stadion Old Trafford / Etihad dan pasar natal legendaris.')
  },
  {
    id: 'scottish_highlands',
    name: 'Highlands & Skye',
    country: 'Skotlandia',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Bentang alam kastil kuno, lembah Glencoe, dan danau Loch Ness bersalju.',
    months: createClimate(-1, 5, 2, 10, 8, 16, 5, 11, 'Sedang', 'Bentang alam kastil kuno, lembah Glencoe, dan danau Loch Ness bersalju.')
  },
  {
    id: 'oxford_cotswolds',
    name: 'Cotswolds',
    country: 'Inggris',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    popularHighlight: 'Desa batu madu tradisional dan universitas bersejarah bernuansa Harry Potter.',
    months: createClimate(2, 8, 5, 14, 11, 22, 8, 15, 'Rendah', 'Desa batu madu tradisional dan universitas bersejarah bernuansa Harry Potter.')
  },
  {
    id: 'cambridge',
    name: 'Cambridge',
    country: 'Inggris',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    popularHighlight: 'Gedung perguruan tinggi Gotik megah di tepi Sungai Cam berkabut sejuk.',
    months: createClimate(1, 7, 4, 14, 11, 22, 8, 15, 'Rendah', 'Gedung perguruan tinggi Gotik megah di tepi Sungai Cam berkabut sejuk.')
  },
  {
    id: 'bath_stonehenge',
    name: 'Bath & Stonehenge',
    country: 'Inggris',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    popularHighlight: 'Pemandian air panas Romawi kuno dan monumen megalitikum Stonehenge.',
    months: createClimate(2, 8, 5, 14, 11, 21, 8, 15, 'Rendah', 'Pemandian air panas Romawi kuno dan monumen megalitikum Stonehenge.')
  },
  {
    id: 'york',
    name: 'York (The Shambles)',
    country: 'Inggris',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇧',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
    popularHighlight: 'Lorong jalan abad pertengahan berdinding kayu yang menginspirasi Diagon Alley.',
    months: createClimate(1, 7, 4, 13, 11, 21, 8, 14, 'Rendah', 'Lorong jalan abad pertengahan berdinding kayu yang menginspirasi Diagon Alley.')
  },
  {
    id: 'black_forest',
    name: 'Black Forest',
    country: 'Jerman',
    region: 'Eropa Barat & Alpen',
    flag: '🇩🇪',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800',
    popularHighlight: 'Hutan pinus berselimut salju Danau Titisee dan jam kukuk tradisional.',
    months: createClimate(-3, 3, 2, 13, 10, 22, 5, 14, 'Tinggi', 'Hutan pinus berselimut salju Danau Titisee dan jam kukuk tradisional.')
  },
  {
    id: 'cologne',
    name: 'Cologne',
    country: 'Jerman',
    region: 'Eropa Barat & Alpen',
    flag: '🇩🇪',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800',
    popularHighlight: 'Katedral Gotik terbesar di tepi Sungai Rhine dengan pasar natal spektakuler.',
    months: createClimate(1, 6, 5, 15, 13, 24, 8, 16, 'Rendah', 'Katedral Gotik terbesar di tepi Sungai Rhine dengan pasar natal spektakuler.')
  },
  {
    id: 'nuremberg',
    name: 'Nuremberg (Nürnberg)',
    country: 'Jerman',
    region: 'Eropa Barat & Alpen',
    flag: '🇩🇪',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800',
    popularHighlight: 'Pasar Natal Christkindlesmarkt tertua dan termasyhur di Jerman.',
    months: createClimate(-2, 4, 3, 14, 12, 24, 6, 15, 'Sedang', 'Pasar Natal Christkindlesmarkt tertua dan termasyhur di Jerman.')
  },
  {
    id: 'dresden',
    name: 'Dresden',
    country: 'Jerman',
    region: 'Eropa Barat & Alpen',
    flag: '🇩🇪',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800',
    popularHighlight: 'Pasar natal tertua di dunia sejak 1434 dengan kue Stollen tradisional.',
    months: createClimate(-2, 4, 3, 14, 13, 25, 7, 16, 'Sedang', 'Pasar natal tertua di dunia sejak 1434 dengan kue Stollen tradisional.')
  },
  {
    id: 'garmisch_zugspitze',
    name: 'Garmisch & Zugspitze',
    country: 'Jerman',
    region: 'Eropa Barat & Alpen',
    flag: '🇩🇪',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Puncak tertinggi di Jerman (2.962 mdpl) dengan panorama 400 puncak Alpen.',
    months: createClimate(-11, -3, -5, 4, 4, 15, 0, 9, 'Tinggi', 'Puncak tertinggi di Jerman (2.962 mdpl) dengan panorama 400 puncak Alpen.')
  },
  {
    id: 'zell_am_see',
    name: 'Zell am See & Kaprun',
    country: 'Austria',
    region: 'Eropa Barat & Alpen',
    flag: '🇦🇹',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Ski gletser Kitzsteinhorn 3.000 mdpl di atas danau beku yang indah.',
    months: createClimate(-7, 1, 0, 11, 9, 22, 4, 14, 'Tinggi', 'Ski gletser Kitzsteinhorn 3.000 mdpl di atas danau beku yang indah.')
  },
  {
    id: 'kitzbuhel',
    name: 'Kitzbühel',
    country: 'Austria',
    region: 'Eropa Barat & Alpen',
    flag: '🇦🇹',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort ski legendaris balapan lereng Hahnenkamm paling bergengsi.',
    months: createClimate(-7, 1, -1, 11, 8, 22, 4, 14, 'Tinggi', 'Resort ski legendaris balapan lereng Hahnenkamm paling bergengsi.')
  },
  {
    id: 'dolomites',
    name: 'Dolomites',
    country: 'Italia',
    region: 'Eropa Barat & Alpen',
    flag: '🇮🇹',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    popularHighlight: 'Puncak tebing kapur Alpen Italia yang berubah warna merah muda saat senja.',
    months: createClimate(-8, 0, -1, 9, 7, 19, 3, 12, 'Tinggi', 'Puncak tebing kapur Alpen Italia yang berubah warna merah muda saat senja.')
  },
  {
    id: 'lake_como',
    name: 'Lake Como & Bellagio',
    country: 'Italia',
    region: 'Eropa Barat & Alpen',
    flag: '🇮🇹',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800',
    popularHighlight: 'Vila mewah tepi danau yang tenang dengan latar pegunungan bersalju.',
    months: createClimate(2, 8, 6, 17, 15, 27, 10, 19, 'Rendah', 'Vila mewah tepi danau yang tenang dengan latar pegunungan bersalju.')
  },
  {
    id: 'turin',
    name: 'Turin (Piedmont)',
    country: 'Italia',
    region: 'Eropa Barat & Alpen',
    flag: '🇮🇹',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800',
    popularHighlight: 'Kota museum cokelat dan pintu gerbang resort ski Alpen Barat Italia.',
    months: createClimate(0, 7, 5, 17, 15, 27, 9, 18, 'Sedang', 'Kota museum cokelat dan pintu gerbang resort ski Alpen Barat Italia.')
  },
  {
    id: 'verona',
    name: 'Verona',
    country: 'Italia',
    region: 'Eropa Barat & Alpen',
    flag: '🇮🇹',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800',
    popularHighlight: 'Arena Romawi kuno dan balkon cinta Juliet di musim dingin romantis.',
    months: createClimate(0, 7, 5, 17, 17, 29, 11, 20, 'Rendah', 'Arena Romawi kuno dan balkon cinta Juliet di musim dingin romantis.')
  },
  {
    id: 'giethoorn',
    name: 'Giethoorn',
    country: 'Belanda',
    region: 'Eropa Barat & Alpen',
    flag: '🇳🇱',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800',
    popularHighlight: 'Desa tanpa jalan raya dengan kanal-kanal beku tempat berseluncur es.',
    months: createClimate(1, 6, 4, 14, 12, 22, 8, 15, 'Sedang', 'Desa tanpa jalan raya dengan kanal-kanal beku tempat berseluncur es.')
  },
  {
    id: 'rotterdam',
    name: 'Rotterdam',
    country: 'Belanda',
    region: 'Eropa Barat & Alpen',
    flag: '🇳🇱',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800',
    popularHighlight: 'Jajaran kincir angin kuno UNESCO di atas kanal air beku.',
    months: createClimate(2, 7, 5, 14, 12, 22, 9, 16, 'Rendah', 'Jajaran kincir angin kuno UNESCO di atas kanal air beku.')
  },
  {
    id: 'bruges_ghent',
    name: 'Bruges & Ghent',
    country: 'Belgia',
    region: 'Eropa Barat & Alpen',
    flag: '🇧🇪',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800',
    popularHighlight: 'Kanal abad pertengahan berhias lampu peri dan toko cokelat Belgia.',
    months: createClimate(2, 7, 5, 14, 12, 22, 8, 16, 'Rendah', 'Kanal abad pertengahan berhias lampu peri dan toko cokelat Belgia.')
  },
  {
    id: 'antwerp',
    name: 'Antwerp',
    country: 'Belgia',
    region: 'Eropa Barat & Alpen',
    flag: '🇧🇪',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800',
    popularHighlight: 'Stasiun kereta api paling megah di dunia dan pusat berlian global.',
    months: createClimate(2, 7, 5, 15, 12, 23, 8, 16, 'Rendah', 'Stasiun kereta api paling megah di dunia dan pusat berlian global.')
  },
  {
    id: 'levi_lapland',
    name: 'Levi (Lapland)',
    country: 'Finlandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇫🇮',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800',
    popularHighlight: 'Resort ski salju alami Lapland dengan iglo kaca aurora dan safari rusa kutub.',
    months: createClimate(-16, -8, -10, 0, 4, 17, 0, 8, 'Tinggi', 'Resort ski salju alami Lapland dengan iglo kaca aurora dan safari rusa kutub.')
  },
  {
    id: 'saariselka',
    name: 'Saariselkä',
    country: 'Finlandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇫🇮',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800',
    popularHighlight: 'Iglo kaca terkenal tempat memandang aurora borealis langsung dari tempat tidur.',
    months: createClimate(-17, -9, -11, -1, 4, 16, 0, 7, 'Tinggi', 'Iglo kaca terkenal tempat memandang aurora borealis langsung dari tempat tidur.')
  },
  {
    id: 'tampere',
    name: 'Tampere',
    country: 'Finlandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇫🇮',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800',
    popularHighlight: 'Ibukota Sauna Dunia di tepi danau bersalju tebal.',
    months: createClimate(-8, -2, -3, 6, 8, 20, 3, 11, 'Tinggi', 'Ibukota Sauna Dunia di tepi danau bersalju tebal.')
  },
  {
    id: 'flam_fjord',
    name: 'Flåm & Nærøyfjord',
    country: 'Norwegia',
    region: 'Eropa Utara & Nordik',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=800',
    popularHighlight: 'Kereta Flåmsbana menembus tebing air terjun beku fjord UNESCO spektakuler.',
    months: createClimate(-4, 2, 1, 10, 8, 20, 4, 12, 'Tinggi', 'Kereta Flåmsbana menembus tebing air terjun beku fjord UNESCO spektakuler.')
  },
  {
    id: 'svalbard',
    name: 'Svalbard',
    country: 'Norwegia',
    region: 'Eropa Utara & Nordik',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=800',
    popularHighlight: 'Kota paling utara di Bumi dengan malam kutub 24 jam dan beruang kutub.',
    months: createClimate(-18, -10, -14, -5, 2, 8, -2, 2, 'Tinggi', 'Kota paling utara di Bumi dengan malam kutub 24 jam dan beruang kutub.')
  },
  {
    id: 'stavanger',
    name: 'Stavanger',
    country: 'Norwegia',
    region: 'Eropa Utara & Nordik',
    flag: '🇳🇴',
    imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=800',
    popularHighlight: 'Tebing Preikestolen menggantung di atas Lysefjord berhawa dingin laut utara.',
    months: createClimate(1, 5, 3, 10, 10, 18, 7, 13, 'Sedang', 'Tebing Preikestolen menggantung di atas Lysefjord berhawa dingin laut utara.')
  },
  {
    id: 'are_sweden',
    name: 'Åre Ski Resort',
    country: 'Swedia',
    region: 'Eropa Utara & Nordik',
    flag: '🇸🇪',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort ski nomor 1 di Skandinavia dengan lereng salju kelas dunia.',
    months: createClimate(-11, -4, -6, 3, 5, 17, 0, 9, 'Tinggi', 'Resort ski nomor 1 di Skandinavia dengan lereng salju kelas dunia.')
  },
  {
    id: 'gothenburg',
    name: 'Gothenburg',
    country: 'Swedia',
    region: 'Eropa Utara & Nordik',
    flag: '🇸🇪',
    imageUrl: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=800',
    popularHighlight: 'Pasar natal taman hiburan Liseberg terbesar di Swedia dengan jutaan lampu.',
    months: createClimate(-2, 3, 1, 11, 10, 21, 5, 13, 'Sedang', 'Pasar natal taman hiburan Liseberg terbesar di Swedia dengan jutaan lampu.')
  },
  {
    id: 'vik_iceland',
    name: 'Vík (Black Sand)',
    country: 'Islandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇮🇸',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=800',
    popularHighlight: 'Pantai pasir hitam Reynisfjara dengan kolom basal dan deburan ombak beku Atlantik.',
    months: createClimate(-1, 4, 1, 7, 7, 13, 4, 8, 'Tinggi', 'Pantai pasir hitam Reynisfjara dengan kolom basal dan deburan ombak beku Atlantik.')
  },
  {
    id: 'golden_circle',
    name: 'Golden Circle',
    country: 'Islandia',
    region: 'Eropa Utara & Nordik',
    flag: '🇮🇸',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=800',
    popularHighlight: 'Air terjun Gullfoss beku raksasa dan semburan geyser air panas Geysir.',
    months: createClimate(-3, 2, 0, 6, 6, 14, 2, 8, 'Tinggi', 'Air terjun Gullfoss beku raksasa dan semburan geyser air panas Geysir.')
  },
  {
    id: 'aarhus_denmark',
    name: 'Aarhus',
    country: 'Denmark',
    region: 'Eropa Utara & Nordik',
    flag: '🇩🇰',
    imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=800',
    popularHighlight: 'Museum kota tua terbuka Denmark yang disulap menjadi suasana natal abad ke-19.',
    months: createClimate(-1, 4, 2, 12, 10, 21, 6, 14, 'Sedang', 'Museum kota tua terbuka Denmark yang disulap menjadi suasana natal abad ke-19.')
  },
  {
    id: 'cesky_krumlov',
    name: 'Český Krumlov',
    country: 'Republik Ceko',
    region: 'Eropa Timur & Tengah',
    flag: '🇨🇿',
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=800',
    popularHighlight: 'Kota dongeng abad pertengahan yang dibelah Sungai Vltava beku.',
    months: createClimate(-4, 2, 1, 13, 10, 23, 5, 15, 'Tinggi', 'Kota dongeng abad pertengahan yang dibelah Sungai Vltava beku.')
  },
  {
    id: 'karlovy_vary',
    name: 'Karlovy Vary',
    country: 'Republik Ceko',
    region: 'Eropa Timur & Tengah',
    flag: '🇨🇿',
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=800',
    popularHighlight: 'Kota spa pemandian air panas kolonnade megah di tengah lembah bersalju.',
    months: createClimate(-5, 1, 0, 12, 9, 22, 4, 14, 'Tinggi', 'Kota spa pemandian air panas kolonnade megah di tengah lembah bersalju.')
  },
  {
    id: 'lake_balaton',
    name: 'Lake Balaton',
    country: 'Hungaria',
    region: 'Eropa Timur & Tengah',
    flag: '🇭🇺',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=800',
    popularHighlight: 'Danau terbesar di Eropa Tengah yang membeku menjadi arena seluncur es alami.',
    months: createClimate(-3, 3, 3, 15, 14, 26, 7, 17, 'Sedang', 'Danau terbesar di Eropa Tengah yang membeku menjadi arena seluncur es alami.')
  },
  {
    id: 'zakopane',
    name: 'Zakopane',
    country: 'Polandia',
    region: 'Eropa Timur & Tengah',
    flag: '🇵🇱',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Ibukota musim dingin Polandia di kaki Pegunungan Tatra.',
    months: createClimate(-8, 0, -2, 9, 8, 20, 3, 13, 'Tinggi', 'Ibukota musim dingin Polandia di kaki Pegunungan Tatra.')
  },
  {
    id: 'granada_sierra',
    name: 'Sierra Nevada',
    country: 'Spanyol',
    region: 'Eropa Barat & Alpen',
    flag: '🇪🇸',
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800',
    popularHighlight: 'Istana Alhambra dengan latar belakang puncak salju Sierra Nevada.',
    months: createClimate(2, 13, 6, 19, 16, 34, 10, 22, 'Sedang', 'Istana Alhambra dengan latar belakang puncak salju Sierra Nevada.')
  },
  {
    id: 'seville_cordoba',
    name: 'Seville & Cordoba',
    country: 'Spanyol',
    region: 'Eropa Barat & Alpen',
    flag: '🇪🇸',
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800',
    popularHighlight: 'Plaza de España megah dan arsitektur Moor di musim dingin berhawa sejuk 16°C.',
    months: createClimate(6, 16, 10, 22, 18, 36, 14, 26, 'Nol', 'Plaza de España megah dan arsitektur Moor di musim dingin berhawa sejuk 16°C.')
  },
  {
    id: 'porto_douro',
    name: 'Porto & Douro Valley',
    country: 'Portugal',
    region: 'Eropa Barat & Alpen',
    flag: '🇵🇹',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800',
    popularHighlight: 'Jembatan Dom Luís I di atas Sungai Douro berkabut dengan kuliner pastel de nata.',
    months: createClimate(6, 14, 9, 18, 14, 25, 12, 21, 'Nol', 'Jembatan Dom Luís I di atas Sungai Douro berkabut dengan kuliner pastel de nata.')
  },
  {
    id: 'sintra_cascais',
    name: 'Sintra & Cascais',
    country: 'Portugal',
    region: 'Eropa Barat & Alpen',
    flag: '🇵🇹',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800',
    popularHighlight: 'Istana Pena warna-warni berselimut kabut mistis di puncak bukit Sintra.',
    months: createClimate(8, 15, 10, 18, 15, 26, 13, 22, 'Nol', 'Istana Pena warna-warni berselimut kabut mistis di puncak bukit Sintra.')
  },
  {
    id: 'serra_estrela',
    name: 'Serra da Estrela',
    country: 'Portugal',
    region: 'Eropa Barat & Alpen',
    flag: '🇵🇹',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Puncak salju tertinggi di daratan Portugal dengan keju gunung khas.',
    months: createClimate(-3, 4, 1, 11, 9, 22, 4, 14, 'Tinggi', 'Puncak salju tertinggi di daratan Portugal dengan keju gunung khas.')
  },
  {
    id: 'meteora_greece',
    name: 'Meteora & Delphi',
    country: 'Yunani',
    region: 'Eropa Barat & Alpen',
    flag: '🇬🇷',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800',
    popularHighlight: 'Biara-biara melayang di atas pilar batu raksasa berselimut salju langka.',
    months: createClimate(1, 9, 5, 16, 15, 31, 9, 21, 'Sedang', 'Biara-biara melayang di atas pilar batu raksasa berselimut salju langka.')
  },
  {
    id: 'zagreb_plitvice',
    name: 'Plitvice Lakes',
    country: 'Kroasia',
    region: 'Eropa Timur & Tengah',
    flag: '🇭🇷',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Air terjun beku Taman Nasional Plitvice dan pasar natal terbaik Eropa.',
    months: createClimate(-2, 4, 3, 15, 13, 26, 7, 17, 'Tinggi', 'Air terjun beku Taman Nasional Plitvice dan pasar natal terbaik Eropa.')
  },
  {
    id: 'dubrovnik',
    name: 'Dubrovnik',
    country: 'Kroasia',
    region: 'Eropa Timur & Tengah',
    flag: '🇭🇷',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Tembok kota batu Laut Adriatik yang tenang dan sejuk tanpa kerumunan turis.',
    months: createClimate(6, 12, 9, 17, 19, 29, 14, 22, 'Rendah', 'Tembok kota batu Laut Adriatik yang tenang dan sejuk tanpa kerumunan turis.')
  },
  {
    id: 'washington_dc',
    name: 'Washington D.C.',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?q=80&w=800',
    popularHighlight: 'The Capitol, Gedung Putih, dan Lincoln Memorial berselimut salju megah.',
    months: createClimate(-3, 6, 4, 17, 18, 30, 11, 21, 'Sedang', 'The Capitol, Gedung Putih, dan Lincoln Memorial berselimut salju megah.')
  },
  {
    id: 'boston',
    name: 'Boston',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?q=80&w=800',
    popularHighlight: 'Kampus Harvard dan jalur sejarah Freedom Trail berselimut salju.',
    months: createClimate(-6, 3, 2, 13, 16, 28, 9, 18, 'Tinggi', 'Kampus Harvard dan jalur sejarah Freedom Trail berselimut salju.')
  },
  {
    id: 'seattle',
    name: 'Seattle',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?q=80&w=800',
    popularHighlight: 'Menara Space Needle dengan latar belakang megah Gunung Rainier bersalju.',
    months: createClimate(3, 9, 6, 15, 13, 24, 9, 18, 'Rendah', 'Menara Space Needle dengan latar belakang megah Gunung Rainier bersalju.')
  },
  {
    id: 'salt_lake_city',
    name: 'Salt Lake City',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Kualitas salju terbaik di Bumi (The Greatest Snow on Earth) di Utah.',
    months: createClimate(-6, 3, 2, 15, 16, 32, 7, 20, 'Tinggi', 'Kualitas salju terbaik di Bumi (The Greatest Snow on Earth) di Utah.')
  },
  {
    id: 'yellowstone_winter',
    name: 'Yellowstone',
    country: 'Amerika Serikat',
    region: 'Amerika Utara',
    flag: '🇺🇸',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Geyser uap panas di tengah padang salju beku dan bison liar berbulu salju.',
    months: createClimate(-18, -4, -9, 6, 2, 23, -2, 13, 'Tinggi', 'Geyser uap panas di tengah padang salju beku dan bison liar berbulu salju.')
  },
  {
    id: 'montreal_winter',
    name: 'Montreal (Quebec)',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800',
    popularHighlight: 'Kota festival musim dingin Igloofest dan Underground City terpanjang.',
    months: createClimate(-14, -5, -3, 8, 12, 26, 5, 15, 'Tinggi', 'Kota festival musim dingin Igloofest dan Underground City terpanjang.')
  },
  {
    id: 'quebec_city',
    name: 'Quebec City',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800',
    popularHighlight: 'Kastil Château Frontenac bak negeri dongeng bersalju paling estetik di Amerika.',
    months: createClimate(-15, -6, -4, 7, 10, 24, 4, 14, 'Tinggi', 'Kastil Château Frontenac bak negeri dongeng bersalju paling estetik di Amerika.')
  },
  {
    id: 'whistler',
    name: 'Whistler Blackcomb',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort ski nomor 1 di Amerika Utara dengan gondola Peak 2 Peak spektakuler.',
    months: createClimate(-6, 1, 0, 11, 8, 23, 3, 14, 'Tinggi', 'Resort ski nomor 1 di Amerika Utara dengan gondola Peak 2 Peak spektakuler.')
  },
  {
    id: 'ottawa_skateway',
    name: 'Ottawa',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800',
    popularHighlight: 'Arena seluncur es alami terpanjang di dunia (7,8 km) di ibukota Kanada.',
    months: createClimate(-15, -6, -4, 9, 11, 26, 4, 15, 'Tinggi', 'Arena seluncur es alami terpanjang di dunia (7,8 km) di ibukota Kanada.')
  },
  {
    id: 'yellowknife',
    name: 'Yellowknife',
    country: 'Kanada',
    region: 'Amerika Utara',
    flag: '🇨🇦',
    imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=800',
    popularHighlight: 'Tingkat keberhasilan melihat aurora borealis mencapai 95% di musim dingin beku.',
    months: createClimate(-28, -20, -15, 0, 5, 21, 2, 10, 'Tinggi', 'Tingkat keberhasilan melihat aurora borealis mencapai 95% di musim dingin beku.')
  },
  {
    id: 'franz_josef',
    name: 'Franz Josef Glacier',
    country: 'Selandia Baru',
    region: 'Selandia Baru & Australia',
    flag: '🇳🇿',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Heli-hike menjelajahi gletser es biru abadi di pantai barat Selandia Baru.',
    months: createSouthernClimate(0, 9, 5, 14, 10, 19, 6, 14, 'Tinggi', 'Heli-hike menjelajahi gletser es biru abadi di ketinggian Alpen Selatan.')
  },
  {
    id: 'rotorua',
    name: 'Rotorua',
    country: 'Selandia Baru',
    region: 'Selandia Baru & Australia',
    flag: '🇳🇿',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Mata air panas geiser belerang dan kebudayaan Maori berhawa dingin sejuk.',
    months: createSouthernClimate(3, 12, 7, 16, 12, 23, 8, 17, 'Rendah', 'Mata air panas geiser belerang berasap dan hawa sejuk Maori.')
  },
  {
    id: 'mt_buller',
    name: 'Mount Buller',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Resort salju paling populer untuk day-trip dari Melbourne di musim dingin.',
    months: createSouthernClimate(-4, 1, 1, 9, 8, 19, 3, 11, 'Tinggi', 'Puncak salju Alpen Victoria dengan lereng ski dan snow resort favorit.')
  },
  {
    id: 'mt_hotham',
    name: 'Mount Hotham',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800',
    popularHighlight: 'Ibukota salju Australia di atas garis pepohonan Alpen Victoria.',
    months: createSouthernClimate(-5, 0, 0, 8, 7, 18, 2, 10, 'Tinggi', 'Ibukota salju Australia di atas garis pepohonan Alpen Victoria.')
  },
  {
    id: 'tasmania',
    name: 'Tasmania',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    popularHighlight: 'Pulau paling selatan Australia dengan salju di Cradle Mountain dan festival Dark Mofo.',
    months: createSouthernClimate(1, 10, 5, 15, 9, 21, 6, 14, 'Sedang', 'Salju di Cradle Mountain dan festival musim dingin Dark Mofo Hobart.')
  },
  {
    id: 'blue_mountains',
    name: 'Blue Mountains',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800',
    popularHighlight: 'Formasi tebing Three Sisters yang sejuk dan festival Yulefest musim dingin.',
    months: createSouthernClimate(2, 9, 6, 16, 11, 23, 7, 15, 'Sedang', 'Formasi Three Sisters berkabut dingin dan perayaan Yulefest musim dingin.')
  },
  {
    id: 'canberra_snowy',
    name: 'Canberra',
    country: 'Australia',
    region: 'Selandia Baru & Australia',
    flag: '🇦🇺',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800',
    popularHighlight: 'Ibukota Australia dengan suhu minus malam hari dan salju di Namadgi.',
    months: createSouthernClimate(-1, 11, 5, 18, 12, 27, 6, 18, 'Sedang', 'Ibukota Australia dengan suhu minus malam hari dan salju di Namadgi.')
  }
];

export const DESTINATION_REGIONS = [
  'Semua Destinasi',
  'Jepang',
  'Korea Selatan',
  'Tiongkok & Asia Timur',
  'Turki & Timur Tengah',
  'Eropa Barat & Alpen',
  'Eropa Utara & Nordik',
  'Eropa Timur & Tengah',
  'Amerika Utara',
  'Selandia Baru & Australia'
];
