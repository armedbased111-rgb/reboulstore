import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { logEvent } from '../../common/log-event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; access_token: string }> {
    const { email, password } = loginDto;

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
      logEvent(this.logger, 'warn', {
        event: 'auth_login_failed',
        email,
        reason: 'user_not_found',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logEvent(this.logger, 'warn', {
        event: 'auth_login_failed',
        email,
        reason: 'invalid_password',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

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
}
