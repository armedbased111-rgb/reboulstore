import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoupons1737617800000 implements MigrationInterface {
  name = 'AddCoupons1737617800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer enum pour discountType
    await queryRunner.query(`
      CREATE TYPE "discount_type_enum" AS ENUM('percentage', 'fixed_amount')
    `);

    // Créer table coupons
    await queryRunner.query(`
      CREATE TABLE "coupons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying(50) NOT NULL,
        "discountType" "discount_type_enum" NOT NULL DEFAULT 'percentage',
        "discountValue" numeric(10,2) NOT NULL,
        "expiresAt" TIMESTAMP,
        "maxUses" integer NOT NULL DEFAULT 0,
        "usedCount" integer NOT NULL DEFAULT 0,
        "minPurchaseAmount" numeric(10,2),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_coupons_code" UNIQUE ("code"),
        CONSTRAINT "PK_coupons" PRIMARY KEY ("id")
      )
    `);

    // Ajouter colonnes couponId et discountAmount dans orders
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD COLUMN "couponId" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD COLUMN "discountAmount" numeric(10,2)
    `);

    // Ajouter foreign key (optionnelle, peut être null)
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "FK_orders_coupon"
      FOREIGN KEY ("couponId")
      REFERENCES "coupons"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer foreign key
    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP CONSTRAINT IF EXISTS "FK_orders_coupon"
    `);

    // Supprimer colonnes dans orders
    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP COLUMN IF EXISTS "discountAmount"
    `);

    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP COLUMN IF EXISTS "couponId"
    `);

    // Supprimer enum
    await queryRunner.query(`
      DROP TYPE IF EXISTS "discount_type_enum"
    `);

    // Supprimer table coupons
    await queryRunner.query(`
      DROP TABLE IF EXISTS "coupons"
    `);
  }
}

