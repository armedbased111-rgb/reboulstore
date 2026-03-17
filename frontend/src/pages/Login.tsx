import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData);
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Email ou mot de passe incorrect.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    borderRadius: '14px',
    background: '#f5f5f4',
    border: 'none',
  };

  const btnStyle = {
    borderRadius: '14px',
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Colonne formulaire */}
      <div className="flex flex-col min-h-screen px-8 py-10 lg:px-16">

        {/* Logo / retour */}
        <Link
          to="/"
          className="text-xs tracking-[0.25em] uppercase text-stone-400 hover:text-black transition-colors self-start"
        >
          ← Reboul
        </Link>

        {/* Form centré verticalement */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

          <div className="mb-10">
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Connexion
            </h1>
            <p className="text-sm text-stone-400 mt-1.5 tracking-wide">
              Bienvenue sur Reboul
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Email"
              style={inputStyle}
              className="w-full px-5 py-4 text-sm text-black placeholder:text-stone-400 focus:outline-none focus:bg-stone-200 transition-colors"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Mot de passe"
              style={inputStyle}
              className="w-full px-5 py-4 text-sm text-black placeholder:text-stone-400 focus:outline-none focus:bg-stone-200 transition-colors"
            />

            <div className="text-right pb-1">
              <Link
                to="/forgot-password"
                className="text-xs text-stone-400 hover:text-black transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {error && (
              <p className="text-xs text-red-500 px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={btnStyle}
              className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-stone-800 transition-colors disabled:opacity-40"
            >
              {loading ? '···' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-8">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-black font-medium hover:opacity-60 transition-opacity">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      {/* Colonne vidéo */}
      <div className="hidden lg:block relative overflow-hidden bg-stone-900">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source src="/webdesign/brandImage/stonvid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/webdesign/logo/logo_w_hzhfoc.png"
            alt="Reboul"
            className="w-48 h-auto opacity-90 mix-blend-luminosity"
          />
        </div>
      </div>

    </div>
  );
};
