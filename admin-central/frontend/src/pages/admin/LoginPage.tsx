import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAdmin } from '../../contexts/AuthAdminContext';
import { AdminLoginDto } from '../../types/admin.types';
import { cn } from '../../utils/cn';

/**
 * Page de connexion admin
 * 
 * Route : /admin/login
 * 
 * Fonctionnalités :
 * - Formulaire email/password
 * - Validation des champs
 * - Gestion des erreurs
 * - Redirection vers /admin/reboul/dashboard après login réussi
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuthAdmin();

  const [formData, setFormData] = useState<AdminLoginDto>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<AdminLoginDto>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/admin/reboul/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Ne pas afficher la page si en cours de chargement ou déjà connecté
  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  /**
   * Valider le formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<AdminLoginDto> = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Gérer la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Valider le formulaire
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData);
      
      // Rediriger vers le dashboard après login réussi
      navigate('/admin/reboul/dashboard');
    } catch (error: any) {
      // Gérer les erreurs de connexion
      if (error.response?.status === 401) {
        setErrorMessage('Email ou mot de passe incorrect');
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gérer les changements dans les champs
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof AdminLoginDto]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Admin Centrale
          </h1>
          <p className="text-sm text-gray-600">
            Connectez-vous à votre compte administrateur
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'erreur global */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={cn(
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent',
                errors.email ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="admin@reboul.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={cn(
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent',
                errors.password ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Accès réservé aux administrateurs</p>
        </div>
      </div>
    </div>
  );
}
