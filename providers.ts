export interface Service {
  name: string;
  price: string;
}

export interface Provider {
  id: string;
  fullName: string;
  businessName: string;
  profession: 'nails' | 'lashes' | 'hair' | 'cosmetics' | 'makeup' | 'barber';
  category: 'nails' | 'lashes' | 'hair' | 'cosmetics' | 'makeup' | 'barber';
  city: string;
  district?: string;
  zipCode: string;
  address?: string;
  bio: string;
  services: Service[];
  phone: string;
  instagram: string;
  profilePicture: string;
  images: string[];
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  featured?: boolean;
  userId?: string;
  // Legacy field for backward compatibility
  name: string;
  pricing: { service: string; price: string }[];
}

export const providers: Provider[] = [
  {
    id: '1',
    name: 'Kovács Anna',
    fullName: 'Kovács Anna',
    businessName: 'Luxury Nails Budapest',
    profession: 'nails',
    category: 'nails',
    city: 'Budapest',
    district: 'V. kerület',
    zipCode: '1052',
    address: 'Váci utca 15.',
    bio: 'Professzionális körömépítés és körömápolás a belvárosban. 5 éves tapasztalat, minőségi anyagok.',
    services: [
      { name: 'Géllakk', price: '8.000 Ft' },
      { name: 'Műköröm építés', price: '15.000 Ft' },
      { name: 'Francia köröm', price: '12.000 Ft' },
      { name: 'Körömápolás', price: '6.000 Ft' },
    ],
    phone: '+36 30 123 4567',
    instagram: 'https://instagram.com/luxurynailsbp',
    profilePicture: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 142,
    pricing: [
      { service: 'Géllakk', price: '8.000 Ft' },
      { service: 'Műköröm építés', price: '15.000 Ft' },
      { service: 'Francia köröm', price: '12.000 Ft' },
      { service: 'Körömápolás', price: '6.000 Ft' },
    ],
    lat: 47.4979,
    lng: 19.0402,
    featured: true,
  },
  {
    id: '2',
    name: 'Nagy Eszter',
    fullName: 'Nagy Eszter',
    businessName: 'Lash Beauty Studio',
    profession: 'lashes',
    category: 'lashes',
    city: 'Budapest',
    district: 'XIII. kerület',
    zipCode: '1132',
    address: 'Váci út 45.',
    bio: 'Egyedi pillakiépítés, prémium anyagokkal. Természetes és volumen hatás.',
    services: [
      { name: 'Klasszikus pillakiépítés', price: '12.000 Ft' },
      { name: 'Volumen pilla', price: '18.000 Ft' },
      { name: 'Pilla töltés', price: '9.000 Ft' },
    ],
    phone: '+36 20 987 6543',
    instagram: 'https://instagram.com/lashbeautystudio',
    profilePicture: 'https://images.unsplash.com/photo-1588892838749-6e03aed62918?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588892838749-6e03aed62918?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553540751-988bd7918c7e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1561453046-b951b726cf52?w=800&h=600&fit=crop',
    ],
    rating: 5.0,
    reviewCount: 89,
    pricing: [
      { service: 'Klasszikus pillakiépítés', price: '12.000 Ft' },
      { service: 'Volumen pilla', price: '18.000 Ft' },
      { service: 'Pilla töltés', price: '9.000 Ft' },
    ],
    lat: 47.5100,
    lng: 19.0500,
    featured: true,
  },
  {
    id: '3',
    name: 'Tóth Marcell',
    fullName: 'Tóth Marcell',
    businessName: 'Modern Barber Shop',
    profession: 'barber',
    category: 'barber',
    city: 'Budapest',
    district: 'VII. kerület',
    zipCode: '1074',
    address: 'Dohány utca 22.',
    bio: 'Férfi hajvágás és szakállformázás. Modern stílusok, hagyományos értékekkel.',
    services: [
      { name: 'Férfi hajvágás', price: '5.000 Ft' },
      { name: 'Szakáll formázás', price: '3.500 Ft' },
      { name: 'Hajvágás + szakáll', price: '7.500 Ft' },
    ],
    phone: '+36 70 555 1234',
    instagram: 'https://instagram.com/modernbarbershop',
    profilePicture: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 201,
    pricing: [
      { service: 'Férfi hajvágás', price: '5.000 Ft' },
      { service: 'Szakáll formázás', price: '3.500 Ft' },
      { service: 'Hajvágás + szakáll', price: '7.500 Ft' },
    ],
    lat: 47.4850,
    lng: 19.0600,
  },
  {
    id: '4',
    name: 'Kiss Viktória',
    fullName: 'Kiss Viktória',
    businessName: 'Glow Hair Salon',
    profession: 'hair',
    category: 'hair',
    city: 'Budapest',
    district: 'II. kerület',
    zipCode: '1027',
    address: 'Margit körút 8.',
    bio: 'Hajfestés, balayage, melír szakértő. Egyedi színtechnikák.',
    services: [
      { name: 'Hajvágás', price: '8.000 Ft' },
      { name: 'Festés', price: '18.000 Ft' },
      { name: 'Balayage', price: '25.000 Ft' },
      { name: 'Hajápolás', price: '12.000 Ft' },
    ],
    phone: '+36 30 777 8899',
    instagram: 'https://instagram.com/glowhairsalon',
    profilePicture: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
    ],
    rating: 4.7,
    reviewCount: 156,
    pricing: [
      { service: 'Hajvágás', price: '8.000 Ft' },
      { service: 'Festés', price: '18.000 Ft' },
      { service: 'Balayage', price: '25.000 Ft' },
      { service: 'Hajápolás', price: '12.000 Ft' },
    ],
    lat: 47.5050,
    lng: 19.0450,
    featured: true,
  },
  {
    id: '5',
    name: 'Szabó Réka',
    fullName: 'Szabó Réka',
    businessName: 'Beauty Skin Lab',
    profession: 'cosmetics',
    category: 'cosmetics',
    city: 'Budapest',
    district: 'VI. kerület',
    zipCode: '1065',
    address: 'Andrássy út 32.',
    bio: 'Kozmetikai kezelések, arckezelések, bőrápolás. Egyedi bőrápolási tanácsadás.',
    services: [
      { name: 'Arckezelés', price: '15.000 Ft' },
      { name: 'Mélytisztítás', price: '12.000 Ft' },
      { name: 'Bőrmegújítás', price: '20.000 Ft' },
    ],
    phone: '+36 20 444 5566',
    instagram: 'https://instagram.com/beautyskinlab',
    profilePicture: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 98,
    pricing: [
      { service: 'Arckezelés', price: '15.000 Ft' },
      { service: 'Mélytisztítás', price: '12.000 Ft' },
      { service: 'Bőrmegújítás', price: '20.000 Ft' },
    ],
    lat: 47.4920,
    lng: 19.0520,
  },
  {
    id: '6',
    name: 'Molnár Lili',
    fullName: 'Molnár Lili',
    businessName: 'Glam Makeup Artist',
    profession: 'makeup',
    category: 'makeup',
    city: 'Budapest',
    district: 'IX. kerület',
    zipCode: '1095',
    address: 'Ráday utca 12.',
    bio: 'Esküvői és esemény smink. Egyedi sminktechnikák minden alkalomra.',
    services: [
      { name: 'Nappali smink', price: '12.000 Ft' },
      { name: 'Esti/esküvői smink', price: '20.000 Ft' },
      { name: 'Smink tanácsadás', price: '8.000 Ft' },
    ],
    phone: '+36 70 222 3333',
    instagram: 'https://instagram.com/glammakeupartist',
    profilePicture: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&h=600&fit=crop',
    ],
    rating: 5.0,
    reviewCount: 67,
    pricing: [
      { service: 'Nappali smink', price: '12.000 Ft' },
      { service: 'Esti/esküvői smink', price: '20.000 Ft' },
      { service: 'Smink tanácsadás', price: '8.000 Ft' },
    ],
    lat: 47.5000,
    lng: 19.0380,
  },
  {
    id: '7',
    name: 'Horváth Petra',
    fullName: 'Horváth Petra',
    businessName: 'Premium Nails Spa',
    profession: 'nails',
    category: 'nails',
    city: 'Debrecen',
    zipCode: '4029',
    address: 'Csapó utca 25.',
    bio: 'Luxus körömstúdió Debrecenben. Egyedi dizájnok és minőségi kiszolgálás.',
    services: [
      { name: 'Géllakk', price: '7.000 Ft' },
      { name: 'Műköröm', price: '14.000 Ft' },
    ],
    phone: '+36 30 888 9999',
    instagram: 'https://instagram.com/premiumnailsspa',
    profilePicture: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 73,
    pricing: [
      { service: 'Géllakk', price: '7.000 Ft' },
      { service: 'Műköröm', price: '14.000 Ft' },
    ],
    lat: 47.5316,
    lng: 21.6273,
  },
  {
    id: '8',
    name: 'Varga Dániel',
    fullName: 'Varga Dániel',
    businessName: 'Elite Barber',
    profession: 'barber',
    category: 'barber',
    city: 'Szeged',
    zipCode: '6720',
    address: 'Kárász utca 10.',
    bio: 'Modern férfi frizurák és szakállformázás Szegeden.',
    services: [
      { name: 'Hajvágás', price: '4.500 Ft' },
      { name: 'Szakáll', price: '3.000 Ft' },
    ],
    phone: '+36 20 111 2222',
    instagram: 'https://instagram.com/elitebarber',
    profilePicture: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 134,
    pricing: [
      { service: 'Hajvágás', price: '4.500 Ft' },
      { service: 'Szakáll', price: '3.000 Ft' },
    ],
    lat: 46.2530,
    lng: 20.1414,
  },
];

export const categories = [
  { id: 'nails', name: 'Körmök', icon: '💅' },
  { id: 'lashes', name: 'Pillák', icon: '👁️' },
  { id: 'hair', name: 'Haj', icon: '💇' },
  { id: 'cosmetics', name: 'Kozmetika', icon: '✨' },
  { id: 'makeup', name: 'Smink', icon: '💄' },
  { id: 'barber', name: 'Borbély', icon: '✂️' },
];
