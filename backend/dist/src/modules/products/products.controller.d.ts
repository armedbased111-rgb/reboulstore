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
    findImagesByProduct(id: number): Promise<import("../../entities/image.entity").Image[]>;
    createImage(productId: number, file: MulterFile | undefined, body: any): Promise<import("../../entities/image.entity").Image>;
    createImagesBulk(productId: number, files: MulterFile[] | undefined, body: any, ordersQuery?: string): Promise<import("../../entities/image.entity").Image[]>;
    deleteImage(productId: number, imageId: number): Promise<void>;
    updateImageOrder(productId: number, imageId: number, updateOrderDto: UpdateImageOrderDto): Promise<import("../../entities/image.entity").Image>;
    create(createProductDto: CreateProductDto): Promise<import("../../entities/product.entity").Product>;
    findAll(query: ProductQueryDto): Promise<{}>;
    findVariantsByProduct(id: number): Promise<import("../../entities/variant.entity").Variant[]>;
    findOne(id: number): Promise<import("../../entities/product.entity").Product>;
    findByCategory(categoryId: number, query: ProductQueryDto): Promise<{
        products: import("../../entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<import("../../entities/product.entity").Product>;
    remove(id: number): Promise<void>;
    findVariantById(productId: number, variantId: number): Promise<import("../../entities/variant.entity").Variant>;
    createVariant(productId: number, createVariantDto: CreateVariantDto): Promise<import("../../entities/variant.entity").Variant>;
    updateVariant(productId: number, variantId: number, updateVariantDto: UpdateVariantDto): Promise<import("../../entities/variant.entity").Variant>;
    checkStock(productId: number, variantId: number, quantity: string): Promise<{
        available: boolean;
        variantId: number;
        currentStock: number;
        requestedQuantity: number;
    }>;
}
export {};
