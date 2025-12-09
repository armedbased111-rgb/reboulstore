"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../../entities/product.entity");
const category_entity_1 = require("../../entities/category.entity");
const variant_entity_1 = require("../../entities/variant.entity");
const image_entity_1 = require("../../entities/image.entity");
const path_1 = require("path");
const fs_1 = require("fs");
let ProductsService = class ProductsService {
    productRepository;
    categoryRepository;
    variantRepository;
    imageRepository;
    constructor(productRepository, categoryRepository, variantRepository, imageRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.imageRepository = imageRepository;
    }
    async findAll(query) {
        const { category, minPrice, maxPrice, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = query;
        const where = {};
        if (category) {
            where.categoryId = category;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
        }
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['category', 'shop', 'images', 'variants'],
            order: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'shop', 'images', 'variants'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findByCategory(categoryId, query) {
        const { minPrice, maxPrice, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = query;
        const where = {
            categoryId,
        };
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
        }
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['category', 'shop', 'images', 'variants'],
            order: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async create(createProductDto) {
        const category = await this.categoryRepository.findOne({
            where: { id: createProductDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
        }
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (updateProductDto.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
            }
        }
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
    async findVariantsByProduct(productId) {
        await this.findOne(productId);
        return this.variantRepository.find({
            where: { productId },
            order: { color: 'ASC', size: 'ASC' },
        });
    }
    async findVariantById(id) {
        const variant = await this.variantRepository.findOne({
            where: { id },
            relations: ['product'],
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID ${id} not found`);
        }
        return variant;
    }
    async createVariant(productId, createVariantDto) {
        await this.findOne(productId);
        const existingVariant = await this.variantRepository.findOne({
            where: { sku: createVariantDto.sku },
        });
        if (existingVariant) {
            throw new common_1.BadRequestException(`Variant with SKU ${createVariantDto.sku} already exists`);
        }
        const variant = this.variantRepository.create({
            ...createVariantDto,
            productId,
        });
        return this.variantRepository.save(variant);
    }
    async updateVariant(id, updateVariantDto) {
        const variant = await this.findVariantById(id);
        if (updateVariantDto.sku) {
            const existingVariant = await this.variantRepository.findOne({
                where: { sku: updateVariantDto.sku },
            });
            if (existingVariant && existingVariant.id !== id) {
                throw new common_1.BadRequestException(`Variant with SKU ${updateVariantDto.sku} already exists`);
            }
        }
        Object.assign(variant, updateVariantDto);
        return this.variantRepository.save(variant);
    }
    async checkStock(variantId, quantity) {
        const variant = await this.findVariantById(variantId);
        return {
            available: variant.stock >= quantity,
            variantId: variant.id,
            currentStock: variant.stock,
            requestedQuantity: quantity,
        };
    }
    async updateStock(variantId, quantity) {
        const variant = await this.findVariantById(variantId);
        if (variant.stock + quantity < 0) {
            throw new common_1.BadRequestException('Stock insuffisant');
        }
        variant.stock += quantity;
        return this.variantRepository.save(variant);
    }
    async findImagesByProduct(productId) {
        await this.findOne(productId);
        return this.imageRepository.find({
            where: { productId },
            order: { order: 'ASC', createdAt: 'ASC' },
        });
    }
    async createImage(productId, file, createImageDto) {
        await this.findOne(productId);
        const fileUrl = `/uploads/${file.filename}`;
        const lastImage = await this.imageRepository.findOne({
            where: { productId },
            order: { order: 'DESC' },
        });
        const order = createImageDto.order ?? (lastImage ? lastImage.order + 1 : 0);
        const image = this.imageRepository.create({
            productId,
            url: fileUrl,
            alt: createImageDto.alt || null,
            order,
        });
        return this.imageRepository.save(image);
    }
    async deleteImage(id) {
        const image = await this.imageRepository.findOne({
            where: { id },
        });
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        const filePath = (0, path_1.join)(process.cwd(), image.url);
        if ((0, fs_1.existsSync)(filePath)) {
            (0, fs_1.unlinkSync)(filePath);
        }
        await this.imageRepository.remove(image);
    }
    async updateImageOrder(id, updateOrderDto) {
        const image = await this.imageRepository.findOne({
            where: { id },
        });
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        image.order = updateOrderDto.order;
        return this.imageRepository.save(image);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant)),
    __param(3, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map