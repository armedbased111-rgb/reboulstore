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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageOrderDto } from './dto/update-image-order.dto';

// Type pour les fichiers uploadés (basé sur multer)
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
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
  findImagesByProduct(@Param('id') id: string) {
    return this.productsService.findImagesByProduct(id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @HttpCode(HttpStatus.CREATED)
  createImage(
    @Param('id') productId: string,
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

  @Delete(':productId/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.deleteImage(imageId);
  }

  @Patch(':productId/images/:imageId/order')
  updateImageOrder(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
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
    findVariantsByProduct(@Param('id') id: string) {
        return this.productsService.findVariantsByProduct(id);
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.findByCategory(categoryId, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // Variants Endpoints
  @Get(':productId/variants/:variantId')
  findVariantById(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.findVariantById(variantId);
  }

  @Post(':id/variants')
  @HttpCode(HttpStatus.CREATED)
  createVariant(
    @Param('id') productId: string,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.productsService.createVariant(productId, createVariantDto);
  }

  @Patch(':productId/variants/:variantId')
  updateVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(variantId, updateVariantDto);
  }

  @Get(':productId/variants/:variantId/stock')
  checkStock(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Query('quantity') quantity: string,
  ) {
    const quantityNum = +quantity;
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      throw new BadRequestException(
        'Quantity must be a positive number',
      );
    }
    return this.productsService.checkStock(variantId, quantityNum);
  }
}