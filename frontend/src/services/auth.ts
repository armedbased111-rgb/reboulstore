const API_URL = import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:3001');

// Types pour l'authentification
interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  access_token: string;
}

// Ré-export des types
export type { RegisterData, LoginData, User, AuthResponse };

/**
 * Service Auth - Communication avec l'API backend
 */
const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  /**
   * Connexion utilisateur
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  /**
   * Récupérer le profil utilisateur (avec token)
   */
  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }

    return response.json();
  },
};

export default authService;
