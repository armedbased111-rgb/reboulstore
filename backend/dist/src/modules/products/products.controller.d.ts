import { UpdateImageOrderDto } from './dto/update-image-order.dto';
interface MulterFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
}
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findImagesByProduct(id: string): Promise<import("../../entities/image.entity").Image[]>;
    createImage(productId: string, file: MulterFile | undefined, body: any): Promise<import("../../entities/image.entity").Image>;
    createImagesBulk(productId: string, files: MulterFile[] | undefined, body: any): Promise<import("../../entities/image.entity").Image[]>;
    deleteImage(productId: string, imageId: string): Promise<void>;
    updateImageOrder(productId: string, imageId: string, updateOrderDto: UpdateImageOrderDto): Promise<import("../../entities/image.entity").Image>;
    create(createProductDto: CreateProductDto): Promise<import("../../entities/product.entity").Product>;
    findAll(query: ProductQueryDto): Promise<{}>;
    findVariantsByProduct(id: string): Promise<import("../../entities/variant.entity").Variant[]>;
    findOne(id: string): Promise<import("../../entities/product.entity").Product>;
    findByCategory(categoryId: string, query: ProductQueryDto): Promise<{
        products: import("../../entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../../entities/product.entity").Product>;
    remove(id: string): Promise<void>;
    findVariantById(productId: string, variantId: string): Promise<import("../../entities/variant.entity").Variant>;
    createVariant(productId: string, createVariantDto: CreateVariantDto): Promise<import("../../entities/variant.entity").Variant>;
    updateVariant(productId: string, variantId: string, updateVariantDto: UpdateVariantDto): Promise<import("../../entities/variant.entity").Variant>;
    checkStock(productId: string, variantId: string, quantity: string): Promise<{
        available: boolean;
        variantId: string;
        currentStock: number;
        requestedQuantity: number;
    }>;
}
export {};
