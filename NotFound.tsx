import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-medium text-primary mb-4">404</h1>
        <h2 className="text-2xl text-foreground mb-3">Oldal nem található</h2>
        <p className="text-muted-foreground mb-8">
          A keresett oldal nem létezik vagy már nem elérhető.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          Vissza a főoldalra
        </button>
      </div>
    </div>
  );
}
