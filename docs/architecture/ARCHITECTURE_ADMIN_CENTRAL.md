# 🏗️ Architecture Admin Centralisée - Documentation Complète

**Version** : 1.1  
**Date** : 11 décembre 2025  
**Dernière mise à jour** : 16 décembre 2025  
**Statut** : ✅ Validée et approuvée - Phase 15.5 (Infrastructure) terminée

---

## 📋 Vue d'ensemble

Cette architecture définit la structure complète du projet Reboul Store avec **3 sites e-commerce indépendants** gérés par une **application Admin centralisée**.

---

## 🎯 Architecture Globale

```
📦 Architecture Docker Complète
│
├── 🏪 reboulstore/ (Projet 1 - MVP Février 2025)
│   ├── backend/ (NestJS)
│   ├── frontend/ (React + Vite + TailwindCSS)
│   └── postgres/ (Database Reboul)
│
├── 🏪 cpcompany/ (Projet 2 - Futur)
│   ├── backend/ (NestJS)
│   ├── frontend/ (React + Vite + TailwindCSS)
│   └── postgres/ (Database CP Company)
│
├── 🏪 outlet/ (Projet 3 - Futur)
│   ├── backend/ (NestJS)
│   ├── frontend/ (React + Vite + TailwindCSS)
│   └── postgres/ (Database Outlet)
│
└── 🎛️ admin-central/ (Application Admin Centralisée)
    ├── frontend/ (React + Vite + GeistUI)
    ├── backend/ (NestJS)
    └── 🔌 Connexions aux 3 databases
        ├── reboulstore_db (MVP)
        ├── cpcompany_db (Futur)
        └── outlet_db (Futur)
```

---

## 🏪 Structure des 3 Projets E-commerce

### Principe : Isolation Totale

Chaque site e-commerce est **complètement indépendant** :
- ✅ **Base de données séparée** : Chaque site a sa propre PostgreSQL
- ✅ **Backend séparé** : Chaque site a son propre API NestJS
- ✅ **Frontend séparé** : Chaque site a son propre frontend React
- ✅ **Docker Compose séparé** : Chaque site a son propre `docker-compose.yml`

### Avantages

- ✅ **Stabilité** : Si un site crash, les autres continuent
- ✅ **Scalabilité** : Chaque site évolue indépendamment
- ✅ **Sécurité** : Bases de données isolées
- ✅ **Maintenance** : Codebases séparés, équipes peuvent travailler en parallèle
- ✅ **Déploiement** : Déploiement indépendant par site

### Structure d'un Projet E-commerce

```
reboulstore/
├── backend/
│   ├── src/
│   │   ├── entities/        # Entités TypeORM
│   │   ├── modules/          # Modules NestJS (products, orders, etc.)
│   │   ├── config/           # Configuration (database, email, etc.)
│   │   └── app.module.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Pages React
│   │   ├── components/       # Composants React
│   │   ├── services/         # Services API
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml         # Configuration Docker du projet
└── .env                       # Variables d'environnement
```

### Exemple : docker-compose.yml (reboulstore)

```yaml
services:
  # Base de données PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: reboulstore-postgres
    environment:
      POSTGRES_USER: reboulstore
      POSTGRES_PASSWORD: reboulstore_password
      POSTGRES_DB: reboulstore_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - reboulstore-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U reboulstore -d reboulstore_db"]
      interval: 5s
      timeout: 5s
      retries: 10

  # Backend NestJS
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: reboulstore-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USERNAME=reboulstore
      - DB_PASSWORD=reboulstore_password
      - DB_DATABASE=reboulstore_db
      - PORT=3001
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - reboulstore-network

  # Frontend React
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: reboulstore-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:3001
    depends_on:
      - backend
    networks:
      - reboulstore-network

volumes:
  postgres_data:

networks:
  reboulstore-network:
    name: reboulstore-network  # Nom explicite pour partage avec admin
    driver: bridge
```

### Ports par Projet

| Projet | Frontend | Backend | PostgreSQL |
|--------|----------|---------|------------|
| **reboulstore** | 3000 | 3001 | 5432 |
| **cpcompany** | 3003 | 3002 | 5433 |
| **outlet** | 3005 | 3004 | 5434 |
| **admin-central** | 4000 | 4001 | - (connexion aux 3 DB) |

---

## 🎛️ Application Admin Centralisée

### Principe : Connexion Multi-Databases

