import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageOrderDto } from './dto/update-image-order.dto';

// Type pour les fichiers uploadés (basé sur multer)
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Images Endpoints
  @Get(':id/images')
  findImagesByProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findImagesByProduct(id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @HttpCode(HttpStatus.CREATED)
  createImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file: MulterFile | undefined,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Convertir order en nombre si présent (form-data envoie tout en string)
    const createImageDto: CreateImageDto = {
      alt: body.alt,
      order: body.order ? Number(body.order) : undefined,
    };

    return this.productsService.createImage(productId, file, createImageDto);
  }

  @Post(':id/images/bulk')
  @UseInterceptors(FilesInterceptor('files', 7, multerConfig))
  @HttpCode(HttpStatus.CREATED)
  createImagesBulk(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFiles() files: MulterFile[] | undefined,
    @Body() body: any,
    @Query('orders') ordersQuery?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    if (files.length > 7) {
      throw new BadRequestException('You can upload up to 7 images at once');
    }

    const altsRaw = body.alts ?? body['alts[]'];
    const ordersRaw =
      ordersQuery !== undefined && ordersQuery !== ''
        ? ordersQuery.split(',').map((s) => s.trim())
        : body.orders ?? body['orders[]'];

    const altsArray: (string | undefined)[] = Array.isArray(altsRaw)
      ? altsRaw
      : altsRaw
      ? [altsRaw]
      : [];

    const ordersArray: (number | undefined)[] = Array.isArray(ordersRaw)
      ? ordersRaw.map((value: string) =>
          value !== undefined && value !== null && value !== ''
            ? Number(value)
            : undefined,
        )
      : ordersRaw
      ? [
          ordersRaw !== ''
            ? Number(ordersRaw as string)
            : undefined,
        ]
      : [];

    const createImageDtos: CreateImageDto[] = files.map((_, index) => ({
      alt: altsArray[index],
      order: ordersArray[index],
    }));

    return this.productsService.createImagesBulk(
      productId,
      files,
      createImageDtos,
    );
  }

  @Delete(':productId/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productsService.deleteImage(imageId);
  }

  @Patch(':productId/images/:imageId/order')
  updateImageOrder(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() updateOrderDto: UpdateImageOrderDto,
  ) {
    return this.productsService.updateImageOrder(imageId, updateOrderDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }
  // Variants Endpoints
  @Get(':id/variants')
  findVariantsByProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findVariantsByProduct(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.findByCategory(categoryId, query);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  // Variants Endpoints
  @Get(':productId/variants/:variantId')
  findVariantById(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ) {
    return this.productsService.findVariantById(variantId);
  }

  @Post(':id/variants')
  @HttpCode(HttpStatus.CREATED)
  createVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.productsService.createVariant(productId, createVariantDto);
  }

  @Patch(':productId/variants/:variantId')
  updateVariant(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(variantId, updateVariantDto);
  }

  @Get(':productId/variants/:variantId/stock')
  checkStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Query('quantity') quantity: string,
  ) {
    const quantityNum = +quantity;
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      throw new BadRequestException('Quantity must be a positive number');
    }
    return this.productsService.checkStock(variantId, quantityNum);
  }
}
