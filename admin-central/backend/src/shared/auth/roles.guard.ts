import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from './admin-user.entity';
import { ROLES_KEY } from './roles.decorator';

/**
 * Guard pour vérifier les rôles admin
 * 
 * Vérifie que l'admin connecté a l'un des rôles requis
 * 
 * Usage : Utiliser avec @Roles() decorator
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const admin: { role: AdminRole } = request.user;

    if (!admin) {
      return false;
    }

    // Vérifier que l'admin a l'un des rôles requis
    return requiredRoles.some((role) => admin.role === role);
  }
}
