import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewsletterSubscriptions1768000000000 implements MigrationInterface {
  name = 'AddNewsletterSubscriptions1768000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "newsletter_subscriptions" (
        "id" SERIAL NOT NULL,
        "email" character varying(255) NOT NULL,
        "source" character varying(64),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_newsletter_subscriptions_email" UNIQUE ("email"),
        CONSTRAINT "PK_newsletter_subscriptions" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "newsletter_subscriptions"`);
  }
}
