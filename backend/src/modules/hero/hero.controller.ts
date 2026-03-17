import { Controller, Get } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// En dev Docker : le backend est monté dans /app, hero_slides.json est à la racine du backend
const SLIDES_PATH = join(__dirname, '..', '..', '..', '..', 'hero_slides.json');

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
