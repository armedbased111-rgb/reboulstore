import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // Toutes les routes sont protégées
export class UsersController {
  constructor(private usersService: UsersService) {}

  // === GESTION PROFIL ===

  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  // === GESTION ADRESSES ===

  @Get('me/addresses')
  async getAddresses(@Request() req) {
    return this.usersService.getAddresses(req.user.id);
  }

  @Post('me/addresses')
  async createAddress(
    @Request() req,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.usersService.createAddress(req.user.id, createAddressDto);
  }

  @Get('me/addresses/:id')
  async getAddress(@Request() req, @Param('id') addressId: string) {
    return this.usersService.getAddress(req.user.id, addressId);
  }

  @Patch('me/addresses/:id')
  async updateAddress(
    @Request() req,
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(
      req.user.id,
      addressId,
      updateAddressDto,
    );
  }

  @Delete('me/addresses/:id')
  async deleteAddress(@Request() req, @Param('id') addressId: string) {
    await this.usersService.deleteAddress(req.user.id, addressId);
    return { message: 'Address deleted successfully' };
  }
}
