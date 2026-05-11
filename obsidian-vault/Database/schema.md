---
type: database
---
# Schéma — Conventions & Migrations

Liens : [[Database/Database]]

---

## ORM

TypeORM avec décorateurs NestJS (`@Entity`, `@Column`, `@OneToMany`, `@ManyToOne`...)
Config : `backend/src/app.module.ts` → `TypeOrmModule.forRootAsync`

## Conventions

- **Nommage** : entités PascalCase → tables snake_case auto (TypeORM)
- **IDs** : `@PrimaryGeneratedColumn()` — auto-increment
- **Timestamps** : `@CreateDateColumn()` / `@UpdateDateColumn()` sur entités principales
- **Soft delete** : non utilisé pour l'instant
- `isPublished` → colonne `is_published` en BDD (camelCase → snake_case)

## Migrations

- Dev : `synchronize: true` (TypeORM synchro auto au démarrage)
- Prod : migrations manuelles via TypeORM CLI
- **Toujours backup avant migration prod** : `./rcli db backup --server`

```bash
# Générer une migration
cd backend && npx typeorm migration:generate -n NomMigration

# Lancer les migrations
npx typeorm migration:run
```

## Import CSV → upsert

Le service d'import Admin fait un **upsert sur reference/SKU** :
- Si la ref existe → stock mis à jour (pas de crash doublon)
- Si nouvelle ref → création
- Fichier : `admin-central/backend/src/modules/reboul/reboul-import.service.ts`

## Redis — Cache

Modules qui mettent en cache :
- `categories` : `categories:all`, `category:{id}` (TTL 600s)
- `products` : réponses paginées (TTL configurable)
