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
exports.ReboulProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("./entities/category.entity");
const variant_entity_1 = require("./entities/variant.entity");
const image_entity_1 = require("./entities/image.entity");
const brand_entity_1 = require("./entities/brand.entity");
const collection_entity_1 = require("./entities/collection.entity");
let ReboulProductsService = class ReboulProductsService {
    productRepository;
    categoryRepository;
    variantRepository;
    imageRepository;
    brandRepository;
    collectionRepository;
    constructor(productRepository, categoryRepository, variantRepository, imageRepository, brandRepository, collectionRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.imageRepository = imageRepository;
        this.brandRepository = brandRepository;
        this.collectionRepository = collectionRepository;
    }
    async findAll(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.categoryId != null) {
            where.categoryId = Number(filters.categoryId);
        }
        if (filters?.brandId != null) {
            where.brandId = Number(filters.brandId);
        }
        if (filters?.search) {
            where.name = (0, typeorm_2.ILike)(`%${filters.search}%`);
        }
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(filters.minPrice ?? 0, filters.maxPrice ?? Number.MAX_SAFE_INTEGER);
        }
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['category', 'brand', 'images', 'variants'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const numId = Number(id);
        const product = await this.productRepository.findOne({
            where: { id: numId },
            relations: ['category', 'brand', 'images', 'variants'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Produit avec l'ID ${id} non trouvé`);
        }
        return product;
    }
    async create(productData) {
        if (productData.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: productData.categoryId },
            });
            if (!category) {
                throw new common_1.BadRequestException(`Catégorie avec l'ID ${productData.categoryId} non trouvée`);
            }
        }
        if (productData.brandId) {
            const brand = await this.brandRepository.findOne({
                where: { id: productData.brandId },
            });
            if (!brand) {
                throw new common_1.BadRequestException(`Marque avec l'ID ${productData.brandId} non trouvée`);
            }
        }
        let collectionId = productData.collectionId;
        if (!collectionId) {
            const activeCollection = await this.collectionRepository.findOne({
                where: { isActive: true },
            });
            if (activeCollection) {
                collectionId = activeCollection.id;
            }
            else {
                throw new common_1.BadRequestException('Aucune collection active trouvée. Veuillez activer une collection d\'abord.');
            }
        }
        else {
            const collection = await this.collectionRepository.findOne({
                where: { id: collectionId },
            });
            if (!collection) {
                throw new common_1.BadRequestException(`Collection avec l'ID ${collectionId} non trouvée`);
            }
        }
        const product = this.productRepository.create({
            ...productData,
            collectionId,
        });
        return this.productRepository.save(product);
    }
    async update(id, updateData) {
        const product = await this.findOne(id);
        Object.assign(product, updateData);
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
        return { message: `Produit ${id} supprimé avec succès` };
    }
    async getCategories() {
        return this.categoryRepository.find({
            order: { name: 'ASC' },
        });
    }
    async getBrands() {
        return this.brandRepository.find({
            order: { name: 'ASC' },
        });
    }
    async getStats() {
        const total = await this.productRepository.count();
        const withStock = await this.productRepository
            .createQueryBuilder('product')
            .innerJoin('product.variants', 'variant')
            .where('variant.stock > 0')
            .getCount();
        return {
            total,
            withStock,
            outOfStock: total - withStock,
        };
    }
    async addImage(productId, imageData) {
        const product = await this.findOne(productId);
        const image = this.imageRepository.create({
            productId: product.id,
            url: imageData.url,
            publicId: imageData.publicId || null,
            alt: imageData.alt || null,
            order: imageData.order,
        });
        return this.imageRepository.save(image);
    }
    async removeImage(productId, imageId) {
        const product = await this.findOne(productId);
        const numImageId = Number(imageId);
        const image = await this.imageRepository.findOne({
            where: { id: numImageId, productId: product.id },
        });
        if (!image) {
            throw new common_1.NotFoundException(`Image avec l'ID ${imageId} non trouvée pour ce produit`);
        }
        await this.imageRepository.remove(image);
        return { message: 'Image supprimée avec succès' };
    }
    async updateImagesOrder(productId, images) {
        const product = await this.findOne(productId);
        await Promise.all(images.map((img) => this.imageRepository.update({ id: Number(img.id), productId: product.id }, { order: img.order })));
        return this.findOne(product.id);
    }
    async createWithImages(productData, images, variants) {
        const product = await this.create(productData);
        if (images && images.length > 0) {
            await Promise.all(images.map((img) => this.addImage(product.id, img)));
        }
        if (variants && variants.length > 0) {
            for (const variant of variants) {
                const variantEntity = this.variantRepository.create({
                    productId: product.id,
                    color: variant.color,
                    size: variant.size,
                    stock: variant.stock,
                    sku: variant.sku,
                });
                await this.variantRepository.save(variantEntity);
            }
        }
        return this.findOne(product.id);
    }
    async updateWithImages(id, updateData, images, variants) {
        await this.update(id, updateData);
        const product = await this.findOne(id);
        if (images !== undefined) {
            const existingImages = product.images || [];
            const newImageIds = images.filter((img) => img.id != null).map((img) => Number(img.id));
            const imagesToDelete = existingImages.filter((img) => !newImageIds.includes(img.id));
            if (imagesToDelete.length > 0) {
                await Promise.all(imagesToDelete.map((img) => this.imageRepository.remove(img)));
            }
            await Promise.all(images.map(async (img) => {
                if (img.id != null) {
                    await this.imageRepository.update({ id: Number(img.id), productId: product.id }, { url: img.url, publicId: img.publicId || null, alt: img.alt || null, order: img.order });
                }
                else {
                    await this.addImage(product.id, img);
                }
            }));
        }
        if (variants !== undefined) {
            const existingVariants = product.variants || [];
            const newVariantIds = variants.filter((v) => v.id != null).map((v) => Number(v.id));
            const variantsToDelete = existingVariants.filter((v) => !newVariantIds.includes(v.id));
            if (variantsToDelete.length > 0) {
                await Promise.all(variantsToDelete.map((v) => this.variantRepository.remove(v)));
            }
            await Promise.all(variants.map(async (variant) => {
                if (variant.id != null) {
                    const existingVariant = await this.variantRepository.findOne({
                        where: { id: Number(variant.id), productId: product.id },
                    });
                    if (existingVariant) {
                        existingVariant.color = variant.color;
                        existingVariant.size = variant.size;
                        existingVariant.stock = variant.stock;
                        existingVariant.sku = variant.sku;
                        await this.variantRepository.save(existingVariant);
                    }
                }
                else {
                    const variantEntity = this.variantRepository.create({
                        productId: product.id,
                        color: variant.color,
                        size: variant.size,
                        stock: variant.stock,
                        sku: variant.sku,
                    });
                    await this.variantRepository.save(variantEntity);
                }
            }));
        }
        return this.findOne(product.id);
    }
    async importFromPaste(pastedText) {
        const errors = [];
        let created = 0;
        const lines = pastedText
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        if (lines.length === 0) {
            throw new common_1.BadRequestException('Aucune ligne à importer.');
        }
        const detectDelimiter = (line) => {
            if (line.includes('\t'))
                return '\t';
            if (line.includes(';'))
                return ';';
            return ',';
        };
        const delimiter = detectDelimiter(lines[0]);
        const splitRow = (line) => line.split(delimiter).map((c) => c.trim());
        const headerRow = splitRow(lines[0]).map((c) => c.toLowerCase());
        const iMarque = headerRow.findIndex((h) => /marque/i.test(h));
        const iGenre = headerRow.findIndex((h) => /genre/i.test(h));
        const iRef = headerRow.findIndex((h) => /reference|référence/i.test(h));
        const iStock = headerRow.findIndex((h) => /stock/i.test(h));
        const hasHeader = [iMarque, iGenre, iRef, iStock].some((i) => i >= 0);
        const dataStart = hasHeader && lines.length > 1 ? 1 : 0;
        const col = (row, i, fallback) => (i >= 0 ? row[i] : row[fallback])?.trim() ?? '';
        const getMarque = (row) => col(row, iMarque, 0);
        const getGenre = (row) => col(row, iGenre, 1);
        const getRef = (row) => col(row, iRef, 2);
        const getStock = (row) => col(row, iStock, 3);
        const activeCollection = await this.collectionRepository.findOne({ where: { isActive: true } });
        if (!activeCollection) {
            throw new common_1.BadRequestException('Aucune collection active. Activez une collection dans Admin > Collections.');
        }
        for (let r = dataStart; r < lines.length; r++) {
            const row = splitRow(lines[r]);
            const marque = getMarque(row);
            const genre = getGenre(row);
            const reference = getRef(row);
            const stockStr = getStock(row);
            if (!reference) {
                errors.push({ row: r + 1, message: 'Reference manquante' });
                continue;
            }
            const stock = parseInt(stockStr, 10);
            if (isNaN(stock) || stock < 0) {
                errors.push({ row: r + 1, message: `Stock invalide: ${stockStr}` });
                continue;
            }
            let categoryId;
            if (genre) {
                const cat = await this.categoryRepository.findOne({
                    where: { name: (0, typeorm_2.ILike)(genre) },
                });
                if (!cat) {
                    errors.push({ row: r + 1, message: `Catégorie non trouvée: "${genre}"` });
                    continue;
                }
                categoryId = cat.id;
            }
            else {
                errors.push({ row: r + 1, message: 'Genre (catégorie) manquant' });
                continue;
            }
            let brandId = null;
            if (marque) {
                const brand = await this.brandRepository.findOne({
                    where: { name: (0, typeorm_2.ILike)(marque) },
                });
                if (brand)
                    brandId = brand.id;
            }
            const size = reference.split(/[- ]/).pop() || reference;
            const sku = reference;
            const existingSku = await this.variantRepository.findOne({ where: { sku } });
            if (existingSku) {
                errors.push({ row: r + 1, message: `SKU déjà existant: ${sku}` });
                continue;
            }
            try {
                const product = await this.create({
                    name: reference,
                    price: 0,
                    categoryId,
                    brandId,
                    collectionId: activeCollection.id,
                    reference,
                });
                const variantEntity = this.variantRepository.create({
                    productId: product.id,
                    color: '—',
                    size,
                    stock,
                    sku,
                });
                await this.variantRepository.save(variantEntity);
                created++;
            }
            catch (e) {
                errors.push({ row: r + 1, message: e?.message || 'Erreur création produit' });
            }
        }
        return { created, errors };
    }
};
exports.ReboulProductsService = ReboulProductsService;
exports.ReboulProductsService = ReboulProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product, 'reboul')),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category, 'reboul')),
    __param(2, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant, 'reboul')),
    __param(3, (0, typeorm_1.InjectRepository)(image_entity_1.Image, 'reboul')),
    __param(4, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand, 'reboul')),
    __param(5, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection, 'reboul')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReboulProductsService);
//# sourceMappingURL=reboul-products.service.js.map