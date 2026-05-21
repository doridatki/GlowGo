import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, MapPin, Phone, Instagram, Heart, ArrowLeft, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite, user, allProviders } = useAuth();
  const provider = allProviders.find(p => p.id === id);
  const isOwnProfile = user?.role === 'provider' && user.providerId === id;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Szolgáltató nem található</p>
      </div>
    );
  }

  const isFavorite = favorites.includes(provider.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % provider.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? provider.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Image Gallery */}
      <div className="relative aspect-square max-h-[60vh] bg-black">
        <img
          src={provider.images[currentImageIndex]}
          alt={provider.businessName}
          className="w-full h-full object-cover"
        />

        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          {isOwnProfile ? (
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
            >
              <Edit2 className="w-5 h-5 text-foreground" />
            </button>
          ) : user?.role === 'customer' && (
            <button
              onClick={() => toggleFavorite(provider.id)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-primary text-primary' : 'text-foreground'
                }`}
              />
            </button>
          )}
        </div>

        {/* Image Navigation */}
        {provider.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {provider.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl text-foreground mb-1">
            {provider.businessName}
          </h1>
          <p className="text-muted-foreground mb-3">{provider.fullName}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-medium text-lg">{provider.rating}</span>
              <span className="text-muted-foreground">
                ({provider.reviewCount} értékelés)
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {provider.city}
                {provider.district && `, ${provider.district}`}
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        {(provider.address || provider.zipCode) && (
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h2 className="text-lg text-foreground mb-2">Cím</h2>
            <div className="text-muted-foreground space-y-1">
              {provider.address && <p>{provider.address}</p>}
              <p>
                {provider.zipCode} {provider.city}
                {provider.district && `, ${provider.district}`}
              </p>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="text-lg text-foreground mb-2">Bemutatkozás</h2>
          <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
        </div>

        {/* Pricing */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="text-lg text-foreground mb-3">Árlista</h2>
          <div className="space-y-3">
            {provider.services.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-foreground">{item.name}</span>
                <span className="font-medium text-primary">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${provider.phone}`}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Hívás
          </a>
          <a
            href={provider.instagram.startsWith('http') ? provider.instagram : `https://instagram.com/${provider.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-medium shadow-md hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-5 h-5" />
            Instagram
          </a>
        </div>

        {/* Info */}
        <div className="bg-secondary/50 rounded-2xl p-5 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Az időpontfoglalás telefonon vagy Instagramon keresztül történik.
            Vedd fel a kapcsolatot közvetlenül a szolgáltatóval!
          </p>
        </div>
      </div>
    </div>
  );
}
