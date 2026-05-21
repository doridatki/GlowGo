import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Upload, Plus, Trash2, CheckCircle } from 'lucide-react';
import { professions, budapestDistricts, hungarianCities } from '../data/constants';
import { useAuth } from '../context/AuthContext';
import type { ProviderFormData } from '../context/AuthContext';

interface ServiceInput {
  name: string;
  price: string;
}

export default function ProviderRegistration() {
  const navigate = useNavigate();
  const { registerProvider } = useAuth();

  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    profession: '',
    businessName: '',
    fullName: '',
    city: '',
    district: '',
    zipCode: '',
    address: '',
    bio: '',
    phone: '',
    instagram: '',
    email: '',
    password: '',
  });

  const [services, setServices] = useState<ServiceInput[]>([
    { name: '', price: '' },
  ]);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceChange = (index: number, field: 'name' | 'price', value: string) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const addService = () => {
    if (services.length < 6) {
      setServices([...services, { name: '', price: '' }]);
    }
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
        setProfilePicture(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicturePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setErrors(prev => ({ ...prev, profilePicture: '' }));
      } else {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Csak JPG vagy JPEG formátum engedélyezett'
        }));
      }
    }
  };

  const validateSection = (section: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (section === 1) {
      if (!formData.profession) newErrors.profession = 'Kötelező mező';
      if (!formData.fullName.trim()) newErrors.fullName = 'Kötelező mező';
      if (!formData.email.trim()) newErrors.email = 'Kötelező mező';
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Minimum 6 karakter szükséges';
      }
    }

    if (section === 2) {
      if (!formData.city) newErrors.city = 'Kötelező mező';
      if (formData.city === 'Budapest' && !formData.district) {
        newErrors.district = 'Budapest esetén a kerület megadása kötelező';
      }
      if (!formData.zipCode.trim()) newErrors.zipCode = 'Kötelező mező';
    }

    if (section === 3) {
      const filledServices = services.filter(s => s.name.trim() || s.price.trim());
      if (filledServices.length === 0) {
        newErrors.services = 'Legalább egy szolgáltatás megadása kötelező';
      } else {
        const invalidServices = filledServices.filter(s => !s.name.trim() || !s.price.trim());
        if (invalidServices.length > 0) {
          newErrors.services = 'Minden szolgáltatáshoz név és ár megadása szükséges';
        }
      }
    }

    if (section === 4) {
      if (!formData.phone.trim()) newErrors.phone = 'Kötelező mező';
      if (!formData.instagram.trim()) {
        newErrors.instagram = 'Kötelező mező';
      } else if (!formData.instagram.startsWith('http')) {
        newErrors.instagram = 'Érvényes URL szükséges (pl: https://instagram.com/username)';
      }
      if (!profilePicture) newErrors.profilePicture = 'Profilkép feltöltése kötelező';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentSection(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection(4)) {
      const data: ProviderFormData = {
        ...formData,
        services,
        profilePictureDataUrl: profilePicturePreview,
      };
      const newProviderId = await registerProvider(data);  // ✅
      navigate(`/provider/${newProviderId}`);
    }
  };

  const sections = [
    { number: 1, title: 'Alapadatok' },
    { number: 2, title: 'Cím' },
    { number: 3, title: 'Szolgáltatások' },
    { number: 4, title: 'Elérhetőség' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl text-foreground">GlowGo</h1>
          </div>
          <h2 className="text-2xl text-foreground mb-2">Szolgáltatói regisztráció</h2>
          <p className="text-muted-foreground">
            Hozd létre professzionális profilodat
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
          <div className="flex justify-between mb-4">
            {sections.map((section) => (
              <div
                key={section.number}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentSection > section.number
                      ? 'bg-primary text-primary-foreground'
                      : currentSection === section.number
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {currentSection > section.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    section.number
                  )}
                </div>
                <span className="text-xs text-center text-muted-foreground hidden sm:block">
                  {section.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border mb-6">
            {/* Section 1: Alapadatok */}
            {currentSection === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg text-foreground mb-4">Alapadatok</h3>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Szakma *
                  </label>
                  <select
                    value={formData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Válassz szakmát</option>
                    {professions.map((prof) => (
                      <option key={prof.value} value={prof.value}>
                        {prof.label}
                      </option>
                    ))}
                  </select>
                  {errors.profession && (
                    <p className="text-destructive text-sm mt-1">{errors.profession}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Üzlet neve
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="pl: Luxury Nails Budapest"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Teljes név *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Kovács Anna"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Email cím *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="pelda@email.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Jelszó *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Minimum 6 karakter"
                  />
                  {errors.password && (
                    <p className="text-destructive text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: Cím */}
            {currentSection === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg text-foreground mb-4">Cím</h3>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Város *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Válassz várost</option>
                    {hungarianCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-destructive text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                {formData.city === 'Budapest' && (
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Kerület *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Válassz kerületet</option>
                      {budapestDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-destructive text-sm mt-1">{errors.district}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Irányítószám *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="1052"
                    maxLength={4}
                  />
                  {errors.zipCode && (
                    <p className="text-destructive text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Utca, házszám
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Váci utca 15."
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Bemutatkozás (max 500 karakter)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
                    placeholder="Írj magadról és szolgáltatásaidról..."
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.bio.length}/500 karakter
                  </p>
                </div>
              </div>
            )}

            {/* Section 3: Szolgáltatások */}
            {currentSection === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg text-foreground">Árlista</h3>
                    <p className="text-sm text-muted-foreground">
                      Legalább 1 szolgáltatás kötelező
                    </p>
                  </div>
                  {services.length < 6 && (
                    <button
                      type="button"
                      onClick={addService}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Új
                    </button>
                  )}
                </div>

                {services.map((service, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                        className="px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder={`Szolgáltatás ${index + 1} ${index === 0 ? '*' : ''}`}
                      />
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                        className="px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder={`Ár ${index === 0 ? '*' : ''}`}
                      />
                    </div>
                    {services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                {errors.services && (
                  <p className="text-destructive text-sm">{errors.services}</p>
                )}
              </div>
            )}

            {/* Section 4: Elérhetőség */}
            {currentSection === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg text-foreground mb-4">Elérhetőség és profil</h3>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Telefonszám *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+36 30 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Instagram link *
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://instagram.com/username"
                  />
                  {errors.instagram && (
                    <p className="text-destructive text-sm mt-1">{errors.instagram}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Profilkép * (csak JPG/JPEG)
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    {profilePicturePreview ? (
                      <div className="relative">
                        <img
                          src={profilePicturePreview}
                          alt="Profil előnézet"
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePicture(null);
                            setProfilePicturePreview('');
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full cursor-pointer">
                        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary transition-colors bg-secondary/50">
                          <Upload className="w-12 h-12 text-primary" />
                          <div className="text-center">
                            <p className="text-sm text-foreground mb-1">
                              Kattints a feltöltéshez
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG vagy JPEG, max 5MB
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept=".jpg,.jpeg"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.profilePicture && (
                    <p className="text-destructive text-sm mt-1">{errors.profilePicture}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentSection > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-4 rounded-2xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Vissza
              </button>
            )}
            {currentSection < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
              >
                Tovább
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
              >
                Regisztráció befejezése
              </button>
            )}
          </div>
        </form>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-primary hover:underline"
          >
            Vissza a főoldalra
          </button>
        </div>
      </div>
    </div>
  );
}
