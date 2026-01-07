import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductReference1767633000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ajouter la colonne reference à la table products
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'reference',
        type: 'varchar',
        length: '100',
        isNullable: true,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer la colonne reference
    await queryRunner.dropColumn('products', 'reference');
  }
}

