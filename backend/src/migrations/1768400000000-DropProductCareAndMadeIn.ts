import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropProductCareAndMadeIn1768400000000 implements MigrationInterface {
  name = 'DropProductCareAndMadeIn1768400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN IF EXISTS "care_instructions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN IF EXISTS "made_in"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "care_instructions" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "made_in" character varying(100)`,
    );
  }
}
