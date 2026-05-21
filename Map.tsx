import { useState, useMemo } from 'react';
import { categories } from '../data/providers';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Star, Navigation2, MapPin } from 'lucide-react';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Map() {
  const navigate = useNavigate();
  const { allProviders } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([47.4979, 19.0402]); // Budapest center
  const [locationName, setLocationName] = useState('Budapest központ');

  const providersWithDistance = useMemo(() => {
    return allProviders.map(provider => ({
      ...provider,
      distance: calculateDistance(
        userLocation[0],
        userLocation[1],
        provider.lat,
        provider.lng
      ),
    })).sort((a, b) => a.distance - b.distance);
  }, [userLocation, allProviders]);

  const filteredProviders = useMemo(() => {
    return selectedCategory
      ? providersWithDistance.filter(p => p.category === selectedCategory)
      : providersWithDistance;
  }, [providersWithDistance, selectedCategory]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationName('Jelenlegi helyzet');
        },
        () => {
          alert('Nem sikerült lekérni a helyzetedet');
        }
      );
    } else {
      alert('A böngésző nem támogatja a helymeghatározást');
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl text-foreground">Térkép</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {locationName}
              </p>
            </div>
            <button
              onClick={handleLocateMe}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
            >
              <Navigation2 className="w-4 h-4" />
              Jelenlegi hely
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm transition-all ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              Összes
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="max-w-2xl mx-auto px-6 mt-6">
        <div className="bg-secondary/50 rounded-2xl p-4 mb-6 text-center">
          <p className="text-sm text-foreground">
            <span className="font-medium">{filteredProviders.length}</span> szolgáltató a környéken
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Távolság szerint rendezve
          </p>
        </div>

        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => navigate(`/provider/${provider.id}`)}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={provider.images[0]}
                    alt={provider.businessName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 truncate">
                    {provider.businessName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 truncate">
                    {provider.name}
                  </p>
                  <div className="flex items-center gap-3 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-medium">{provider.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.distance.toFixed(1)} km</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/provider/${provider.id}`);
                  }}
                  className="w-full py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  Profil megnyitása
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Nincs szolgáltató ebben a kategóriában
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
