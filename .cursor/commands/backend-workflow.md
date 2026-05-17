# backend-workflow

**Commande** : `/backend-workflow`

Workflow complet pour développer des fonctionnalités backend dans Reboul Store.

## 🎯 Workflow général Backend

### 1. Avant de commencer

1. ✅ **Consulter obsidian-vault/Projet/roadmap.md** pour identifier la phase/tâche
2. ✅ **Consulter CONTEXT.md** pour l'état actuel
3. ✅ **Consulter backend/BACKEND.md** pour la documentation backend
4. ✅ **Consulter API_CONFIG.md** pour les endpoints et configuration
5. ✅ **Vérifier les règles** dans `.cursor/rules/project-rules.mdc`

### 2. Mode de développement

**Mode pédagogique (par défaut) :**
- Tu ne codes pas, tu m'apprends
- Processus : Explication → Tu codes → Vérification → Correction ensemble

### 3. Structure des fichiers backend

```
backend/src/
├── modules/           # Modules NestJS (features)
│   ├── auth/         # Authentification
│   ├── products/     # Produits
│   ├── orders/       # Commandes
│   └── ...
├── entities/         # Entités TypeORM
│   ├── product.entity.ts
│   ├── order.entity.ts
│   └── ...
├── config/           # Configuration (database, email, etc.)
└── main.ts           # Point d'entrée
```

## 📦 Créer un module NestJS

### 🚀 Option 1 : Utiliser le CLI Python (RECOMMANDÉ)

**⭐ Gain de temps : 60min → 5min (92% de gain)**

```bash
# Générer un module complet (Entity + DTOs + Service + Controller + Module)
python cli/main.py code generate module FeatureName --full

# Ou générer les composants individuellement
python cli/main.py code generate entity Category
python cli/main.py code generate dto Product create
python cli/main.py code generate service Product
python cli/main.py code generate controller Product
```

Le CLI génère automatiquement :
- ✅ Entité TypeORM avec relations
- ✅ DTOs (Create, Update) avec validation class-validator
- ✅ Service avec méthodes CRUD et gestion d'erreurs
- ✅ Controller avec endpoints REST complets
- ✅ Module avec configuration TypeORM
- ✅ Enregistrement automatique dans `app.module.ts`

Voir `/cli-workflow` pour le guide complet.

### Option 2 : Création manuelle

1. **Créer le dossier** : `backend/src/modules/[nom-module]/`

2. **Créer les fichiers** :
   - `[nom-module].module.ts` : Module NestJS
   - `[nom-module].service.ts` : Logique métier
   - `[nom-module].controller.ts` : Endpoints API
   - `dto/` : Data Transfer Objects

3. **Créer l'entité** si nécessaire : `backend/src/entities/[nom].entity.ts`

4. **Enregistrer le module** : `backend/src/app.module.ts`

5. **Mettre à jour obsidian-vault/Projet/roadmap.md** ✅

### Template Module

```typescript
// [nom-module].module.ts
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

### Template Service

```typescript
// [nom-module].service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NomEntity } from '../../entities/nom.entity';

@Injectable()
export class NomModuleService {
  constructor(
    @InjectRepository(NomEntity)
    private readonly nomRepository: Repository<NomEntity>,
  ) {}

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
}
```

### Template Controller

```typescript
// [nom-module].controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { NomModuleService } from './nom-module.service';

@Controller('nom-module')
export class NomModuleController {
  constructor(private readonly nomModuleService: NomModuleService) {}

  @Get()
  async findAll() {
    return this.nomModuleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.nomModuleService.findOne(id);
  }
}
```

## 🗄️ Créer une entité TypeORM

### Étapes

1. **Créer le fichier** : `backend/src/entities/[nom].entity.ts`
2. **Définir les colonnes** avec décorateurs TypeORM
3. **Ajouter relations** si nécessaire (`@ManyToOne`, `@OneToMany`, etc.)
4. **Importer dans le module** : `TypeOrmModule.forFeature([NomEntity])`

### Template Entité

```typescript
// [nom].entity.ts
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 📝 Créer un DTO

### Étapes

1. **Créer le fichier** : `backend/src/modules/[module]/dto/[action]-[nom].dto.ts`
2. **Définir les propriétés** avec validation
3. **Utiliser dans controller** avec `@Body()` ou `@Query()`

### Template DTO

```typescript
// create-nom.dto.ts
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

## 🔌 Endpoints API

### Conventions

- **GET** : Récupération (liste ou détail)
- **POST** : Création
- **PATCH** : Mise à jour partielle
- **PUT** : Mise à jour complète
- **DELETE** : Suppression

### Port backend

- **Port** : `3001` (défini dans `API_CONFIG.md`)
- **Base URL** : `http://localhost:3001`

### Authentification

- **JWT** : Headers `Authorization: Bearer <token>`
- **Guard** : `@UseGuards(JwtAuthGuard)` sur endpoints protégés

## 🗃️ Base de données

### Configuration

- **Type** : PostgreSQL
- **ORM** : TypeORM
- **Config** : `backend/src/config/database.config.ts`
- **Docker** : Container `reboulstore-postgres`

### Migrations

- **Créer migration** : `npm run migration:create -- -n NomMigration`
- **Exécuter migrations** : `npm run migration:run`
- **Annuler migration** : `npm run migration:revert`

### Scripts SQL

- **Emplacement** : `backend/scripts/`
- **Exécution** : Via `docker exec` (voir scripts `.sh` existants)

## 📝 Mise à jour documentation

**Après chaque fonctionnalité :**
1. ✅ **obsidian-vault/Projet/roadmap.md** : Cocher les tâches terminées
2. ✅ **backend/BACKEND.md** : Ajouter module/endpoint/entité
3. ✅ **API_CONFIG.md** : Ajouter endpoint si nouveau
4. ✅ **CONTEXT.md** : Mettre à jour état actuel si phase terminée

## 🔗 Commandes associées

- `/getcontext` : Recherche de contexte
- `/module-create` : Créer un module complet
- `/api-config` : Configuration API

## 📚 Documentation de référence

- **backend/BACKEND.md** : Documentation complète backend
- **API_CONFIG.md** : Configuration API (ports, endpoints)
- **ARCHITECTURE_ADMIN_CENTRAL.md** : Architecture globale
- **CONTEXT.md** : Contexte et état actuel

