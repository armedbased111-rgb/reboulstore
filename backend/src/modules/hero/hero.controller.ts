import { Controller, Get } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Racine du processus (/app en Docker) : évite __dirname depuis dist/ qui pointait hors du conteneur
const SLIDES_PATH = join(process.cwd(), 'hero_slides.json');

@Controller('hero')
export class HeroController {
  @Get()
  getSlides() {
    try {
      if (!existsSync(SLIDES_PATH)) return [];
      return JSON.parse(readFileSync(SLIDES_PATH, 'utf-8'));
    } catch {
      return [];
    }
  }
}
