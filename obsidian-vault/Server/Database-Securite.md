# 🗄️ Database & Sécurité - Documentation Complète

**Version** : 1.0  
**Date** : 05/01/2026  
**Statut** : ✅ Documentation complète

Voir aussi : [[../Canvas/Workflow-Database-Securite.canvas|Workflow Database & Sécurité]] - [[../Canvas/Regle-Database.canvas|Règle Database]] - [[../Canvas/Regle-Deploiement.canvas|Règle Déploiement]]

---

## 📋 Vue d'ensemble

Cette documentation couvre **toute la gestion de la base de données** et les **règles de sécurité** pour protéger les données et éviter les pertes.

---

## 💾 Sauvegarde Automatique

### Règle Fondamentale

**TOUTE modification risquée de la base de données DOIT être précédée d'une sauvegarde automatique.**

### Quand sauvegarder automatiquement

L'IA DOIT sauvegarder automatiquement la base de données dans ces cas :

#### 1. Avant chaque migration
- ✅ **OBLIGATOIRE** : Sauvegarder avant d'exécuter une migration
- ✅ Utiliser : `./rcli db backup --server`
- ✅ Vérifier que le backup a réussi avant de continuer
- ✅ Si le backup échoue → **NE PAS exécuter la migration**

#### 2. Avant toute modification de schéma
- ✅ Avant `ALTER TABLE` (ajout/suppression de colonnes)
- ✅ Avant `DROP TABLE` ou `DROP COLUMN`
- ✅ Avant `TRUNCATE TABLE`
- ✅ Avant modification de contraintes (foreign keys, unique, etc.)

#### 3. Avant opérations de nettoyage massif
- ✅ Avant `DELETE FROM table WHERE ...` (suppressions en masse)
- ✅ Avant scripts de nettoyage de données
- ✅ Avant migrations de données (transformation de données)

#### 4. Avant corrections de bugs critiques
- ✅ Si correction d'un bug qui modifie la structure de la DB
- ✅ Si correction qui peut affecter les données existantes

#### 5. Avant déploiement
- ✅ **OBLIGATOIRE** : Sauvegarder avant chaque déploiement
- ✅ Utiliser : `./rcli server backup --full` (DB + fichiers + configs)

### Processus de sauvegarde automatique

**Étape 1 : Détection de l'opération risquée**
- L'IA détecte qu'une opération va modifier la base de données
- Exemples : migration, `ALTER TABLE`, `DROP`, `DELETE` massif, etc.

**Étape 2 : Sauvegarde automatique (OBLIGATOIRE)**
```bash
# Sauvegarde automatique avant opération risquée
./rcli db backup --server
```

**Étape 3 : Vérification du succès**
- ✅ Vérifier que le backup a réussi (code de retour, fichier créé)
- ✅ Si échec → **BLOQUER l'opération** et informer l'utilisateur
- ✅ Afficher le nom du fichier de backup créé

**Étape 4 : Exécution de l'opération**
- ✅ Seulement si le backup a réussi
- ✅ Exécuter l'opération demandée
- ✅ Vérifier le résultat

**Étape 5 : Confirmation**
- ✅ Informer l'utilisateur que le backup a été créé
- ✅ Donner le nom du fichier de backup
- ✅ Rappeler comment restaurer si nécessaire

### Sauvegardes automatiques programmées

#### Backup automatique quotidien (cron job)

**Configuration** :
- ✅ Configuré via : `./rcli server cron --enable-backup`
- ✅ Exécution : Tous les jours à 2h du matin
- ✅ Conservation : 30 derniers backups automatiquement

**Emplacement** : `/opt/reboulstore/backups/`

**Format** : `reboulstore_db_YYYYMMDD_HHMMSS.sql.gz`

**Vérification** :
```bash
# Vérifier les backups automatiques (cron)
./rcli server cron --list

# Lister les backups disponibles
./rcli db backup-list
```

#### Backup avant déploiement

**Workflow recommandé** : `./rcli server backup --full`
- ✅ Sauvegarde DB + fichiers + configs
- ✅ Avant chaque déploiement en production

### Gestion des backups

**Emplacement** : `/opt/reboulstore/backups/` (serveur)

