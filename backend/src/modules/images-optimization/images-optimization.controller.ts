import { Controller, Post, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ImagesOptimizationService, OptimizationStats } from './images-optimization.service';

/**
 * Controller pour l'optimisation d'images
 * 
 * Permet de déclencher manuellement l'optimisation ou de consulter les stats
 */
@Controller('images-optimization')
export class ImagesOptimizationController {
  constructor(
    private readonly optimizationService: ImagesOptimizationService,
  ) {}

  /**
   * POST /images-optimization/optimize-all
   * Optimiser toutes les images non optimisées
   */
  @Post('optimize-all')
  async optimizeAll(@Query('limit') limit?: number): Promise<OptimizationStats> {
    return this.optimizationService.optimizeAllImages(limit);
  }

  /**
   * POST /images-optimization/optimize-new
   * Optimiser les nouvelles images (depuis une date)
   */
  @Post('optimize-new')
  async optimizeNew(@Query('since') since?: string): Promise<OptimizationStats> {
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Dernières 24h par défaut
    return this.optimizationService.optimizeNewImages(sinceDate);
  }
}

