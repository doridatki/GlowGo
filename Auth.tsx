import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Sparkles, User, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'customer' | 'provider'>(
    (searchParams.get('role') as 'customer' | 'provider') || 'customer'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(formData.email, formData.password, role);
    } else {
      signup(formData.name, formData.email, formData.password, role);
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl text-foreground">GlowGo</h1>
          </div>
          <h2 className="text-xl text-foreground">
            {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
          </h2>
        </div>

        <div className="bg-card rounded-2xl shadow-md border border-border p-6 mb-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                role === 'customer'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground border border-border'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-sm font-medium">Vendég vagyok</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                role === 'provider'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground border border-border'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-sm font-medium">Szolgáltató vagyok</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-foreground mb-2">Név</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Teljes név"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-foreground mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="pelda@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Jelszó</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
            >
              {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? 'Még nincs fiókod? Regisztrálj!'
              : 'Van már fiókod? Jelentkezz be!'}
          </button>
        </div>
      </div>
    </div>
  );
}
