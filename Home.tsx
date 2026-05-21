import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Sparkles } from 'lucide-react';
import { categories } from '../data/providers';
import { useAuth } from '../context/AuthContext';
import ProviderCard from '../components/ProviderCard';
import CategoryButton from '../components/CategoryButton';

export default function Home() {
  const navigate = useNavigate();
  const { allProviders } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProviders = allProviders.filter(p => p.featured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl text-foreground">GlowGo</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Találd meg a tökéletes szépségszakembert a közeledben
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Keresés szolgáltatás vagy név szerint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-2xl mx-auto">
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              icon={category.icon}
              name={category.name}
              onClick={() => navigate(`/search?category=${category.id}`)}
            />
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="max-w-2xl mx-auto px-6 py-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/search')}
          className="px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
        >
          Szolgáltatás keresése
        </button>
        <button
          onClick={() => navigate('/provider-registration')}
          className="px-6 py-4 rounded-2xl bg-card border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
        >
          Csatlakozz szolgáltatóként
        </button>
      </div>

      {/* Featured Providers */}
      <div className="max-w-2xl mx-auto px-6 mt-8">
        <h2 className="text-xl text-foreground mb-4">
          Kiemelt szakemberek a közeledben
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredProviders.length > 0
            ? featuredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))
            : allProviders.slice(0, 4).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))
          }
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto px-6 mt-12">
        <div className="bg-gradient-to-br from-secondary/30 to-accent/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Hogyan működik?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Keress szépségszakembereket a környékeden, nézd meg portfoliójukat,
            olvasd el a véleményeket, és foglalj időpontot közvetlenül telefonon
            vagy Instagramon keresztül.
          </p>
        </div>
      </div>
    </div>
  );
}
