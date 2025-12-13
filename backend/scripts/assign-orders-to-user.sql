-- Script pour assigner 3 commandes de test à un utilisateur spécifique
-- Usage: 
--   docker exec -i reboulstore-postgres psql -U reboulstore -d reboulstore_db -v user_id='<USER_ID>' -f backend/scripts/assign-orders-to-user.sql
-- 
-- Ou avec un script bash qui demande l'ID

-- Script pour assigner 3 commandes de test à un utilisateur spécifique
-- La variable user_id doit être définie avant d'exécuter ce script
-- Exemple: \set user_id '9040c141-9056-4758-99aa-9781584ab7a1'

DO $$
DECLARE
    test_user_id UUID := :'user_id'::UUID;
    test_cart_id_1 UUID;
    test_cart_id_2 UUID;
    test_cart_id_3 UUID;
    test_order_id_1 UUID;
    test_order_id_2 UUID;
    test_order_id_3 UUID;
    test_variant_id UUID;
    user_email TEXT;
    user_name TEXT;
BEGIN
    
    -- Vérifier que l'utilisateur existe
    SELECT email, COALESCE("firstName" || ' ' || "lastName", email) INTO user_email, user_name
    FROM users WHERE id = test_user_id;
    
    IF user_email IS NULL THEN
        RAISE EXCEPTION 'Utilisateur avec ID % non trouvé', test_user_id;
    END IF;

    RAISE NOTICE '✅ Utilisateur trouvé: % (%)', user_name, user_email;

    -- Récupérer un variant existant pour les items
    SELECT id INTO test_variant_id FROM variants LIMIT 1;
    
    IF test_variant_id IS NULL THEN
        RAISE EXCEPTION 'Aucun variant trouvé dans la base de données. Veuillez créer des produits d''abord.';
    END IF;

    -- Supprimer les anciennes commandes de test pour cet utilisateur (optionnel)
    -- DELETE FROM orders WHERE "userId" = test_user_id AND status IN ('pending', 'shipped', 'delivered');

    -- Créer 3 carts de test
    test_cart_id_1 := gen_random_uuid();
    test_cart_id_2 := gen_random_uuid();
    test_cart_id_3 := gen_random_uuid();
    
    INSERT INTO carts (id, "sessionId", "createdAt", "updatedAt")
    VALUES 
        (test_cart_id_1, 'test-session-1-' || test_user_id::TEXT, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        (test_cart_id_2, 'test-session-2-' || test_user_id::TEXT, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
        (test_cart_id_3, 'test-session-3-' || test_user_id::TEXT, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

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
        jsonb_build_object(
            'name', user_name,
            'email', user_email,
            'phone', '0612345678',
            'address', jsonb_build_object(
                'street', '123 Rue de Test',
                'city', 'Marseille',
                'postalCode', '13001',
                'country', 'France'
            )
        ),
        test_user_id,
        jsonb_build_object(
            'firstName', split_part(user_name, ' ', 1),
            'lastName', COALESCE(split_part(user_name, ' ', 2), ''),
            'street', '123 Rue de Test',
            'city', 'Marseille',
            'postalCode', '13001',
            'country', 'France',
            'phone', '0612345678'
        ),
        jsonb_build_object(
            'firstName', split_part(user_name, ' ', 1),
            'lastName', COALESCE(split_part(user_name, ' ', 2), ''),
            'street', '123 Rue de Test',
            'city', 'Marseille',
            'postalCode', '13001',
            'country', 'France',
            'phone', '0612345678'
        ),
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
        jsonb_build_object(
            'name', user_name,
            'email', user_email,
            'phone', '0612345678',
            'address', jsonb_build_object(
                'street', '123 Rue de Test',
                'city', 'Marseille',
                'postalCode', '13001',
                'country', 'France'
            )
        ),
        test_user_id,
        jsonb_build_object(
            'firstName', split_part(user_name, ' ', 1),
            'lastName', COALESCE(split_part(user_name, ' ', 2), ''),
            'street', '123 Rue de Test',
            'city', 'Marseille',
            'postalCode', '13001',
            'country', 'France',
            'phone', '0612345678'
        ),
        jsonb_build_object(
            'firstName', split_part(user_name, ' ', 1),
            'lastName', COALESCE(split_part(user_name, ' ', 2), ''),
            'street', '123 Rue de Test',
            'city', 'Marseille',
            'postalCode', '13001',
            'country', 'France',
            'phone', '0612345678'
        ),
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
        jsonb_build_object(
            'name', user_name,
            'email', user_email,
            'phone', '0612345678',
            'address', jsonb_build_object(
                'street', '123 Rue de Test',
                'city', 'Marseille',
                'postalCode', '13001',
                'country', 'France'
            )
        ),
        test_user_id,
        jsonb_build_object(
            'firstName', split_part(user_name, ' ', 1),
            'lastName', COALESCE(split_part(user_name, ' ', 2), ''),
            'street', '123 Rue de Test',
            'city', 'Marseille',
            'postalCode', '13001',
            'country', 'France',
            'phone', '0612345678'
        ),
        jsonb_build_object(
            'firstName', split_part(user_name, ' ', 1),
            'lastName', COALESCE(split_part(user_name, ' ', 2), ''),
            'street', '123 Rue de Test',
            'city', 'Marseille',
            'postalCode', '13001',
            'country', 'France',
            'phone', '0612345678'
        ),
        'pi_test_789012',
        'LP987654321FR',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '12 hours',
        NOW() - INTERVAL '2 hours',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '2 hours'
    );

    RAISE NOTICE '';
    RAISE NOTICE '✅ 3 commandes créées avec succès pour %!', user_name;
    RAISE NOTICE '   - Commande 1 (PENDING): %', test_order_id_1;
    RAISE NOTICE '   - Commande 2 (SHIPPED): %', test_order_id_2;
    RAISE NOTICE '   - Commande 3 (DELIVERED): %', test_order_id_3;
    RAISE NOTICE '';
    RAISE NOTICE '📧 Email: %', user_email;
    RAISE NOTICE '';
    RAISE NOTICE 'Connecte-toi avec cet utilisateur pour voir les commandes!';
END $$;

