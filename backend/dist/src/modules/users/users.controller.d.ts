import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("../../entities/user.entity").User>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("../../entities/user.entity").User>;
    getAddresses(req: any): Promise<import("../../entities/address.entity").Address[]>;
    createAddress(req: any, createAddressDto: CreateAddressDto): Promise<import("../../entities/address.entity").Address>;
    getAddress(req: any, addressId: number): Promise<import("../../entities/address.entity").Address>;
    updateAddress(req: any, addressId: number, updateAddressDto: UpdateAddressDto): Promise<import("../../entities/address.entity").Address>;
    deleteAddress(req: any, addressId: number): Promise<{
        message: string;
    }>;
}