**Nommage** : `reboulstore_db_YYYYMMDD_HHMMSS.sql.gz`

**Conservation** :
- ✅ 30 derniers backups automatiques (cron quotidien)
- ✅ Backups manuels : conservés jusqu'à suppression manuelle
- ✅ Backups avant migrations : conservés (important pour rollback)

**Restoration** :
```bash
# Lister les backups disponibles
./rcli db backup-list

# Restaurer un backup
./rcli db backup-restore reboulstore_db_20251231_085357.sql.gz --yes
```

---

## 🔒 Sécurité sur la Suppression des Données

### Règles Critiques

#### ❌ INTERDICTIONS ABSOLUES

**JAMAIS exécuter** :
- ❌ `DELETE FROM table` sans backup préalable
- ❌ `TRUNCATE TABLE` sans backup préalable
- ❌ `DROP TABLE` sans backup préalable
- ❌ Suppression en cascade sans vérification des dépendances
- ❌ Suppression de données utilisateur sans vérification des commandes actives
- ❌ Suppression de données critiques (produits, commandes) sans confirmation explicite

#### ✅ OBLIGATOIRES

**TOUJOURS faire** :
- ✅ **Backup automatique AVANT** toute suppression
- ✅ **Vérifier les dépendances** (foreign keys, relations)
- ✅ **Vérifier les commandes actives** avant suppression utilisateur
- ✅ **Soft delete** si possible (au lieu de DELETE)
- ✅ **Logs d'audit** pour toutes les suppressions
- ✅ **Confirmation utilisateur** pour suppressions critiques

### Workflow de Suppression Sécurisée

#### Étape 1 : Backup Automatique (OBLIGATOIRE)

```bash
# Sauvegarde automatique avant suppression
./rcli db backup --server
```

**Vérification** :
- ✅ Vérifier que le backup a réussi
- ✅ Si échec → **BLOQUER la suppression**

#### Étape 2 : Vérification des Dépendances

**Avant suppression d'un enregistrement** :
- ✅ Vérifier les foreign keys (relations)
- ✅ Vérifier les commandes actives (pour utilisateurs)
- ✅ Vérifier les références dans d'autres tables

**Exemples** :
```sql
-- Vérifier commandes actives avant suppression utilisateur
SELECT COUNT(*) FROM orders WHERE userId = 'xxx' AND status IN ('PENDING', 'PAID', 'PROCESSING');

-- Vérifier produits dans paniers avant suppression produit
SELECT COUNT(*) FROM cart_items WHERE variantId IN (SELECT id FROM variants WHERE productId = 'xxx');
```

#### Étape 3 : Soft Delete (Préféré)

**Principe** : Au lieu de supprimer définitivement, marquer comme supprimé.

**Avantages** :
- ✅ Récupération possible
- ✅ Historique conservé
- ✅ Audit trail complet
- ✅ Pas de perte de données

**Implémentation** :
```typescript
// Entité avec soft delete
@Entity('products')
export class Product {
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string | null; // User ID qui a supprimé
}
```

**Requêtes** :
```typescript
// Ne récupérer que les produits non supprimés
const products = await productRepository.find({
  where: { isDeleted: false }
});

// Soft delete
product.isDeleted = true;
product.deletedAt = new Date();
product.deletedBy = userId;
await productRepository.save(product);
```

#### Étape 4 : Suppression Définitive (Si nécessaire)

**Seulement si** :
- ✅ Soft delete n'est pas possible
- ✅ Backup a réussi
- ✅ Dépendances vérifiées
- ✅ Confirmation utilisateur obtenue

**Processus** :
```typescript
// 1. Backup automatique (déjà fait)
// 2. Vérifier dépendances
const hasActiveOrders = await this.checkActiveOrders(userId);
if (hasActiveOrders) {
  throw new BadRequestException('Cannot delete user with active orders');
}

// 3. Supprimer
await userRepository.delete(userId);

// 4. Logs d'audit
await this.auditLogService.log({
  action: 'DELETE_USER',
  userId: adminId,
  targetId: userId,
  reason: 'User deletion requested',
  timestamp: new Date()
});
```

#### Étape 5 : Logs d'Audit

