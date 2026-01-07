import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStockNotifications1767627545712 implements MigrationInterface {
    name = 'AddStockNotifications1767627545712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "variantId" uuid, "email" character varying(255) NOT NULL, "phone" character varying(20), "isNotified" boolean NOT NULL DEFAULT false, "notifiedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c0f4c0af55afa3f986ec6fcd129" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "couponId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "discountAmount" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "stock_notifications" ADD CONSTRAINT "FK_c2afc33b49f0e288e95692d0ad8" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_notifications" ADD CONSTRAINT "FK_1ea30a8e2266ef675df24d1ca5e" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_notifications" DROP CONSTRAINT "FK_1ea30a8e2266ef675df24d1ca5e"`);
        await queryRunner.query(`ALTER TABLE "stock_notifications" DROP CONSTRAINT "FK_c2afc33b49f0e288e95692d0ad8"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "discountAmount"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "couponId"`);
        await queryRunner.query(`DROP TABLE "stock_notifications"`);
    }

}
