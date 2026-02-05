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
    findOne(userId: number): Promise<User>;
    updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<User>;
    getAddresses(userId: number): Promise<Address[]>;
    createAddress(userId: number, createAddressDto: CreateAddressDto): Promise<Address>;
    getAddress(userId: number, addressId: number): Promise<Address>;
    updateAddress(userId: number, addressId: number, updateAddressDto: UpdateAddressDto): Promise<Address>;
    deleteAddress(userId: number, addressId: number): Promise<void>;
}