**Toutes les suppressions DOIVENT être loggées** :

```typescript
// Service d'audit
@Injectable()
export class AuditLogService {
  async log(data: {
    action: string;
    userId: string;
    targetId: string;
    targetType: string;
    reason?: string;
    data?: any;
  }) {
    await this.auditLogRepository.save({
      action: data.action,
      userId: data.userId,
      targetId: data.targetId,
      targetType: data.targetType,
      reason: data.reason,
      data: data.data,
      timestamp: new Date()
    });
  }
}
```

**Informations à logger** :
- ✅ Action (DELETE_USER, DELETE_PRODUCT, etc.)
- ✅ User ID (qui a supprimé)
- ✅ Target ID (ce qui a été supprimé)
- ✅ Target Type (User, Product, Order, etc.)
- ✅ Raison (optionnel)
- ✅ Données supprimées (optionnel, pour récupération)
- ✅ Timestamp

#### Étape 6 : Vérification Post-Suppression

**Après suppression** :
- ✅ Vérifier que les données ont bien été supprimées
- ✅ Vérifier que les dépendances sont gérées (cascade ou null)
- ✅ Vérifier les logs d'audit
- ✅ Notification admin si nécessaire

### Exemples Concrets

#### Exemple 1 : Suppression Utilisateur

```typescript
// 1. Backup automatique (IA fait automatiquement)
await this.backupService.createBackup();

// 2. Vérifier commandes actives
const activeOrders = await this.ordersService.findActiveByUser(userId);
if (activeOrders.length > 0) {
  throw new BadRequestException(
    `Cannot delete user with ${activeOrders.length} active orders`
  );
}

// 3. Soft delete (préféré)
user.isDeleted = true;
user.deletedAt = new Date();
user.deletedBy = adminId;
await this.userRepository.save(user);

// 4. Logs d'audit
await this.auditLogService.log({
  action: 'DELETE_USER',
  userId: adminId,
  targetId: userId,
  targetType: 'User',
  reason: 'User deletion requested by admin'
});
```

#### Exemple 2 : Suppression Produit

```typescript
// 1. Backup automatique
await this.backupService.createBackup();

// 2. Vérifier paniers actifs
const activeCarts = await this.cartService.findByProduct(productId);
if (activeCarts.length > 0) {
  throw new BadRequestException(
    `Cannot delete product in ${activeCarts.length} active carts`
  );
}

// 3. Soft delete
product.isDeleted = true;
product.deletedAt = new Date();
product.deletedBy = adminId;
await this.productRepository.save(product);

// 4. Logs
await this.auditLogService.log({
  action: 'DELETE_PRODUCT',
  userId: adminId,
  targetId: productId,
  targetType: 'Product'
});
```

#### Exemple 3 : Nettoyage Anciennes Données

```typescript
// 1. Backup automatique
await this.backupService.createBackup();

// 2. Vérifier ce qui sera supprimé
const oldCarts = await this.cartRepository.find({
  where: {
    createdAt: LessThan(subDays(new Date(), 90))
  }
});

console.log(`Will delete ${oldCarts.length} old carts`);

// 3. Supprimer (après confirmation)
await this.cartRepository.delete({
  createdAt: LessThan(subDays(new Date(), 90))
});

// 4. Logs
await this.auditLogService.log({
  action: 'CLEANUP_OLD_CARTS',
  userId: 'system',
  targetType: 'Cart',
  data: { count: oldCarts.length }
});
```

---

## 🔄 Restauration

### Processus de Restauration

**Si problème après suppression** :

#### 1. Lister les backups disponibles

```bash
./rcli db backup-list
```

#### 2. Choisir le backup à restaurer

**Critères** :
- ✅ Backup créé AVANT la suppression
- ✅ Backup le plus récent possible
- ✅ Vérifier la taille du backup (doit contenir des données)

#### 3. Restaurer le backup

```bash
./rcli db backup-restore reboulstore_db_20251231_085357.sql.gz --yes
```

**⚠️ ATTENTION** : Cette opération **ÉCRASE** complètement la base de données actuelle !

#### 4. Vérifier la restauration

