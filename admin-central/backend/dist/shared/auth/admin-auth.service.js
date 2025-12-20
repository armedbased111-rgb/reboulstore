"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const admin_user_entity_1 = require("./admin-user.entity");
let AdminAuthService = class AdminAuthService {
    adminUserRepository;
    jwtService;
    constructor(adminUserRepository, jwtService) {
        this.adminUserRepository = adminUserRepository;
        this.jwtService = jwtService;
    }
    async register(email, password, firstName, lastName, role = admin_user_entity_1.AdminRole.ADMIN) {
        const existingUser = await this.adminUserRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Cet email est déjà utilisé');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = this.adminUserRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            isActive: true,
        });
        const savedUser = await this.adminUserRepository.save(adminUser);
        const { password: _, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
    async login(email, password) {
        const adminUser = await this.adminUserRepository
            .createQueryBuilder('admin')
            .addSelect('admin.password')
            .where('admin.email = :email', { email })
            .getOne();
        if (!adminUser) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        if (!adminUser.isActive) {
            throw new common_1.UnauthorizedException('Ce compte administrateur est désactivé');
        }
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const payload = {
            sub: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
        };
        const token = this.jwtService.sign(payload);
        const { password: _, ...userWithoutPassword } = adminUser;
        return {
            user: userWithoutPassword,
            accessToken: token,
        };
    }
    async validateUser(userId) {
        const adminUser = await this.adminUserRepository.findOne({
            where: { id: userId, isActive: true },
        });
        if (!adminUser) {
            return null;
        }
        const { password: _, ...userWithoutPassword } = adminUser;
        return userWithoutPassword;
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_user_entity_1.AdminUser, 'reboul')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map