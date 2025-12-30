import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCollections1767024676000 implements MigrationInterface {
  name = 'AddCollections1767024676000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer table collections
    await queryRunner.query(`
      CREATE TABLE "collections" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "displayName" character varying(255),
        "isActive" boolean NOT NULL DEFAULT false,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_collections_name" UNIQUE ("name"),
        CONSTRAINT "PK_collections" PRIMARY KEY ("id")
      )
    `);

    // Ajouter colonne collectionId dans products
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN "collectionId" uuid
    `);

    // Ajouter foreign key
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_collection"
      FOREIGN KEY ("collectionId")
      REFERENCES "collections"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);

    // Créer collection par défaut "current" et l'activer
    await queryRunner.query(`
      INSERT INTO "collections" ("id", "name", "displayName", "isActive", "description")
      VALUES (
        uuid_generate_v4(),
        'current',
        'Collection Actuelle',
        true,
        'Collection actuellement active sur le site'
      )
    `);

    // Assigner tous les produits existants à la collection "current"
    await queryRunner.query(`
      UPDATE "products"
      SET "collectionId" = (
        SELECT "id" FROM "collections" WHERE "name" = 'current' LIMIT 1
      )
      WHERE "collectionId" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer foreign key
    await queryRunner.query(`
      ALTER TABLE "products"
      DROP CONSTRAINT IF EXISTS "FK_products_collection"
    `);

    // Supprimer colonne collectionId
    await queryRunner.query(`
      ALTER TABLE "products"
      DROP COLUMN IF EXISTS "collectionId"
    `);

    // Supprimer table collections
    await queryRunner.query(`
      DROP TABLE IF EXISTS "collections"
    `);
  }
}