L'application Admin se connecte **directement aux 3 bases de données** via TypeORM avec **connexions multiples**.

### Structure admin-central/

```
admin-central/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.reboul.config.ts      # Config connexion Reboul
│   │   │   ├── database.cpcompany.config.ts     # Config connexion CP Company
│   │   │   └── database.outlet.config.ts      # Config connexion Outlet
│   │   ├── modules/
│   │   │   ├── reboul/                         # Services pour Reboul
│   │   │   │   ├── entities/                   # Entités Reboul (copiées)
│   │   │   │   ├── reboul-orders.service.ts
│   │   │   │   ├── reboul-products.service.ts
│   │   │   │   └── reboul.module.ts
│   │   │   ├── cpcompany/                      # Services pour CP Company (futur)
│   │   │   └── outlet/                         # Services pour Outlet (futur)
│   │   ├── shared/                             # Services partagés
│   │   │   ├── auth/                           # Authentification admin
│   │   │   └── dashboard/                      # Dashboard global
│   │   └── app.module.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dashboard/                      # Dashboard global
│   │   │   ├── reboul/                        # Pages Reboul
│   │   │   ├── cpcompany/                     # Pages CP Company (futur)
│   │   │   └── outlet/                        # Pages Outlet (futur)
│   │   ├── components/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
└── docker-compose.yml
```

### Configuration TypeORM - Connexions Multiples

TypeORM/NestJS supporte **plusieurs connexions simultanées**. Chaque connexion a un **nom unique**.

#### admin-central/backend/src/config/databases.config.ts

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Connexion à la base de données Reboul
 */
export const getReboulDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  name: 'reboul', // Nom unique de la connexion
  type: 'postgres',
  host: configService.get<string>('REBOUL_DB_HOST', 'reboulstore-postgres'),
  port: configService.get<number>('REBOUL_DB_PORT', 5432),
  username: configService.get<string>('REBOUL_DB_USER', 'reboulstore'),
  password: configService.get<string>('REBOUL_DB_PASSWORD', 'reboulstore_password'),
  database: configService.get<string>('REBOUL_DB_NAME', 'reboulstore_db'),
  entities: [__dirname + '/../modules/reboul/**/*.entity{.ts,.js}'],
  synchronize: false, // JAMAIS true en production
  logging: configService.get<string>('NODE_ENV') === 'development',
  autoLoadEntities: true,
});

/**
 * Connexion à la base de données CP Company (Futur)
 */
export const getCpCompanyDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  name: 'cpcompany',
  type: 'postgres',
  host: configService.get<string>('CPCOMPANY_DB_HOST', 'cpcompany-postgres'),
  port: configService.get<number>('CPCOMPANY_DB_PORT', 5433),
  username: configService.get<string>('CPCOMPANY_DB_USER', 'cpcompany'),
  password: configService.get<string>('CPCOMPANY_DB_PASSWORD', 'cpcompany_password'),
  database: configService.get<string>('CPCOMPANY_DB_NAME', 'cpcompany_db'),
  entities: [__dirname + '/../modules/cpcompany/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: configService.get<string>('NODE_ENV') === 'development',
  autoLoadEntities: true,
});

/**
 * Connexion à la base de données Outlet (Futur)
 */
export const getOutletDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  name: 'outlet',
  type: 'postgres',
  host: configService.get<string>('OUTLET_DB_HOST', 'outlet-postgres'),
  port: configService.get<number>('OUTLET_DB_PORT', 5434),
  username: configService.get<string>('OUTLET_DB_USER', 'outlet'),
  password: configService.get<string>('OUTLET_DB_PASSWORD', 'outlet_password'),
  database: configService.get<string>('OUTLET_DB_NAME', 'outlet_db'),
  entities: [__dirname + '/../modules/outlet/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: configService.get<string>('NODE_ENV') === 'development',
  autoLoadEntities: true,
});
```

#### admin-central/backend/src/app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { 
  getReboulDatabaseConfig,
  getCpCompanyDatabaseConfig,
  getOutletDatabaseConfig 
} from './config/databases.config';
import { ReboulModule } from './modules/reboul/reboul.module';
// import { CpCompanyModule } from './modules/cpcompany/cpcompany.module'; // Futur
// import { OutletModule } from './modules/outlet/outlet.module'; // Futur

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Connexion Reboul (principale pour MVP)
    TypeOrmModule.forRootAsync({
      name: 'reboul',
      imports: [ConfigModule],
      useFactory: getReboulDatabaseConfig,
      inject: [ConfigService],
    }),
    
    // Connexion CP Company (futur - commenté pour MVP)
    // TypeOrmModule.forRootAsync({
    //   name: 'cpcompany',
    //   imports: [ConfigModule],
    //   useFactory: getCpCompanyDatabaseConfig,
    //   inject: [ConfigService],
    // }),
    
    // Connexion Outlet (futur - commenté pour MVP)
    // TypeOrmModule.forRootAsync({
    //   name: 'outlet',
    //   imports: [ConfigModule],
    //   useFactory: getOutletDatabaseConfig,
    //   inject: [ConfigService],
    // }),
    
    // Modules admin
    ReboulModule,
    // CpCompanyModule,  // Futur
    // OutletModule,      // Futur
  ],
})
export class AppModule {}
```

