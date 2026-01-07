import axios from 'axios';

const API_URL = 'http://localhost:3001';
const SESSION_ID = `test-session-${Date.now()}`;

async function testCouponApply() {
  try {
    console.log('🧪 Test application coupon\n');

    // 1. Récupérer un produit avec variant
    console.log('1️⃣ Récupération d\'un produit...');
    const productsRes = await axios.get(`${API_URL}/products?limit=1`);
    if (productsRes.data.length === 0) {
      console.log('❌ Aucun produit trouvé');
      return;
    }
    const product = productsRes.data[0];
    console.log(`✅ Produit trouvé: ${product.name}`);

    // 2. Récupérer le panier (créé automatiquement)
    console.log('\n2️⃣ Récupération du panier...');
    const cartRes = await axios.get(`${API_URL}/cart?sessionId=${SESSION_ID}`);
    const cart = cartRes.data;
    console.log(`✅ Panier créé: ${cart.id}`);

    // 3. Ajouter un produit au panier
    console.log('\n3️⃣ Ajout d\'un produit au panier...');
    if (!product.variants || product.variants.length === 0) {
      console.log('❌ Aucun variant trouvé pour ce produit');
      return;
    }
    const variantId = product.variants[0].id;
    await axios.post(`${API_URL}/cart/items?sessionId=${SESSION_ID}`, {
      variantId,
      quantity: 1,
    });
    console.log(`✅ Produit ajouté (variant: ${variantId})`);

    // 4. Récupérer le panier avec total
    console.log('\n4️⃣ Calcul du total du panier...');
    const cartWithTotal = await axios.get(`${API_URL}/cart?sessionId=${SESSION_ID}`);
    const total = cartWithTotal.data.total;
    console.log(`✅ Total du panier: ${total}€`);

    // 5. Appliquer le coupon TEST10
    console.log('\n5️⃣ Application du coupon TEST10...');
    const couponRes = await axios.post(`${API_URL}/orders/apply-coupon`, {
      code: 'TEST10',
      cartId: cart.id,
    });
    console.log('✅ Réponse:', JSON.stringify(couponRes.data, null, 2));

    // 6. Vérifier les calculs
    console.log('\n6️⃣ Vérification des calculs...');
    const { discountAmount, totalBeforeDiscount, totalAfterDiscount } = couponRes.data;
    const expectedDiscount = (totalBeforeDiscount * 10) / 100;
    const expectedTotal = totalBeforeDiscount - expectedDiscount;

    console.log(`   Total avant réduction: ${totalBeforeDiscount}€`);
    console.log(`   Réduction (10%): ${discountAmount}€`);
    console.log(`   Total après réduction: ${totalAfterDiscount}€`);
    console.log(`   Réduction attendue: ${expectedDiscount.toFixed(2)}€`);
    console.log(`   Total attendu: ${expectedTotal.toFixed(2)}€`);

    if (Math.abs(discountAmount - expectedDiscount) < 0.01) {
      console.log('✅ Calcul de réduction correct');
    } else {
      console.log('❌ Erreur dans le calcul de réduction');
    }

    console.log('\n✅ Test terminé avec succès !');
  } catch (error: any) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    process.exit(1);
  }
}

testCouponApply();

