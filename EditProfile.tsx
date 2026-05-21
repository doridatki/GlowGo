import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Upload, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { professions, budapestDistricts, hungarianCities } from '../data/constants';
import { useAuth } from '../context/AuthContext';

interface ServiceInput {
  name: string;
  price: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, providerProfile, updateProviderProfile } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/auth');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    profession: providerProfile?.profession ?? '',
    businessName: providerProfile?.businessName ?? '',
    fullName: providerProfile?.fullName ?? '',
    city: providerProfile?.city ?? '',
    district: providerProfile?.district ?? '',
    zipCode: providerProfile?.zipCode ?? '',
    address: providerProfile?.address ?? '',
    bio: providerProfile?.bio ?? '',
    phone: providerProfile?.phone ?? '',
    instagram: providerProfile?.instagram ?? '',
  });

  const [services, setServices] = useState<ServiceInput[]>(
    providerProfile?.services && providerProfile.services.length > 0
      ? providerProfile.services
      : [{ name: '', price: '' }]
  );

  const [profilePicturePreview, setProfilePicturePreview] = useState<string>(
    providerProfile?.profilePicture ?? ''
  );
  const [newProfilePictureDataUrl, setNewProfilePictureDataUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setProfilePicturePreview(dataUrl);
          setNewProfilePictureDataUrl(dataUrl);
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.profession) newErrors.profession = 'Kötelező mező';
    if (!formData.fullName.trim()) newErrors.fullName = 'Kötelező mező';
    if (!formData.city) newErrors.city = 'Kötelező mező';
    if (formData.city === 'Budapest' && !formData.district) {
      newErrors.district = 'Budapest esetén a kerület megadása kötelező';
    }
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Kötelező mező';

    const filledServices = services.filter(s => s.name.trim() || s.price.trim());
    if (filledServices.length === 0) {
      newErrors.services = 'Legalább egy szolgáltatás megadása kötelező';
    } else {
      const invalidServices = filledServices.filter(s => !s.name.trim() || !s.price.trim());
      if (invalidServices.length > 0) {
        newErrors.services = 'Minden szolgáltatáshoz név és ár megadása szükséges';
      }
    }

    if (!formData.phone.trim()) newErrors.phone = 'Kötelező mező';
    if (!formData.instagram.trim()) {
      newErrors.instagram = 'Kötelező mező';
    } else if (!formData.instagram.startsWith('http')) {
      newErrors.instagram = 'Érvényes URL szükséges (pl: https://instagram.com/username)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.providerId) return;

    updateProviderProfile(user.providerId, {
      ...formData,
      services,
      profilePictureDataUrl: newProfilePictureDataUrl || undefined,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate(`/provider/${user.providerId}`);
    }, 1500);
  };

  if (!user || user.role !== 'provider') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl text-foreground">Profil szerkesztése</h1>
            <p className="text-sm text-muted-foreground">
              Frissítsd az adataidat
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-primary/10 border border-primary rounded-2xl p-4 mb-6 flex items-center gap-3">
            <Save className="w-5 h-5 text-primary" />
            <p className="text-primary font-medium">Sikeres mentés!</p>
          </div>
        )}

        {!providerProfile && (
          <div className="bg-destructive/10 border border-destructive rounded-2xl p-4 mb-6">
            <p className="text-destructive text-sm">
              A profil szerkesztése csak saját regisztrált profilra lehetséges.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alapadatok */}
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
            <h3 className="text-lg text-foreground mb-4">Alapadatok</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground mb-2">Szakma *</label>
                <select
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {professions.map((prof) => (
                    <option key={prof.value} value={prof.value}>{prof.label}</option>
                  ))}
                </select>
                {errors.profession && <p className="text-destructive text-sm mt-1">{errors.profession}</p>}
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Üzlet neve</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="pl: Luxury Nails Budapest"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Teljes név *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Kovács Anna"
                />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
              </div>
            </div>
          </div>

          {/* Cím */}
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
            <h3 className="text-lg text-foreground mb-4">Cím</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground mb-2">Város *</label>
                <select
                  value={formData.city}
                  onChange={(e) => {
                    handleInputChange('city', e.target.value);
                    if (e.target.value !== 'Budapest') handleInputChange('district', '');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Válassz várost</option>
                  {hungarianCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
              </div>

              {formData.city === 'Budapest' && (
                <div>
                  <label className="block text-sm text-foreground mb-2">Kerület *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Válassz kerületet</option>
                    {budapestDistricts.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && <p className="text-destructive text-sm mt-1">{errors.district}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm text-foreground mb-2">Irányítószám *</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="1052"
                  maxLength={4}
                />
                {errors.zipCode && <p className="text-destructive text-sm mt-1">{errors.zipCode}</p>}
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Utca, házszám</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Váci utca 15."
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Bemutatkozás (max 500 karakter)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
                  placeholder="Írj magadról és szolgáltatásaidról..."
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/500 karakter</p>
              </div>
            </div>
          </div>

          {/* Szolgáltatások */}
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg text-foreground">Árlista</h3>
                <p className="text-sm text-muted-foreground">Legalább 1 szolgáltatás kötelező</p>
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

            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                      className="px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={`Szolgáltatás ${index + 1}${index === 0 ? ' *' : ''}`}
                    />
                    <input
                      type="text"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      className="px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={`Ár${index === 0 ? ' *' : ''}`}
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
            </div>
            {errors.services && <p className="text-destructive text-sm mt-3">{errors.services}</p>}
          </div>

          {/* Elérhetőség */}
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
            <h3 className="text-lg text-foreground mb-4">Elérhetőség és profil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground mb-2">Telefonszám *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="+36 30 123 4567"
                />
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Instagram link *</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://instagram.com/username"
                />
                {errors.instagram && <p className="text-destructive text-sm mt-1">{errors.instagram}</p>}
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Profilkép (csak JPG/JPEG)</label>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profil"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-secondary border-4 border-border flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload className="w-5 h-5" />
                      <input
                        type="file"
                        accept=".jpg,.jpeg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {errors.profilePicture && (
                  <p className="text-destructive text-sm mt-2 text-center">{errors.profilePicture}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!providerProfile}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            Változtatások mentése
          </button>
        </form>
      </div>
    </div>
  );
}
