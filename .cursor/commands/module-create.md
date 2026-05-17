# module-create

**Commande** : `/module-create [nom]`

Créer un nouveau module NestJS complet dans Reboul Store.

## 🎯 Workflow de création

### 1. Créer la structure du module

**Dossier** : `backend/src/modules/[nom-module]/`

**Fichiers à créer :**
- `[nom-module].module.ts` : Module NestJS
- `[nom-module].service.ts` : Service (logique métier)
- `[nom-module].controller.ts` : Controller (endpoints API)
- `dto/` : Dossier pour les DTOs

### 2. Créer le Module

**Fichier** : `[nom-module].module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NomModuleService } from './nom-module.service';
import { NomModuleController } from './nom-module.controller';
import { NomEntity } from '../../entities/nom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NomEntity])],
  controllers: [NomModuleController],
  providers: [NomModuleService],
  exports: [NomModuleService],
})
export class NomModuleModule {}
```

### 3. Créer le Service

**Fichier** : `[nom-module].service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NomEntity } from '../../entities/nom.entity';
import { CreateNomDto } from './dto/create-nom.dto';
import { UpdateNomDto } from './dto/update-nom.dto';

@Injectable()
export class NomModuleService {
  constructor(
    @InjectRepository(NomEntity)
    private readonly nomRepository: Repository<NomEntity>,
  ) {}

  async create(createDto: CreateNomDto): Promise<NomEntity> {
    const entity = this.nomRepository.create(createDto);
    return this.nomRepository.save(entity);
  }

  async findAll(): Promise<NomEntity[]> {
    return this.nomRepository.find();
  }

  async findOne(id: string): Promise<NomEntity> {
    const entity = await this.nomRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, updateDto: UpdateNomDto): Promise<NomEntity> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.nomRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.nomRepository.remove(entity);
  }
}
```

### 4. Créer le Controller

**Fichier** : `[nom-module].controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NomModuleService } from './nom-module.service';
import { CreateNomDto } from './dto/create-nom.dto';
import { UpdateNomDto } from './dto/update-nom.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('nom-module')
export class NomModuleController {
  constructor(private readonly nomModuleService: NomModuleService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Si route protégée
  create(@Body() createDto: CreateNomDto) {
    return this.nomModuleService.create(createDto);
  }

  @Get()
  findAll() {
    return this.nomModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nomModuleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Si route protégée
  update(@Param('id') id: string, @Body() updateDto: UpdateNomDto) {
    return this.nomModuleService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Si route protégée
  remove(@Param('id') id: string) {
    return this.nomModuleService.remove(id);
  }
}
```

### 5. Créer les DTOs

**Fichier** : `dto/create-nom.dto.ts`

```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
```

**Fichier** : `dto/update-nom.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateNomDto } from './create-nom.dto';

export class UpdateNomDto extends PartialType(CreateNomDto) {}
```

### 6. Créer l'Entité (si nécessaire)

**Fichier** : `backend/src/entities/nom.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('noms')
export class NomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 7. Enregistrer le module

**Fichier** : `backend/src/app.module.ts`

```typescript
import { NomModuleModule } from './modules/nom-module/nom-module.module';

@Module({
  imports: [
    // ... autres modules
    NomModuleModule,
  ],
  // ...
})
export class AppModule {}
```

## 📁 Structure complète

```
backend/src/modules/[nom-module]/
├── [nom-module].module.ts
├── [nom-module].service.ts
├── [nom-module].controller.ts
└── dto/
    ├── create-nom.dto.ts
    └── update-nom.dto.ts
```

## 🔌 Endpoints générés

- `GET /nom-module` : Liste tous
- `GET /nom-module/:id` : Détail d'un
- `POST /nom-module` : Créer (protégé)
- `PATCH /nom-module/:id` : Mettre à jour (protégé)
- `DELETE /nom-module/:id` : Supprimer (protégé)

## ✅ Checklist création

- [ ] Dossier module créé
- [ ] Module créé et configuré
- [ ] Service créé avec méthodes CRUD
- [ ] Controller créé avec endpoints
- [ ] DTOs créés (Create, Update)
- [ ] Entité créée si nécessaire
- [ ] Module enregistré dans `app.module.ts`
- [ ] Endpoints testés
- [ ] obsidian-vault/Projet/roadmap.md mis à jour
- [ ] backend/BACKEND.md mis à jour
- [ ] API_CONFIG.md mis à jour

## 🚀 CLI Python - Génération automatique

**⭐ RECOMMANDÉ** : Utiliser le CLI Python pour générer automatiquement les modules :

```bash
# Module complet (Entity + DTOs + Service + Controller + Module)
python cli/main.py code generate module FeatureName --full

# Composants individuels
python cli/main.py code generate entity Category
python cli/main.py code generate dto Product create
python cli/main.py code generate service Product
python cli/main.py code generate controller Product
```

**Gain de temps** : 60min → 5min (**92% de gain**)

Le CLI génère automatiquement :
- ✅ Entité TypeORM avec relations
- ✅ DTOs (Create, Update) avec validation
- ✅ Service avec méthodes CRUD
- ✅ Controller avec endpoints REST
- ✅ Module avec configuration TypeORM
- ✅ Enregistrement dans `app.module.ts`

Voir `/cli-workflow` pour le guide complet du CLI.

## 🔗 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python ⭐ **NOUVEAU**
- `/backend-workflow` : Workflow backend complet
- `/getcontext` : Recherche de contexte

## 📚 Documentation de référence

- **backend/BACKEND.md** : Documentation complète backend
- **API_CONFIG.md** : Configuration API

