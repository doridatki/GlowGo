import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Provider } from '../data/providers';
import { providers as staticProviders } from '../data/providers';

// ─── Supabase config (fetch alapú, nem kell csomag) ───────────────────────
const SUPABASE_URL = 'https://qozedxxpwmzopylnjzmj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvemVkeHhwd216b3B5bG5templIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODgxMTYsImV4cCI6MjA5NDk2NDExNn0.UMt2tjAQfm9u33PXnKQgJ_Da-zFbQCfq8GoaNx5f2Zw';

const sbHeaders = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Prefer': 'return=representation',
};

async function sbSelect(table: string, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: sbHeaders,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function sbInsert(table: string, data: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: sbHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function sbUpdate(table: string, match: string, data: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${match}`, {
    method: 'PATCH',
    headers: sbHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Types ────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'provider';
}

interface AuthContextType {
  user: User | null;
  allProviders: Provider[];
  favorites: string[];
  providerProfile: Provider | null;
  login: (email: string, password: string, role: 'customer' | 'provider') => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'customer' | 'provider') => Promise<boolean>;
  logout: () => void;
  registerProvider: (data: ProviderRegistrationData) => Promise<string>;
  updateProviderProfile: (data: Partial<Provider>) => Promise<void>;
  toggleFavorite: (providerId: string) => void;
  refreshProviders: () => Promise<void>;
}

interface ProviderRegistrationData {
  fullName: string;
  businessName: string;
  profession: string;
  category: string;
  city: string;
  district: string;
  zipCode: string;
  address: string;
  bio: string;
  services: { name: string; duration: string }[];
  pricing: { service: string; price: string }[];
  phone: string;
  instagram: string;
  profilePictureDataUrl?: string;
  images?: string[];
}

// ─── Storage helpers (session fallback) ───────────────────────────────────
const STORAGE_KEYS = {
  user: 'glowgo_user',
  favorites: 'glowgo_favorites',
};

function saveToStorage(key: string, value: unknown) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const v = sessionStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

// ─── Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage(STORAGE_KEYS.user, null));
  const [favorites, setFavorites] = useState<string[]>(() => loadFromStorage(STORAGE_KEYS.favorites, []));
  const [dbProviders, setDbProviders] = useState<Provider[]>([]);
  const [providerProfile, setProviderProfile] = useState<Provider | null>(null);

  // Merge static + DB providers
  const allProviders: Provider[] = [
    ...staticProviders,
    ...dbProviders.filter(dp => !staticProviders.find(sp => sp.id === dp.id)),
  ];

  // Load providers from Supabase on mount
  const refreshProviders = useCallback(async () => {
    try {
      const rows = await sbSelect('providers', 'select=*&order=created_at.desc');
      const mapped: Provider[] = rows.map((r: any) => ({
        id: r.id?.toString() ?? r.user_id,
        name: r.business_name || r.full_name || '',
        profession: r.profession || '',
        category: r.category || '',
        city: r.city || '',
        district: r.district || '',
        address: r.address || '',
        bio: r.bio || '',
        services: r.services || [],
        pricing: r.pricing || [],
        phone: r.phone || '',
        instagram: r.instagram || '',
        profilePicture: r.profile_picture || '',
        images: r.images || [],
        rating: r.rating || 0,
        reviewCount: r.review_count || 0,
        lat: r.lat || 47.4979,
        lng: r.lng || 19.0402,
        featured: r.featured ?? true,
        userId: r.user_id,
      }));
      setDbProviders(mapped);
    } catch (e) {
      console.error('Failed to load providers from Supabase:', e);
    }
  }, []);

  useEffect(() => { refreshProviders(); }, [refreshProviders]);

  // Load provider profile when user logs in
  useEffect(() => {
    if (user?.role === 'provider') {
      const profile = dbProviders.find(p => p.userId === user.id) ?? null;
      setProviderProfile(profile);
    } else {
      setProviderProfile(null);
    }
  }, [user, dbProviders]);

  // ── Login ──────────────────────────────────────────────────────────────
  const login = async (email: string, password: string, role: 'customer' | 'provider'): Promise<boolean> => {
    try {
      const rows = await sbSelect('accounts', `email=eq.${encodeURIComponent(email)}&role=eq.${role}&select=*`);
      if (!rows.length) return false;
      const account = rows[0];
      if (account.password !== password) return false;
      const loggedIn: User = { id: account.user_id, name: account.name || email, email, role };
      setUser(loggedIn);
      saveToStorage(STORAGE_KEYS.user, loggedIn);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  // ── Register account ───────────────────────────────────────────────────
  const register = async (name: string, email: string, password: string, role: 'customer' | 'provider'): Promise<boolean> => {
    try {
      const existing = await sbSelect('accounts', `email=eq.${encodeURIComponent(email)}&select=id`);
      if (existing.length > 0) return false;
      const userId = `user_${Date.now()}`;
      await sbInsert('accounts', { email, password, user_id: userId, role, name });
      const newUser: User = { id: userId, name, email, role };
      setUser(newUser);
      saveToStorage(STORAGE_KEYS.user, newUser);
      return true;
    } catch (e) {
      console.error('Register error:', e);
      return false;
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setFavorites([]);
    saveToStorage(STORAGE_KEYS.user, null);
    saveToStorage(STORAGE_KEYS.favorites, []);
  };

  // ── Register provider profile ──────────────────────────────────────────
  const registerProvider = async (data: ProviderRegistrationData): Promise<string> => {
    const providerId = `provider_${Date.now()}`;
    const userId = user?.id ?? `guest_${Date.now()}`;

    const row = {
      id: providerId,
      user_id: userId,
      full_name: data.fullName,
      business_name: data.businessName,
      profession: data.profession,
      category: data.category,
      city: data.city,
      district: data.district,
      zip_code: data.zipCode,
      address: data.address,
      bio: data.bio,
      services: data.services,
      pricing: data.pricing,
      phone: data.phone,
      instagram: data.instagram,
      profile_picture: data.profilePictureDataUrl ?? '',
      images: data.images ?? [],
      rating: 0,
      review_count: 0,
      lat: 47.4979,
      lng: 19.0402,
      featured: true,
    };

    await sbInsert('providers', row);
    await refreshProviders();
    return providerId;
  };

  // ── Update provider profile ────────────────────────────────────────────
  const updateProviderProfile = async (data: Partial<Provider>): Promise<void> => {
    if (!user) return;
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.business_name = data.name;
    if (data.profession !== undefined) updateData.profession = data.profession;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.district !== undefined) updateData.district = data.district;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.services !== undefined) updateData.services = data.services;
    if (data.pricing !== undefined) updateData.pricing = data.pricing;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.instagram !== undefined) updateData.instagram = data.instagram;
    if (data.profilePicture !== undefined) updateData.profile_picture = data.profilePicture;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.lat !== undefined) updateData.lat = data.lat;
    if (data.lng !== undefined) updateData.lng = data.lng;

    await sbUpdate('providers', `user_id=eq.${user.id}`, updateData);
    await refreshProviders();
  };

  // ── Favorites ──────────────────────────────────────────────────────────
  const toggleFavorite = (providerId: string) => {
    setFavorites(prev => {
      const next = prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId];
      saveToStorage(STORAGE_KEYS.favorites, next);
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      allProviders,
      favorites,
      providerProfile,
      login,
      register,
      logout,
      registerProvider,
      updateProviderProfile,
      toggleFavorite,
      refreshProviders,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}