### Utilisation dans les Services

#### admin-central/backend/src/modules/reboul/reboul-orders.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity'; // Entité Reboul (copiée)

@Injectable()
export class ReboulOrdersService {
  constructor(
    @InjectRepository(Order, 'reboul') // ⚠️ Spécifier le nom de la connexion
    private ordersRepository: Repository<Order>,
  ) {}

  async findAll() {
    return this.ordersRepository.find({
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.variant', 'items.variant.product', 'user'],
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    order.status = status;
    return this.ordersRepository.save(order);
  }
}
```

#### admin-central/backend/src/modules/reboul/reboul.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { ReboulOrdersService } from './reboul-orders.service';
import { ReboulProductsService } from './reboul-products.service';
import { ReboulOrdersController } from './reboul-orders.controller';
import { ReboulProductsController } from './reboul-products.controller';

@Module({
  imports: [
    // ⚠️ Spécifier le nom de la connexion ('reboul')
    TypeOrmModule.forFeature([Order, Product], 'reboul'),
  ],
  providers: [ReboulOrdersService, ReboulProductsService],
  controllers: [ReboulOrdersController, ReboulProductsController],
  exports: [ReboulOrdersService, ReboulProductsService],
})
export class ReboulModule {}
```

### Docker Compose Admin

#### admin-central/docker-compose.yml

```yaml
services:
  # Backend Admin
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: admin-backend
    ports:
      - "4001:4001"
    environment:
      - NODE_ENV=development
      - PORT=4001
      
      # Connexion Reboul (via réseau Docker partagé)
      - REBOUL_DB_HOST=reboulstore-postgres
      - REBOUL_DB_PORT=5432
      - REBOUL_DB_USER=reboulstore
      - REBOUL_DB_PASSWORD=reboulstore_password
      - REBOUL_DB_NAME=reboulstore_db
      
      # Connexion CP Company (futur)
      # - CPCOMPANY_DB_HOST=cpcompany-postgres
      # - CPCOMPANY_DB_PORT=5432
      
      # Connexion Outlet (futur)
      # - OUTLET_DB_HOST=outlet-postgres
      # - OUTLET_DB_PORT=5432
    networks:
      - reboulstore-network  # Réseau partagé avec reboulstore
      # - cpcompany-network   # Futur
      # - outlet-network      # Futur
    depends_on:
      - postgres  # Base de données locale admin (si nécessaire)
  
  # Frontend Admin
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: admin-frontend
    ports:
      - "4000:4000"
    environment:
      - VITE_API_URL=http://localhost:4001
    depends_on:
      - backend
    networks:
      - reboulstore-network

volumes:
  postgres_data:

networks:
  reboulstore-network:
    external: true  # Utiliser le réseau existant de reboulstore
  # cpcompany-network:
  #   external: true  # Futur
  # outlet-network:
  #   external: true  # Futur
```

### Réseaux Docker Partagés

Pour que l'admin accède aux bases de données des 3 projets, il faut utiliser des **réseaux Docker partagés**.

#### reboulstore/docker-compose.yml

```yaml
networks:
  reboulstore-network:
    name: reboulstore-network  # Nom explicite pour partage
    driver: bridge
```

#### admin-central/docker-compose.yml

```yaml
networks:
  reboulstore-network:
    external: true  # Utiliser le réseau existant
```

**Important** : Les réseaux doivent être créés **avant** de lancer l'admin. Ordre de démarrage :

1. `cd reboulstore && docker-compose up -d` (crée le réseau)
2. `cd admin-central && docker-compose up -d` (utilise le réseau existant)

---

## 📊 Plan d'Implémentation

### Phase 1 : MVP (Février 2025)

**Objectif** : Admin connecté uniquement à Reboul

1. ✅ **Garder reboulstore/ tel quel** (déjà fonctionnel)
2. 🔄 **Créer admin-central/** avec :
   - Structure backend (NestJS)
   - Structure frontend (React + GeistUI)
   - Configuration connexion Reboul uniquement
   - Modules Reboul (orders, products, stocks)
3. 🔄 **Implémenter admin MVP** :
   - Dashboard (métriques Reboul)
   - Gestion commandes Reboul
   - Gestion produits Reboul
   - Capture paiements Reboul

### Phase 2 : CP Company (Post-lancement Reboul)

1. **Créer cpcompany/** :
   - Copier structure `reboulstore/`
   - Adapter configuration (ports, noms)
   - Créer base de données CP Company
2. **Ajouter connexion CP Company dans admin-central/** :
   - Décommenter config CP Company dans `app.module.ts`
   - Créer modules CP Company
   - Ajouter routes admin CP Company
3. **Ajouter modules CP Company dans admin** :
   - Services CP Company
   - Controllers CP Company
   - Pages frontend CP Company

### Phase 3 : Outlet

1. **Créer outlet/** :
   - Copier structure `reboulstore/`
   - Adapter pour logique déstockage
   - Créer base de données Outlet
2. **Ajouter connexion Outlet dans admin-central/** :
   - Décommenter config Outlet dans `app.module.ts`
   - Créer modules Outlet
   - Ajouter routes admin Outlet
3. **Ajouter modules Outlet dans admin** :
   - Services Outlet
   - Controllers Outlet
   - Pages frontend Outlet

---

## ✅ Avantages de cette Architecture

### Isolation Totale

- ✅ **Stabilité** : Si un site crash, les autres continuent
- ✅ **Sécurité** : Bases de données séparées, pas de mélange de données
- ✅ **Scalabilité** : Chaque site évolue indépendamment
- ✅ **Maintenance** : Codebases séparés, équipes peuvent travailler en parallèle

### Admin Centralisé

- ✅ **Vue unifiée** : Gérer les 3 sites depuis une seule interface
- ✅ **Efficacité** : Pas besoin de se connecter à 3 interfaces différentes
- ✅ **Cohérence** : Même workflow pour tous les sites
- ✅ **Évolutivité** : Facile d'ajouter un 4ème site plus tard

### Technique

- ✅ **TypeORM Multi-Connexions** : Support natif, bien documenté
- ✅ **Docker Réseaux Partagés** : Standard Docker, facile à configurer
- ✅ **Séparation des responsabilités** : Chaque projet a son rôle clair

---

## ⚠️ Points d'Attention

### Complexité

- ⚠️ **3 projets + 1 admin** : Plus de codebases à maintenir
- ⚠️ **Migrations** : Gérer les migrations pour chaque base de données
- ⚠️ **Déploiement** : Déployer 4 applications au lieu d'1

### Coûts

- ⚠️ **3 bases de données** : Coûts d'hébergement multipliés
- ⚠️ **Ressources** : Plus de containers Docker, plus de RAM/CPU

### Réseaux Docker

- ⚠️ **Configuration réseaux** : Bien configurer les réseaux partagés
- ⚠️ **Ordre démarrage** : Démarrer les projets e-commerce avant l'admin

### Synchronisation

- ⚠️ **Entités dupliquées** : Les entités doivent être copiées dans admin-central
- ⚠️ **Versioning** : S'assurer que les entités restent synchronisées

---

## 📝 Checklist Implémentation

### MVP (Février 2025)

- [x] Créer structure `admin-central/` ✅ Phase 15.5
- [x] Configurer backend avec connexion Reboul ✅ Phase 15.5
- [x] Configurer Docker Compose admin ✅ Phase 15.5
- [x] Tester connexion admin → Reboul database ✅ Phase 15.5 (validée)
- [x] Copier entités Reboul dans `admin-central/backend/src/modules/reboul/entities/` ✅ Phase 16.1 (11 entités)
- [x] Créer services Reboul (products, orders, users, stocks) ✅ Phase 16.3-16.6
- [x] Créer controllers Reboul ✅ Phase 16.3-16.6
- [x] Créer Rôles & Permissions (AdminUser, Guards) ✅ Phase 16.2
- [ ] Configurer frontend admin (React + GeistUI) → Phase 17
- [ ] Créer pages admin (dashboard, commandes, produits) → Phase 17
- [ ] Implémenter fonctionnalités MVP admin → Phase 16-17

### CP Company (Futur)

- [ ] Créer structure `cpcompany/`
- [ ] Copier structure `reboulstore/` et adapter
- [ ] Créer base de données CP Company
- [ ] Ajouter connexion CP Company dans admin
- [ ] Créer modules CP Company dans admin
- [ ] Ajouter pages CP Company dans frontend admin

### Outlet (Futur)

- [ ] Créer structure `outlet/`
- [ ] Copier structure `reboulstore/` et adapter
- [ ] Implémenter logique déstockage
- [ ] Créer base de données Outlet
- [ ] Ajouter connexion Outlet dans admin
- [ ] Créer modules Outlet dans admin
- [ ] Ajouter pages Outlet dans frontend admin

---

## 🔗 Références

- **CONTEXT.md** : Contexte général du projet
- **ROADMAP_COMPLETE.md** : Roadmap détaillée avec toutes les phases
- **BRAINSTORMING_ROADMAP.md** : Décisions prises lors du brainstorming
- **CLARIFICATIONS_BRAINSTORMING.md** : Clarifications et décisions validées

---

**📝 Document vivant** : Ce document doit être mis à jour si l'architecture évolue.

---

## ✅ État Actuel de l'Implémentation (16 décembre 2025)

### Phase 15.5 : Infrastructure Admin-Centrale ✅ TERMINÉE

**Infrastructure créée et validée** :

- ✅ Structure `admin-central/` créée à la racine
- ✅ Backend NestJS minimal configuré avec connexions multiples TypeORM
- ✅ Frontend React + Vite + TypeScript minimal configuré
- ✅ Docker Compose configuré (services backend + frontend)
- ✅ Réseau Docker partagé `reboulstore-network` configuré
- ✅ Connexion TypeORM `'reboul'` active et validée
- ✅ Connexions `'cpcompany'` et `'outlet'` préparées (commentées)
- ✅ Endpoint `/health` fonctionnel (backend admin)
- ✅ Page test "Hello Admin" fonctionnelle (frontend admin)

**Services actifs** :
- `admin-central-backend` : http://localhost:4001 ✅
- `admin-central-frontend` : http://localhost:4000 ✅
- Connexion à `reboulstore-postgres` validée ✅

**Prochaine étape** : Phase 16.2 - Rôles & Permissions (AdminUser, Guards) puis Phase 17 - Frontend Admin

---

### Phase 16 : Backend Admin - Services & Controllers ✅ PARTIELLEMENT TERMINÉE

**Services et Controllers créés** :

- ✅ **ReboulProductsService** + **ReboulProductsController**
  - Endpoints : GET (liste + pagination), GET /stats, GET /:id, POST, PATCH, DELETE
  - Filtres : categoryId, brandId, search, minPrice, maxPrice
  
- ✅ **ReboulOrdersService** + **ReboulOrdersController**
  - Endpoints : GET (liste + pagination), GET /stats, GET /:id, PATCH /:id/status, POST /:id/tracking
  - Filtres : status, userId, startDate, endDate
  - Validation transitions de statut
  
- ✅ **ReboulUsersService** + **ReboulUsersController**
  - Endpoints : GET (liste + pagination), GET /stats, GET /:id, PATCH /:id/role, DELETE /:id
  - Filtres : role, search
  - Protection : pas de promotion SUPER_ADMIN, vérification commandes actives avant suppression
  
- ✅ **ReboulStocksService** + **ReboulStocksController**
  - Endpoints : GET (liste + filtres), GET /stats, GET /:variantId, PATCH /:variantId
  - Filtres : lowStock, outOfStock, productId

**✅ Phase 16.2 : Rôles & Permissions** :
- Entité `AdminUser` créée (séparée de User client)
- Enum `AdminRole` (ADMIN, SUPER_ADMIN)
- Service `AdminAuthService` (register, login, validateUser)
- Strategy `AdminJwtStrategy` + Guards `AdminJwtAuthGuard` et `RolesGuard`
- Decorator `@Roles()` pour spécifier rôles requis
- Controller `AdminAuthController` avec routes `/admin/auth/*`
- Toutes les routes admin protégées par authentification ✅
- Tests validés : Inscription, connexion, token JWT, routes protégées ✅

**À faire** :
- Phase 17 : Frontend Admin (pages, composants, intégration)
