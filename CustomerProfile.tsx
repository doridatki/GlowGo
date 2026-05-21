import { useNavigate } from 'react-router';
import { User, Heart, Calendar, Settings, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProviderCard from '../components/ProviderCard';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user, logout, favorites, allProviders } = useAuth();

  const favoriteProviders = allProviders.filter(p => favorites.includes(p.id));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl text-foreground mb-2">Nincs bejelentkezve</h2>
          <p className="text-muted-foreground mb-6">
            Jelentkezz be vagy regisztrálj a kedvencek mentéséhez és a foglalások
            követéséhez
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
          >
            <LogIn className="w-5 h-5 inline mr-2" />
            Bejelentkezés
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-card border-4 border-white shadow-lg overflow-hidden mx-auto mb-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <h1 className="text-2xl text-foreground mb-1">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-medium text-foreground">{favorites.length}</p>
            <p className="text-sm text-muted-foreground">Kedvencek</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-medium text-foreground">0</p>
            <p className="text-sm text-muted-foreground">Foglalások</p>
          </div>
        </div>

        {/* Favorites */}
        {favoriteProviders.length > 0 && (
          <div>
            <h2 className="text-xl text-foreground mb-4">Kedvenc szolgáltatók</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        )}

        {favoriteProviders.length === 0 && (
          <div className="bg-secondary/50 rounded-2xl p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg text-foreground mb-2">Még nincs kedvenced</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Kezdj el felfedezni és mentsd el a kedvenc szolgáltatóidat!
            </p>
            <button
              onClick={() => navigate('/search')}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Szolgáltatók böngészése
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {user.role === 'provider' && user.providerId && (
            <button
              onClick={() => navigate(`/provider/${user.providerId}`)}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Saját profilom megtekintése</span>
            </button>
          )}
          {user.role === 'provider' && (
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-border hover:bg-secondary/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Profil szerkesztése</span>
            </button>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Kijelentkezés</span>
          </button>
        </div>
      </div>
    </div>
  );
}
