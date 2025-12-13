-- Script pour créer 3 commandes de test pour un utilisateur
-- Usage: psql -U reboulstore -d reboulstore_db -f scripts/create-test-orders.sql
-- Ou via Docker: docker exec -i reboulstore-postgres psql -U reboulstore -d reboulstore_db < scripts/create-test-orders.sql

-- 1. Trouver ou créer un utilisateur de test
DO $$
DECLARE
    test_user_id UUID;
    test_cart_id_1 UUID;
    test_cart_id_2 UUID;
    test_cart_id_3 UUID;
    test_order_id_1 UUID;
    test_order_id_2 UUID;
    test_order_id_3 UUID;
    test_variant_id UUID;
BEGIN
    -- Trouver un utilisateur existant (ou utiliser le premier disponible)
    SELECT id INTO test_user_id FROM users LIMIT 1;
    
    -- Si aucun utilisateur n'existe, en créer un
    IF test_user_id IS NULL THEN
        INSERT INTO users (id, email, password, "firstName", "lastName", role, "isVerified", "createdAt", "updatedAt")
        VALUES (
            gen_random_uuid(),
            'test@reboulstore.com',
            '$2b$10$rQZ8XK9YvJZ8XK9YvJZ8XOuZ8XK9YvJZ8XK9YvJZ8XK9YvJZ8XK9Y', -- password: test123
            'Test',
            'User',
            'CLIENT',
            true,
            NOW(),
            NOW()
        )
        RETURNING id INTO test_user_id;
        
        RAISE NOTICE 'Utilisateur créé avec ID: %', test_user_id;
    ELSE
        RAISE NOTICE 'Utilisateur trouvé avec ID: %', test_user_id;
    END IF;

    -- Récupérer un variant existant pour les items
    SELECT id INTO test_variant_id FROM variants LIMIT 1;
    
    IF test_variant_id IS NULL THEN
        RAISE EXCEPTION 'Aucun variant trouvé dans la base de données. Veuillez créer des produits d''abord.';
    END IF;

    -- Créer 3 carts de test
    test_cart_id_1 := gen_random_uuid();
    test_cart_id_2 := gen_random_uuid();
    test_cart_id_3 := gen_random_uuid();
    
    INSERT INTO carts (id, "sessionId", "createdAt", "updatedAt")
    VALUES 
        (test_cart_id_1, 'test-session-1', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        (test_cart_id_2, 'test-session-2', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
        (test_cart_id_3, 'test-session-3', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

    -- Créer des items pour chaque cart
    INSERT INTO cart_items (id, "cartId", "variantId", quantity, "createdAt")
    VALUES 
        (gen_random_uuid(), test_cart_id_1, test_variant_id, 2, NOW() - INTERVAL '5 days'),
        (gen_random_uuid(), test_cart_id_2, test_variant_id, 1, NOW() - INTERVAL '3 days'),
        (gen_random_uuid(), test_cart_id_3, test_variant_id, 3, NOW() - INTERVAL '1 day');

    -- Créer 3 commandes avec différents statuts
    test_order_id_1 := gen_random_uuid();
    test_order_id_2 := gen_random_uuid();
    test_order_id_3 := gen_random_uuid();

    -- Commande 1: PENDING (en attente)
    INSERT INTO orders (
        id, "cartId", status, total, "customerInfo", "userId",
        "shippingAddress", "billingAddress",
        "createdAt", "updatedAt"
    )
    VALUES (
        test_order_id_1,
        test_cart_id_1,
        'pending',
        165.00,
        '{"name": "Test User", "email": "test@reboulstore.com", "phone": "0612345678", "address": {"street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France"}}'::jsonb,
        test_user_id,
        '{"firstName": "Test", "lastName": "User", "street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France", "phone": "0612345678"}'::jsonb,
        '{"firstName": "Test", "lastName": "User", "street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France", "phone": "0612345678"}'::jsonb,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
    );

    -- Commande 2: SHIPPED (expédiée)
    INSERT INTO orders (
        id, "cartId", status, total, "customerInfo", "userId",
        "shippingAddress", "billingAddress",
        "paymentIntentId", "trackingNumber",
        "paidAt", "shippedAt",
        "createdAt", "updatedAt"
    )
    VALUES (
        test_order_id_2,
        test_cart_id_2,
        'shipped',
        82.50,
        '{"name": "Test User", "email": "test@reboulstore.com", "phone": "0612345678", "address": {"street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France"}}'::jsonb,
        test_user_id,
        '{"firstName": "Test", "lastName": "User", "street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France", "phone": "0612345678"}'::jsonb,
        '{"firstName": "Test", "lastName": "User", "street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France", "phone": "0612345678"}'::jsonb,
        'pi_test_123456',
        'LP123456789FR',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '1 day'
    );

    -- Commande 3: DELIVERED (livrée)
    INSERT INTO orders (
        id, "cartId", status, total, "customerInfo", "userId",
        "shippingAddress", "billingAddress",
        "paymentIntentId", "trackingNumber",
        "paidAt", "shippedAt", "deliveredAt",
        "createdAt", "updatedAt"
    )
    VALUES (
        test_order_id_3,
        test_cart_id_3,
        'delivered',
        247.50,
        '{"name": "Test User", "email": "test@reboulstore.com", "phone": "0612345678", "address": {"street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France"}}'::jsonb,
        test_user_id,
        '{"firstName": "Test", "lastName": "User", "street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France", "phone": "0612345678"}'::jsonb,
        '{"firstName": "Test", "lastName": "User", "street": "123 Rue de Test", "city": "Marseille", "postalCode": "13001", "country": "France", "phone": "0612345678"}'::jsonb,
        'pi_test_789012',
        'LP987654321FR',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '12 hours',
        NOW() - INTERVAL '2 hours',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '2 hours'
    );

    RAISE NOTICE '✅ 3 commandes créées avec succès!';
    RAISE NOTICE '   - Commande 1 (PENDING): %', test_order_id_1;
    RAISE NOTICE '   - Commande 2 (SHIPPED): %', test_order_id_2;
    RAISE NOTICE '   - Commande 3 (DELIVERED): %', test_order_id_3;
    RAISE NOTICE '';
    RAISE NOTICE '📧 Email utilisateur: test@reboulstore.com';
    RAISE NOTICE '🔑 Mot de passe: test123';
    RAISE NOTICE '';
    RAISE NOTICE 'Connecte-toi avec cet utilisateur pour voir les commandes!';
END $$;

