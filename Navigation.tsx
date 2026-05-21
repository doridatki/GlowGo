import { Link, useLocation } from 'react-router';
import { Home, Search, MapPin, User } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', icon: Home, label: 'Főoldal' },
    { path: '/search', icon: Search, label: 'Keresés' },
    { path: '/map', icon: MapPin, label: 'Térkép' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center h-16 px-4">
        {links.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
