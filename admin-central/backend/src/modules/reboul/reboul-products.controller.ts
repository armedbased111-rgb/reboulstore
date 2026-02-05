import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ReboulProductsService } from './reboul-products.service';
import { AdminJwtAuthGuard } from '../../shared/auth/admin-jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { AdminRole } from '../../shared/auth/admin-user.entity';

/**
 * Controller pour gérer les produits Reboul depuis l'Admin Centrale
 * 
 * Routes : /admin/reboul/products
 * 
 * ⚠️ Toutes les routes sont protégées par authentification admin
 */
@Controller('admin/reboul/products')
@UseGuards(AdminJwtAuthGuard, RolesGuard) // Protection JWT + vérification rôles
@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN) // Rôles autorisés
export class ReboulProductsController {
  constructor(private readonly productsService: ReboulProductsService) {}

  /**
   * GET /admin/reboul/products
   * Liste tous les produits Reboul avec pagination et filtres
   */
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const filters = {
      categoryId,
      brandId,
      search,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };

    return this.productsService.findAll(page, limit, filters);
  }

  /**
   * GET /admin/reboul/products/categories
   * Récupérer toutes les catégories pour les filtres
   */
  @Get('categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  /**
   * GET /admin/reboul/products/brands
   * Récupérer toutes les marques pour les filtres
   */
  @Get('brands')
  async getBrands() {
    return this.productsService.getBrands();
  }

  /**
   * GET /admin/reboul/products/stats
   * Statistiques produits Reboul
   */
  @Get('stats')
  async getStats() {
    return this.productsService.getStats();
  }

  /**
   * GET /admin/reboul/products/:id
   * Récupérer un produit Reboul par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * POST /admin/reboul/products/import-from-paste
   * Importer des produits depuis un tableau collé (Marque, Genre, Reference, Stock).
   */
  @Post('import-from-paste')
  async importFromPaste(@Body() body: { pastedText: string }) {
    if (!body?.pastedText || typeof body.pastedText !== 'string') {
      throw new BadRequestException('pastedText requis');
    }
    return this.productsService.importFromPaste(body.pastedText);
  }

  /**
   * POST /admin/reboul/products
   * Créer un nouveau produit Reboul
   * TODO: Implémenter DTOs complets dans prochaine étape
   */
  @Post()
  async create(@Body() createProductDto: any) {
    const { images, variants, ...productData } = createProductDto;
    if (images || variants) {
      return this.productsService.createWithImages(productData, images, variants);
    }
    return this.productsService.create(productData);
  }

  /**
   * PATCH /admin/reboul/products/:id
   * Mettre à jour un produit Reboul
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    const { images, variants, ...productData } = updateProductDto;
    if (images !== undefined || variants !== undefined) {
      return this.productsService.updateWithImages(id, productData, images, variants);
    }
    return this.productsService.update(id, productData);
  }

  /**
   * POST /admin/reboul/products/:id/images
   * Ajouter une image à un produit
   */
  @Post(':id/images')
  async addImage(
    @Param('id') productId: string,
    @Body() imageData: { url: string; publicId?: string; alt?: string; order: number },
  ) {
    return this.productsService.addImage(productId, imageData);
  }

  /**
   * DELETE /admin/reboul/products/:id/images/:imageId
   * Supprimer une image d'un produit
   */
  @Delete(':id/images/:imageId')
  async removeImage(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.removeImage(productId, imageId);
  }

  /**
   * PATCH /admin/reboul/products/:id/images/order
   * Mettre à jour l'ordre des images d'un produit
   */
  @Patch(':id/images/order')
  async updateImagesOrder(
    @Param('id') productId: string,
    @Body() body: { images: Array<{ id: string; order: number }> },
  ) {
    return this.productsService.updateImagesOrder(productId, body.images);
  }

  /**
   * DELETE /admin/reboul/products/:id
   * Supprimer un produit Reboul
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
