import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: UUID → integer (SERIAL) pour toutes les PK/FK.
 * À exécuter après sauvegarde DB.
 */
export class UuidToIntegerIds1767788900000 implements MigrationInterface {
  name = 'UuidToIntegerIds1767788900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ---- 1. Brands ----
    await queryRunner.query(`ALTER TABLE "brands" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_ea86d0c514c4ecbb5694cbf57df"`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "brandId_new" integer`);
    await queryRunner.query(`UPDATE "products" p SET "brandId_new" = b."id_new" FROM "brands" b WHERE b."id" = p."brandId"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brandId"`);
    await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "brandId_new" TO "brandId"`);
    await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "PK_b0c437120b624da1034a81fc561"`);
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "brands" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "brands" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_brandId" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // ---- 2. Categories ----
    await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_ff56834e735fa78a15d0cf21926"`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "categoryId_new" integer`);
    await queryRunner.query(`UPDATE "products" p SET "categoryId_new" = c."id_new" FROM "categories" c WHERE c."id" = p."categoryId"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "categoryId"`);
    await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "categoryId_new" TO "categoryId"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "categories" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_categoryId" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // ---- 3. Collections ----
    await queryRunner.query(`ALTER TABLE "collections" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_53823b875c14daa5e9009ee6839"`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "collectionId_new" integer`);
    await queryRunner.query(`UPDATE "products" p SET "collectionId_new" = c."id_new" FROM "collections" c WHERE c."id" = p."collectionId"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "collectionId"`);
    await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "collectionId_new" TO "collectionId"`);
    await queryRunner.query(`ALTER TABLE "collections" DROP CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e"`);
    await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "collections" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "collections" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_collectionId" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // ---- 4. Shops ----
    await queryRunner.query(`ALTER TABLE "shops" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_51a281693ebef6fa8729de39381"`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "shopId_new" integer`);
    await queryRunner.query(`UPDATE "products" p SET "shopId_new" = s."id_new" FROM "shops" s WHERE s."id" = p."shopId"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "shopId"`);
    await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "shopId_new" TO "shopId"`);
    await queryRunner.query(`ALTER TABLE "shops" DROP CONSTRAINT "PK_3c6aaa6607d287de99815e60b96"`);
    await queryRunner.query(`ALTER TABLE "shops" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "shops" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "shops" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_shopId" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // ---- 5. Products ----
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT IF EXISTS "FK_7af50639264735c79e918af6089"`);
    await queryRunner.query(`ALTER TABLE "images" ADD COLUMN "productId_new" integer`);
    await queryRunner.query(`UPDATE "images" i SET "productId_new" = p."id_new" FROM "products" p WHERE p."id" = i."productId"`);
    await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "images" RENAME COLUMN "productId_new" TO "productId"`);
    await queryRunner.query(`ALTER TABLE "variants" DROP CONSTRAINT IF EXISTS "FK_bdbfe33a28befefa9723c355036"`);
    await queryRunner.query(`ALTER TABLE "variants" ADD COLUMN "productId_new" integer`);
    await queryRunner.query(`UPDATE "variants" v SET "productId_new" = p."id_new" FROM "products" p WHERE p."id" = v."productId"`);
    await queryRunner.query(`ALTER TABLE "variants" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "variants" RENAME COLUMN "productId_new" TO "productId"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" DROP CONSTRAINT IF EXISTS "FK_c2afc33b49f0e288e95692d0ad8"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" ADD COLUMN "productId_new" integer`);
    await queryRunner.query(`UPDATE "stock_notifications" s SET "productId_new" = p."id_new" FROM "products" p WHERE p."id" = s."productId"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" RENAME COLUMN "productId_new" TO "productId"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "products" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_images_productId" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "variants" ADD CONSTRAINT "FK_variants_productId" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" ADD CONSTRAINT "FK_stock_notifications_productId" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    // ---- 6. Images ----
    await queryRunner.query(`ALTER TABLE "images" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9"`);
    await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "images" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "images" ADD PRIMARY KEY ("id")`);

    // ---- 7. Variants ----
    await queryRunner.query(`ALTER TABLE "variants" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "FK_5a27845bc2d79be6f1fa3d2c036"`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD COLUMN "variantId_new" integer`);
    await queryRunner.query(`UPDATE "cart_items" c SET "variantId_new" = v."id_new" FROM "variants" v WHERE v."id" = c."variantId"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "variantId"`);
    await queryRunner.query(`ALTER TABLE "cart_items" RENAME COLUMN "variantId_new" TO "variantId"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" DROP CONSTRAINT IF EXISTS "FK_1ea30a8e2266ef675df24d1ca5e"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" ADD COLUMN "variantId_new" integer`);
    await queryRunner.query(`UPDATE "stock_notifications" s SET "variantId_new" = v."id_new" FROM "variants" v WHERE v."id" = s."variantId"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" DROP COLUMN "variantId"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" RENAME COLUMN "variantId_new" TO "variantId"`);
    await queryRunner.query(`ALTER TABLE "variants" DROP CONSTRAINT "PK_672d13d1a6de0197f20c6babb5e"`);
    await queryRunner.query(`ALTER TABLE "variants" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "variants" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "variants" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_cart_items_variantId" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" ADD CONSTRAINT "FK_stock_notifications_variantId" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    // ---- 8. Users ----
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT IF EXISTS "FK_95c93a584de49f0b0e13f753630"`);
    await queryRunner.query(`ALTER TABLE "addresses" ADD COLUMN "userId_new" integer`);
    await queryRunner.query(`UPDATE "addresses" a SET "userId_new" = u."id_new" FROM "users" u WHERE u."id" = a."userId"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "addresses" RENAME COLUMN "userId_new" TO "userId"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "FK_151b79a83ba240b0cb31b2302d1"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD COLUMN "userId_new" integer`);
    await queryRunner.query(`UPDATE "orders" o SET "userId_new" = u."id_new" FROM "users" u WHERE u."id" = o."userId"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "userId_new" TO "userId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_addresses_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

    // ---- 9. Addresses ----
    await queryRunner.query(`ALTER TABLE "addresses" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "PK_745d8f43d3af10ab8247465e450"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "addresses" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "addresses" ADD PRIMARY KEY ("id")`);

    // ---- 10. Carts ----
    await queryRunner.query(`ALTER TABLE "carts" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "FK_edd714311619a5ad09525045838"`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD COLUMN "cartId_new" integer`);
    await queryRunner.query(`UPDATE "cart_items" c SET "cartId_new" = cr."id_new" FROM "carts" cr WHERE cr."id" = c."cartId"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "cartId"`);
    await queryRunner.query(`ALTER TABLE "cart_items" RENAME COLUMN "cartId_new" TO "cartId"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "FK_d7b6b269e131a5287bd05da4a51"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD COLUMN "cartId_new" integer`);
    await queryRunner.query(`UPDATE "orders" o SET "cartId_new" = c."id_new" FROM "carts" c WHERE c."id" = o."cartId"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cartId"`);
    await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "cartId_new" TO "cartId"`);
    await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816"`);
    await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "carts" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "carts" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_cart_items_cartId" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_cartId" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // ---- 11. Coupons ----
    await queryRunner.query(`ALTER TABLE "coupons" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "FK_orders_coupon"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD COLUMN "couponId_new" integer`);
    await queryRunner.query(`UPDATE "orders" o SET "couponId_new" = c."id_new" FROM "coupons" c WHERE c."id" = o."couponId"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "couponId"`);
    await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "couponId_new" TO "couponId"`);
    await queryRunner.query(`ALTER TABLE "coupons" DROP CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb"`);
    await queryRunner.query(`ALTER TABLE "coupons" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "coupons" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "coupons" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_coupon" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

    // ---- 12. Orders ----
    await queryRunner.query(`ALTER TABLE "orders" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "order_emails" DROP CONSTRAINT IF EXISTS "FK_937a6492bf7fa26cb43cb2c8e88"`);
    await queryRunner.query(`ALTER TABLE "order_emails" ADD COLUMN "orderId_new" integer`);
    await queryRunner.query(`UPDATE "order_emails" e SET "orderId_new" = o."id_new" FROM "orders" o WHERE o."id" = e."orderId"`);
    await queryRunner.query(`ALTER TABLE "order_emails" DROP COLUMN "orderId"`);
    await queryRunner.query(`ALTER TABLE "order_emails" RENAME COLUMN "orderId_new" TO "orderId"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "order_emails" ADD CONSTRAINT "FK_order_emails_orderId" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    // ---- 13. Order_emails ----
    await queryRunner.query(`ALTER TABLE "order_emails" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "order_emails" DROP CONSTRAINT "PK_281a1a97148f960cd9927b722d0"`);
    await queryRunner.query(`ALTER TABLE "order_emails" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "order_emails" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "order_emails" ADD PRIMARY KEY ("id")`);

    // ---- 14. Cart_items ----
    await queryRunner.query(`ALTER TABLE "cart_items" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "cart_items" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD PRIMARY KEY ("id")`);

    // ---- 15. Stock_notifications ----
    await queryRunner.query(`ALTER TABLE "stock_notifications" ADD COLUMN "id_new" SERIAL`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" DROP CONSTRAINT "PK_c0f4c0af55afa3f986ec6fcd129"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" RENAME COLUMN "id_new" TO "id"`);
    await queryRunner.query(`ALTER TABLE "stock_notifications" ADD PRIMARY KEY ("id")`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    throw new Error('Migration down non implémentée (UUID → integer irréversible sans backup).');
  }
}
