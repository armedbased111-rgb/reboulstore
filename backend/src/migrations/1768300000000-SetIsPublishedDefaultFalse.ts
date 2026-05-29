import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetIsPublishedDefaultFalse1768300000000 implements MigrationInterface {
  name = 'SetIsPublishedDefaultFalse1768300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
      ALTER COLUMN "is_published" SET DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
      ALTER COLUMN "is_published" SET DEFAULT true
    `);
  }
}
