/**
 * Types TypeScript pour l'Admin Centrale
 */

/**
 * Rôles admin
 */
export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

/**
 * Utilisateur admin
 */
export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Réponse de login admin
 */
export interface AdminLoginResponse {
  user: AdminUser;
  accessToken: string;
}

/**
 * DTO pour login admin
 */
export interface AdminLoginDto {
  email: string;
  password: string;
}

/**
 * DTO pour register admin
 */
export interface AdminRegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
}
