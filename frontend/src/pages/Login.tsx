import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(formData);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-full grid grid-cols-1 lg:grid-cols-[478px_1fr] lg:gap-[10px] pb-[15px] pl-4 pr-[9px] pt-[10px]">
      
      {/* Form Column */}
      <div className="lg:w-[478px]">
        <div className="w-full max-w-[478px] space-y-[71px]">
          
          {/* Header */}
          <header className="space-y-2">
            <h1 className="font-[Geist] font-bold text-[36px] leading-[32px] tracking-[-0.6px] uppercase text-center lg:text-left">
              Connexion
            </h1>
            <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] uppercase text-center lg:text-left">
              Connectez-vous à votre compte Reboul
            </p>
          </header>

          {/* Form + Actions */}
          <div className="space-y-6">
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div className="space-y-[1.5px]">
                <label htmlFor="email" className="block font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className="w-full h-12 px-3 bg-white border border-black rounded-[2px] font-[Geist] text-[14px] uppercase placeholder:uppercase placeholder:text-[rgba(0,0,0,0.5)] outline-none focus:ring-0"
                />
              </div>

              {/* Password */}
              <div className="space-y-[1.5px]">
                <label htmlFor="password" className="block font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-12 px-3 bg-white border border-black rounded-[2px] font-[Geist] text-[14px] placeholder:text-[rgba(0,0,0,0.5)] outline-none focus:ring-0"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] uppercase hover:text-black transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-black rounded-md font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] text-white uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 font-[Geist] text-[14px] leading-[20px] text-[#6a7282]">
                  OU
                </span>
              </div>
            </div>

            {/* Register */}
            <div className="space-y-4">
              <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] uppercase text-center">
                Vous n'avez pas de compte ?
              </p>
              <Link to="/register">
                <button className="w-full h-12 bg-transparent border border-black rounded-md font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase hover:bg-gray-50 transition-colors shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  Créer un compte
                </button>
              </Link>
            </div>

            {/* Back */}
            <div className="text-center">
              <Link 
                to="/" 
                className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] uppercase hover:text-black transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Video Column */}
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/webdesign/brandImage/stonvid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/webdesign/logo/logo_w_hzhfoc.png" 
            alt="Reboul Logo" 
            className="w-[334px] h-auto opacity-[0.81] mix-blend-luminosity"
          />
        </div>
      </div>

    </div>
  );
};
