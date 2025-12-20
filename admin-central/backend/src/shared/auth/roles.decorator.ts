import { SetMetadata } from '@nestjs/common';
import { AdminRole } from './admin-user.entity';

/**
 * Decorator @Roles() pour spécifier les rôles autorisés sur une route
 * 
 * Usage :
 * @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
 * @Get('products')
 * findAll() { ... }
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
