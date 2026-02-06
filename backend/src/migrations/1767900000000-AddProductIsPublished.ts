import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductIsPublished1767900000000 implements MigrationInterface {
  name = 'AddProductIsPublished1767900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "is_published" boolean NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "is_published"`);
  }
}
