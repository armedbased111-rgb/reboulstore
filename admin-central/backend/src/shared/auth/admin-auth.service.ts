import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUser, AdminRole } from './admin-user.entity';

/**
 * Service d'authentification pour les administrateurs
 * 
 * Gère :
 * - Inscription admin (SUPER_ADMIN uniquement)
 * - Connexion admin
 * - Validation des credentials
 * - Génération tokens JWT
 */
@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdminUser, 'reboul') // ⚠️ Utiliser connexion 'reboul' pour MVP
    private adminUserRepository: Repository<AdminUser>,
    private jwtService: JwtService,
  ) {}

  /**
   * Inscription d'un nouvel admin
   * 
   * ⚠️ Sécurité : Seul un SUPER_ADMIN peut créer d'autres admins
   * Pour le MVP, on peut créer le premier SUPER_ADMIN manuellement en BDD
   */
  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    role: AdminRole = AdminRole.ADMIN,
  ) {
    // Vérifier que l'email n'existe pas déjà
    const existingUser = await this.adminUserRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'admin
    const adminUser = this.adminUserRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      isActive: true,
    });

    const savedUser = await this.adminUserRepository.save(adminUser);

    // Ne pas retourner le password
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   * Connexion admin
   */
  async login(email: string, password: string) {
    // Récupérer l'admin avec le password (select: false nécessite explicitement)
    const adminUser = await this.adminUserRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email', { email })
      .getOne();

    if (!adminUser) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier que le compte est actif
    if (!adminUser.isActive) {
      throw new UnauthorizedException('Ce compte administrateur est désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const payload = {
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    };

    const token = this.jwtService.sign(payload);

    // Ne pas retourner le password
    const { password: _, ...userWithoutPassword } = adminUser;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  /**
   * Valider un utilisateur admin (pour JWT Strategy)
   */
  async validateUser(userId: string): Promise<AdminUser | null> {
    const adminUser = await this.adminUserRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!adminUser) {
      return null;
    }

    // Ne pas retourner le password
    const { password: _, ...userWithoutPassword } = adminUser;
    return userWithoutPassword as AdminUser;
  }
}
