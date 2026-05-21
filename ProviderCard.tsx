import { Link } from 'react-router';
import { Star, MapPin, Heart } from 'lucide-react';
import { Provider } from '../data/providers';
import { useAuth } from '../context/AuthContext';

interface ProviderCardProps {
  provider: Provider;
  distance?: number;
}

export default function ProviderCard({ provider, distance }: ProviderCardProps) {
  const { favorites, toggleFavorite, user } = useAuth();
  const isFavorite = favorites.includes(provider.id);

  return (
    <Link to={`/provider/${provider.id}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={provider.images[0]}
            alt={provider.businessName}
            className="w-full h-full object-cover"
          />
          {user && user.role === 'customer' && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(provider.id);
              }}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-primary text-primary' : 'text-foreground'
                }`}
              />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-foreground mb-1">
            {provider.businessName}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{provider.name}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium">{provider.rating}</span>
              <span className="text-muted-foreground">({provider.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {distance ? `${distance.toFixed(1)} km` : provider.city}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
