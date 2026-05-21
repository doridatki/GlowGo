import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/providers';
import { useAuth } from '../context/AuthContext';
import ProviderCard from '../components/ProviderCard';
import CategoryButton from '../components/CategoryButton';

export default function Search() {
  const { allProviders: providers } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const cities = Array.from(new Set(providers.map(p => p.city)));
  const districts = Array.from(new Set(providers.filter(p => p.district).map(p => p.district as string)));

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesQuery =
        !searchQuery ||
        provider.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        provider.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (provider.district && provider.district.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !selectedCategory || provider.category === selectedCategory;
      const matchesCity = !selectedCity || provider.city === selectedCity;
      const matchesDistrict = !selectedDistrict || provider.district === selectedDistrict;
      const matchesZipCode = !zipCode || provider.zipCode.includes(zipCode);
      const matchesRating = provider.rating >= minRating;

      return matchesQuery && matchesCategory && matchesCity && matchesDistrict && matchesZipCode && matchesRating;
    });
  }, [searchQuery, selectedCategory, selectedCity, selectedDistrict, zipCode, minRating]);

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(newCategory);
    setSearchParams(newCategory ? { category: newCategory } : {});
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-6 pb-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Keresés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 pr-14 rounded-2xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  icon={category.icon}
                  name={category.name}
                  active={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl transition-colors ${
                showFilters
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-secondary rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm text-foreground mb-2">Város</label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    if (e.target.value !== 'Budapest') {
                      setSelectedDistrict('');
                    }
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Összes város</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {selectedCity === 'Budapest' && (
                <div>
                  <label className="block text-sm text-foreground mb-2">Kerület</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Összes kerület</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm text-foreground mb-2">Irányítószám</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="pl: 1052"
                  className="w-full px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  maxLength={4}
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">
                  Minimum értékelés: {minRating || 'Bármilyen'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-6 mt-6">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredProviders.length} találat
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nincs találat. Próbálj meg más keresési feltételeket!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
