import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVariantCodArticle1768200000000 implements MigrationInterface {
  name = 'AddVariantCodArticle1768200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "variants"
      ADD COLUMN IF NOT EXISTS "cod_article" varchar(20)
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_variants_cod_article"
      ON "variants" ("cod_article")
      WHERE "cod_article" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_variants_cod_article"`);
    await queryRunner.query(
      `ALTER TABLE "variants" DROP COLUMN IF EXISTS "cod_article"`,
    );
  }
}