```bash
# Vérifier que les données sont restaurées
docker exec reboulstore-postgres psql -U reboulstore -d reboulstore_db -c "SELECT COUNT(*) FROM products;"
docker exec reboulstore-postgres psql -U reboulstore -d reboulstore_db -c "SELECT COUNT(*) FROM users;"
```

---

## 📊 Audit & Logs

### Logs d'Audit

**Toutes les suppressions DOIVENT être loggées** :

#### Entité AuditLog

```typescript
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  action: string; // DELETE_USER, DELETE_PRODUCT, etc.

  @Column({ type: 'uuid' })
  userId: string; // Qui a fait l'action

  @Column({ type: 'uuid', nullable: true })
  targetId: string; // Ce qui a été supprimé

  @Column({ type: 'varchar', length: 50 })
  targetType: string; // User, Product, Order, etc.

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any; // Données supprimées (pour récupération)

  @CreateDateColumn()
  timestamp: Date;
}
```

### Consultation des Logs

**Via CLI** :
```bash
# Rechercher les suppressions
./rcli logs search "DELETE" --last 1h

# Voir les erreurs
./rcli logs errors --last 1h

# Voir l'activité utilisateur
./rcli logs user-activity --last 1h --top 20
```

**Via API** :
```typescript
// GET /admin/audit-logs
// Filtres : action, userId, targetType, date range
```

---

## ✅ Checklist de Sécurité

### Avant Toute Suppression

- [ ] **Backup automatique créé** : `./rcli db backup --server`
- [ ] **Vérification dépendances** : Foreign keys, relations
- [ ] **Vérification commandes actives** : Pour utilisateurs
- [ ] **Soft delete préféré** : Si possible
- [ ] **Confirmation utilisateur** : Pour suppressions critiques

### Pendant la Suppression

- [ ] **Exécution sécurisée** : Transaction si possible
- [ ] **Logs d'audit** : Enregistrer toutes les informations
- [ ] **Gestion erreurs** : Rollback si problème

### Après la Suppression

- [ ] **Vérification données** : Vérifier que la suppression a réussi
- [ ] **Vérification dépendances** : Vérifier que les relations sont gérées
- [ ] **Logs vérifiés** : Vérifier que les logs sont enregistrés
- [ ] **Notification admin** : Si nécessaire

---

## 🛡️ Bonnes Pratiques

### ✅ À FAIRE

- ✅ **Toujours faire un backup** avant modification risquée
- ✅ **Préférer soft delete** à DELETE définitif
- ✅ **Vérifier les dépendances** avant suppression
- ✅ **Logger toutes les suppressions** pour audit
- ✅ **Tester la restauration** régulièrement
- ✅ **Conserver plusieurs backups** (30 derniers automatiquement)
- ✅ **Vérifier les backups** avant de les utiliser

### ❌ À ÉVITER

- ❌ **Supprimer sans backup** préalable
- ❌ **Supprimer sans vérifier les dépendances**
- ❌ **Supprimer des données utilisateur** avec commandes actives
- ❌ **Supprimer définitivement** si soft delete est possible
- ❌ **Ignorer les logs d'audit**
- ❌ **Restaurer en production** sans vérifier le backup
- ❌ **Supprimer tous les backups** (le système garde automatiquement les 30 derniers)

---

## 📚 Références

- **Canvas Workflow** : [[../Canvas/Workflow-Database-Securite.canvas|Workflow Database & Sécurité]]
- **Règle Database** : [[../Canvas/Regle-Database.canvas|Règle Database]]
- **Règle Déploiement** : [[../Canvas/Regle-Deploiement.canvas|Règle Déploiement]]
- **CLI Backup** : `cli/BACKUP_EXPLAINED.md`
- **Backup & Logs** : `docs/server/BACKUP_AND_LOGS.md`
- **Roadmap** : `docs/context/ROADMAP_COMPLETE.md`

---

## 🔗 Liens Utiles

- **Commandes CLI** : `./rcli db backup --help`
- **Documentation CLI** : `cli/CLI_SERVER_COMMANDS.md`
- **Scripts Backup** : `scripts/backup-db.sh`
- **Configuration Cron** : `scripts/setup-backup-cron.sh`

