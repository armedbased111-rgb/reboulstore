import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import { Coupon, DiscountType } from '../src/entities/coupon.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'reboulstore_db',
  entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
  synchronize: false,
  logging: true,
});

async function testCoupon() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données réussie');

    const couponRepository = AppDataSource.getRepository(Coupon);

    // Vérifier si un coupon TEST10 existe déjà
    let coupon = await couponRepository.findOne({
      where: { code: 'TEST10' },
    });

    if (coupon) {
      console.log('✅ Coupon TEST10 existe déjà:', coupon);
    } else {
      // Créer un coupon de test
      coupon = couponRepository.create({
        code: 'TEST10',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        maxUses: 100,
        usedCount: 0,
        isActive: true,
        expiresAt: null,
        minPurchaseAmount: null,
      });

      coupon = await couponRepository.save(coupon);
      console.log('✅ Coupon TEST10 créé:', coupon);
    }

    // Lister tous les coupons
    const allCoupons = await couponRepository.find();
    console.log(`\n📋 Total coupons dans la base: ${allCoupons.length}`);
    allCoupons.forEach((c) => {
      console.log(`  - ${c.code} (${c.discountType}: ${c.discountValue})`);
    });

    await AppDataSource.destroy();
    console.log('\n✅ Test terminé avec succès');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testCoupon();

