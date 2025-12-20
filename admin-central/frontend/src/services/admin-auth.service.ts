import api from './api';
import { AdminLoginDto, AdminRegisterDto, AdminLoginResponse, AdminUser } from '../types/admin.types';

/**
 * Service d'authentification admin
 * 
 * Gère :
 * - Login admin
 * - Register admin (création compte)
 * - Récupération du profil admin connecté
 * - Logout
 */
export const adminAuthService = {
  /**
   * Connexion admin
   * 
   * @param loginDto - Email et password
   * @returns AdminLoginResponse avec user et accessToken
   */
  async login(loginDto: AdminLoginDto): Promise<AdminLoginResponse> {
    const response = await api.post<AdminLoginResponse>('/admin/auth/login', loginDto);
    
    // Stocker le token et l'utilisateur dans localStorage
    localStorage.setItem('admin_auth_token', response.data.accessToken);
    localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  /**
   * Inscription admin (création compte)
   * 
   * ⚠️ Sécurité : Devrait être protégé par SUPER_ADMIN uniquement
   * 
   * @param registerDto - Email, password, firstName, lastName, role
   * @returns AdminUser créé
   */
  async register(registerDto: AdminRegisterDto): Promise<AdminUser> {
    const response = await api.post<AdminUser>('/admin/auth/register', registerDto);
    return response.data;
  },

  /**
   * Récupérer le profil de l'admin connecté
   * 
   * @returns AdminUser actuel
   */
  async getMe(): Promise<AdminUser> {
    const response = await api.get<AdminUser>('/admin/auth/me');
    
    // Mettre à jour l'utilisateur dans localStorage
    localStorage.setItem('admin_user', JSON.stringify(response.data));
    
    return response.data;
  },

  /**
   * Déconnexion admin
   * 
   * Supprime le token et l'utilisateur du localStorage
   */
  logout(): void {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_user');
  },

  /**
   * Vérifier si un admin est connecté
   * 
   * @returns true si un token existe dans localStorage
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_auth_token');
  },

  /**
   * Récupérer l'utilisateur depuis localStorage (sans appel API)
   * 
   * @returns AdminUser ou null si non connecté
   */
  getStoredUser(): AdminUser | null {
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as AdminUser;
    } catch {
      return null;
    }
  },
};
