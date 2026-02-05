import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../orders/email.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; access_token: string }> {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    });

    await this.userRepository.save(user);

    // Générer JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Ne pas retourner le password
    delete user.password;

    // Envoyer email de confirmation d'inscription
    if (user.firstName) {
      this.emailService.sendRegistrationConfirmation(
        user.email,
        user.firstName,
      );
    }

    return { user, access_token };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; access_token: string }> {
    const { email, password } = loginDto;

    // Trouver le user par email (avec password car select: false dans entity)
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'phone',
        'role',
        'isVerified',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Générer JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Ne pas retourner le password
    delete user.password;

    return { user, access_token };
  }

  async validateUser(userId: number | string): Promise<User> {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    delete user.password;
    return user;
  }

  /**
   * Génère un token de réinitialisation de mot de passe et envoie un SMS
   * @param phoneNumber - Numéro de téléphone de l'utilisateur
   * @returns Token de réinitialisation
   */
  async requestPasswordResetBySMS(phoneNumber: string): Promise<string> {
    // Trouver l'utilisateur par numéro de téléphone
    const user = await this.userRepository.findOne({
      where: { phone: phoneNumber },
    });

    if (!user) {
      // Ne pas révéler si l'utilisateur existe ou non pour la sécurité
      // On génère quand même un token pour éviter l'énumération
      throw new UnauthorizedException('Invalid phone number');
    }

    // Générer un token de réinitialisation (valable 1h)
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    // Envoyer le SMS avec le lien de réinitialisation
    try {
      await this.smsService.sendPasswordResetSMS(phoneNumber, resetToken);
    } catch (error) {
      // Si l'envoi SMS échoue, on peut toujours envoyer par email en fallback
      // Pour l'instant, on lance l'erreur
      throw error;
    }

    return resetToken;
  }

  /**
   * Réinitialise le mot de passe avec un token
   * @param token - Token de réinitialisation
   * @param newPassword - Nouveau mot de passe
   */
  async resetPasswordByToken(
    token: string,
    newPassword: string,
  ): Promise<void> {
    try {
      // Vérifier et décoder le token
      const payload = this.jwtService.verify(token);
      
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Trouver l'utilisateur
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userRepository.save(user);
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid or expired token');
      }
      throw error;
    }
  }
}
