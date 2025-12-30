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
const collection_entity_1 = require("../../entities/collection.entity");
const variant_entity_1 = require("../../entities/variant.entity");
const image_entity_1 = require("../../entities/image.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ProductsService = class ProductsService {
    productRepository;
    categoryRepository;
    variantRepository;
    imageRepository;
    collectionRepository;
    cloudinaryService;
    constructor(productRepository, categoryRepository, variantRepository, imageRepository, collectionRepository, cloudinaryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.imageRepository = imageRepository;
        this.collectionRepository = collectionRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async findAll(query) {
        const { category, brand, minPrice, maxPrice, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = query;
        const activeCollection = await this.collectionRepository.findOne({
            where: { isActive: true },
        });
        if (!activeCollection) {
            return {
                products: [],
                total: 0,
                page,
                limit,
                totalPages: 0,
            };
        }
        const where = {
            collectionId: activeCollection.id,
        };
        if (category) {
            where.categoryId = category;
        }
        if (brand) {
            where.brandId = brand;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
        }
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['category', 'shop', 'brand', 'collection', 'images', 'variants'],
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
            relations: ['category', 'shop', 'brand', 'collection', 'images', 'variants'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findByCategory(categoryId, query) {
        const { minPrice, maxPrice, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = query;
        const activeCollection = await this.collectionRepository.findOne({
            where: { isActive: true },
        });
        if (!activeCollection) {
            return {
                products: [],
                total: 0,
                page,
                limit,
                totalPages: 0,
            };
        }
        const where = {
            categoryId,
            collectionId: activeCollection.id,
        };
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
        }
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['category', 'shop', 'brand', 'collection', 'images', 'variants'],
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
        let collectionId = createProductDto.collectionId;
        if (!collectionId) {
            const activeCollection = await this.collectionRepository.findOne({
                where: { isActive: true },
            });
            if (activeCollection) {
                collectionId = activeCollection.id;
            }
            else {
                throw new common_1.BadRequestException('No active collection found. Please activate a collection first.');
            }
        }
        else {
            const collection = await this.collectionRepository.findOne({
                where: { id: collectionId },
            });
            if (!collection) {
                throw new common_1.NotFoundException(`Collection with ID ${collectionId} not found`);
            }
        }
        const product = this.productRepository.create({
            ...createProductDto,
            collectionId,
        });
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
        if (updateProductDto.collectionId) {
            const collection = await this.collectionRepository.findOne({
                where: { id: updateProductDto.collectionId },
            });
            if (!collection) {
                throw new common_1.NotFoundException(`Collection with ID ${updateProductDto.collectionId} not found`);
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
        const uploadResult = await this.cloudinaryService.uploadImage({
            buffer: file.buffer,
            mimetype: file.mimetype,
            originalname: file.originalname,
        }, {
            folder: 'products',
        });
        const lastImage = await this.imageRepository.findOne({
            where: { productId },
            order: { order: 'DESC' },
        });
        const order = createImageDto.order ?? (lastImage ? lastImage.order + 1 : 0);
        const image = this.imageRepository.create({
            productId,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            alt: createImageDto.alt || null,
            order,
        });
        return this.imageRepository.save(image);
    }
    async createImagesBulk(productId, files, createImageDtos) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one image file is required');
        }
        if (files.length > 7) {
            throw new common_1.BadRequestException('You can upload up to 7 images at once');
        }
        await this.findOne(productId);
        const lastImage = await this.imageRepository.findOne({
            where: { productId },
            order: { order: 'DESC' },
        });
        let nextOrder = lastImage ? lastImage.order + 1 : 0;
        const createdImages = [];
        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const dto = createImageDtos[i] ?? {};
            if (file.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException(`File ${file.originalname} exceeds the 10MB size limit`);
            }
            const uploadResult = await this.cloudinaryService.uploadImage({
                buffer: file.buffer,
                mimetype: file.mimetype,
                originalname: file.originalname,
            }, {
                folder: 'products',
            });
            const order = dto.order !== undefined && dto.order !== null
                ? dto.order
                : nextOrder;
            if (dto.order === undefined || dto.order === null) {
                nextOrder += 1;
            }
            const image = this.imageRepository.create({
                productId,
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                alt: dto.alt || null,
                order,
            });
            const savedImage = await this.imageRepository.save(image);
            createdImages.push(savedImage);
        }
        return createdImages;
    }
    async deleteImage(id) {
        const image = await this.imageRepository.findOne({
            where: { id },
        });
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${id} not found`);
        }
        if (image.publicId) {
            await this.cloudinaryService.deleteImage(image.publicId);
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
    __param(4, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], ProductsService);
//# sourceMappingURL=products.service.js.map