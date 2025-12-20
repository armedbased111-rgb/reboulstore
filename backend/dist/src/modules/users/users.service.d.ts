import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Address } from '../../entities/address.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class UsersService {
    private userRepository;
    private addressRepository;
    constructor(userRepository: Repository<User>, addressRepository: Repository<Address>);
    findOne(userId: string): Promise<User>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    getAddresses(userId: string): Promise<Address[]>;
    createAddress(userId: string, createAddressDto: CreateAddressDto): Promise<Address>;
    getAddress(userId: string, addressId: string): Promise<Address>;
    updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto): Promise<Address>;
    deleteAddress(userId: string, addressId: string): Promise<void>;
}
