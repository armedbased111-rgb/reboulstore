import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1734739200000 implements MigrationInterface {
  name = 'InitialSchema1734739200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer enum types
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('CLIENT', 'ADMIN', 'SUPER_ADMIN')
    `);
    await queryRunner.query(`
      CREATE TYPE "order_status_enum" AS ENUM('pending', 'paid', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')
    `);
    await queryRunner.query(`
      CREATE TYPE "email_type_enum" AS ENUM('order_received', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled')
    `);

    // Table shops
    await queryRunner.query(`
      CREATE TABLE "shops" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "description" text,
        "shippingPolicy" jsonb,
        "returnPolicy" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_shops_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_shops" PRIMARY KEY ("id")
      )
    `);

    // Table brands
    await queryRunner.query(`
      CREATE TABLE "brands" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "description" text,
        "logoUrl" character varying(500),
        "megaMenuImage1" character varying(500),
        "megaMenuImage2" character varying(500),
        "megaMenuVideo1" character varying(500),
        "megaMenuVideo2" character varying(500),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_brands_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_brands" PRIMARY KEY ("id")
      )
    `);

    // Table categories
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "description" text,
        "imageUrl" character varying(500),
        "videoUrl" character varying(500),
        "sizeChart" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_categories_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_categories" PRIMARY KEY ("id")
      )
    `);

    // Table users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying,
        "firstName" character varying,
        "lastName" character varying,
        "phone" character varying,
        "role" "user_role_enum" NOT NULL DEFAULT 'CLIENT',
        "isVerified" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Table addresses
    await queryRunner.query(`
      CREATE TABLE "addresses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "street" character varying NOT NULL,
        "city" character varying NOT NULL,
        "postalCode" character varying NOT NULL,
        "country" character varying NOT NULL DEFAULT 'France',
        "additionalInfo" character varying,
        "isDefault" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_addresses" PRIMARY KEY ("id"),
        CONSTRAINT "FK_addresses_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Table products
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "categoryId" uuid NOT NULL,
        "shopId" uuid,
        "brandId" uuid,
        "materials" text,
        "careInstructions" text,
        "madeIn" character varying(100),
        "customSizeChart" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products" PRIMARY KEY ("id"),
        CONSTRAINT "FK_products_categoryId" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_products_shopId" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_products_brandId" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Table images
    await queryRunner.query(`
      CREATE TABLE "images" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "productId" uuid NOT NULL,
        "url" character varying(500) NOT NULL,
        "publicId" character varying(255),
        "alt" character varying(255),
        "order" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_images" PRIMARY KEY ("id"),
        CONSTRAINT "FK_images_productId" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Table variants
    await queryRunner.query(`
      CREATE TABLE "variants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "productId" uuid NOT NULL,
        "color" character varying(100) NOT NULL,
        "size" character varying(50) NOT NULL,
        "stock" integer NOT NULL DEFAULT 0,
        "sku" character varying(100) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_variants_sku" UNIQUE ("sku"),
        CONSTRAINT "PK_variants" PRIMARY KEY ("id"),
        CONSTRAINT "FK_variants_productId" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Table carts
    await queryRunner.query(`
      CREATE TABLE "carts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sessionId" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_carts" PRIMARY KEY ("id")
      )
    `);

    // Table cart_items
    await queryRunner.query(`
      CREATE TABLE "cart_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "cartId" uuid NOT NULL,
        "variantId" uuid NOT NULL,
        "quantity" integer NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cart_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cart_items_cartId" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_cart_items_variantId" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Table orders
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "cartId" uuid,
        "status" "order_status_enum" NOT NULL DEFAULT 'pending',
        "total" numeric(10,2) NOT NULL,
        "customerInfo" jsonb NOT NULL,
        "userId" uuid,
        "shippingAddress" jsonb,
        "billingAddress" jsonb,
        "paymentIntentId" character varying,
        "items" jsonb,
        "trackingNumber" character varying,
        "paidAt" TIMESTAMP,
        "shippedAt" TIMESTAMP,
        "deliveredAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_cartId" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_orders_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    // Table order_emails
    await queryRunner.query(`
      CREATE TABLE "order_emails" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "orderId" uuid NOT NULL,
        "emailType" "email_type_enum" NOT NULL,
        "recipientEmail" character varying NOT NULL,
        "subject" character varying(255) NOT NULL,
        "sent" boolean NOT NULL DEFAULT true,
        "errorMessage" text,
        "sentAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_emails" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_emails_orderId" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Créer index pour améliorer les performances
    await queryRunner.query(`CREATE INDEX "IDX_products_categoryId" ON "products" ("categoryId")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_shopId" ON "products" ("shopId")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_brandId" ON "products" ("brandId")`);
    await queryRunner.query(`CREATE INDEX "IDX_images_productId" ON "images" ("productId")`);
    await queryRunner.query(`CREATE INDEX "IDX_variants_productId" ON "variants" ("productId")`);
    await queryRunner.query(`CREATE INDEX "IDX_cart_items_cartId" ON "cart_items" ("cartId")`);
    await queryRunner.query(`CREATE INDEX "IDX_cart_items_variantId" ON "cart_items" ("variantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_userId" ON "orders" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_cartId" ON "orders" ("cartId")`);
    await queryRunner.query(`CREATE INDEX "IDX_order_emails_orderId" ON "order_emails" ("orderId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les index
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_order_emails_orderId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_orders_cartId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_orders_userId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cart_items_variantId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cart_items_cartId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_variants_productId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_images_productId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_brandId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_shopId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_categoryId"`);

    // Supprimer les tables dans l'ordre inverse
    await queryRunner.query(`DROP TABLE IF EXISTS "order_emails"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cart_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "carts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "variants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "images"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "addresses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "brands"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shops"`);

    // Supprimer les enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "email_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "order_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}
