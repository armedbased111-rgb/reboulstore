# 🔐 Guide d'utilisation du système d'authentification

Ce document explique comment utiliser le système d'authentification dans l'application frontend Reboul.

---

## 📦 Architecture

Le système d'authentification se compose de :

1. **`services/auth.ts`** : Service API pour communiquer avec le backend
2. **`contexts/AuthContext.tsx`** : Context React global pour gérer l'état d'authentification
3. **`hooks/useAuth.ts`** : Hook personnalisé pour accéder facilement au contexte

---

## 🚀 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du dossier `frontend/` :

```env
VITE_API_BASE_URL=http://localhost:3001
```

**Ports** :
- Frontend (Vite) : `http://localhost:3000`
- Backend (NestJS) : `http://localhost:3001`

**Note** : On utilise `VITE_API_BASE_URL` (cohérent avec les autres services existants)

---

## 📖 Utilisation du hook `useAuth()`

### Import

```typescript
import { useAuth } from '../hooks/useAuth';
```

### Propriétés disponibles

```typescript
const {
  user,              // User | null - L'utilisateur connecté
  token,             // string | null - Le token JWT
  loading,           // boolean - État de chargement initial
  isAuthenticated,   // boolean - True si user connecté
  login,             // (data: LoginData) => Promise<void>
  register,          // (data: RegisterData) => Promise<void>
  logout,            // () => void
  refreshUser,       // () => Promise<void>
} = useAuth();
```

---

## 🔑 Exemples d'utilisation

### 1. Afficher le nom de l'utilisateur connecté

```typescript
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <a href="/login">Se connecter</a>;
  }

  return (
    <div>
      <p>Bonjour {user.firstName || user.email} !</p>
    </div>
  );
}
```

---

### 2. Formulaire de connexion

```typescript
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/'); // Redirection après connexion réussie
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
```

---

### 3. Formulaire d'inscription

```typescript
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/'); // Redirection après inscription réussie
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Mot de passe (min 8 caractères)"
        required
        minLength={8}
      />
      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        placeholder="Prénom (optionnel)"
      />
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        placeholder="Nom (optionnel)"
      />
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="Téléphone (optionnel)"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}
```

---

### 4. Bouton de déconnexion

```typescript
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}
```

---

### 5. Protéger une route (composant ProtectedRoute)

```typescript
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // Attendre le chargement initial
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si pas connecté, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté, afficher le contenu
  return <>{children}</>;
}

export default ProtectedRoute;
```

**Utilisation dans les routes** :

```typescript
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Route protégée */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

---

### 6. Rafraîchir le profil utilisateur

```typescript
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const handleUpdate = async () => {
    // Après avoir modifié le profil via l'API...
    await refreshUser(); // Recharge les infos du user depuis le backend
  };

  return (
    <div>
      <h1>Mon profil</h1>
      <p>Email : {user?.email}</p>
      <p>Prénom : {user?.firstName}</p>
      <button onClick={handleUpdate}>Rafraîchir</button>
    </div>
  );
}
```

---

### 7. Vérifier le rôle de l'utilisateur

```typescript
import { useAuth } from '../hooks/useAuth';

function AdminPanel() {
  const { user, isAuthenticated } = useAuth();

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isAuthenticated || !isAdmin) {
    return <p>Accès refusé</p>;
  }

  return (
    <div>
      <h1>Panel Admin</h1>
      {/* Contenu admin */}
    </div>
  );
}
```

---

## 🔄 Persistance

Le système d'authentification **persiste automatiquement** :

- **Token JWT** : Stocké dans `localStorage` sous la clé `reboul_auth_token`
- **User** : Stocké dans `localStorage` sous la clé `reboul_user`

Au chargement de l'application, le `AuthProvider` :
1. Récupère le token depuis `localStorage`
2. Vérifie sa validité en appelant `GET /auth/me`
3. Si valide : restaure la session
4. Si invalide : nettoie le `localStorage`

**Déconnexion** : Nettoie automatiquement le `localStorage`

---

## 🧪 Tester l'authentification

### 1. Créer un compte (Insomnia/Frontend)

```typescript
await register({
  email: 'test@reboul.com',
  password: 'motdepasse123',
  firstName: 'Jean',
  lastName: 'Dupont',
});
```

### 2. Se connecter

```typescript
await login({
  email: 'test@reboul.com',
  password: 'motdepasse123',
});
```

### 3. Vérifier dans le localStorage

Ouvre les DevTools → Application → Local Storage → `http://localhost:3000`

Tu devrais voir :
- `reboul_auth_token` : `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
- `reboul_user` : `{"id":"...","email":"test@reboul.com",...}`

---

## 🔒 Sécurité

### Bonnes pratiques

✅ **Fait automatiquement** :
- Token JWT stocké côté client (localStorage)
- Token envoyé dans le header `Authorization: Bearer <token>`
- Vérification du token au chargement de l'app
- Déconnexion automatique si token invalide

⚠️ **À faire dans le futur** (Phase 18+) :
- Refresh tokens (tokens de longue durée)
- Expiration automatique
- Rate limiting (protection bruteforce)
- Vérification email
- Réinitialisation mot de passe

---

## 📚 Types TypeScript

### User

```typescript
interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### RegisterData

```typescript
interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
```

### LoginData

```typescript
interface LoginData {
  email: string;
  password: string;
}
```

---

## 🐛 Gestion des erreurs

Les fonctions `login()` et `register()` lancent des exceptions en cas d'erreur.

**Toujours les wrapper dans un try/catch** :

```typescript
try {
  await login({ email, password });
} catch (error) {
  console.error('Erreur de connexion:', error);
  // Afficher un message d'erreur à l'utilisateur
}
```

---

## ✅ Checklist d'intégration

Pour utiliser l'authentification dans ton app :

- [x] `AuthProvider` enveloppe l'App dans `main.tsx`
- [x] Fichier `.env` créé avec `VITE_API_URL=http://localhost:3001`
- [ ] Créer les pages Login et Register
- [ ] Créer le composant ProtectedRoute
- [ ] Utiliser `useAuth()` dans le Header pour afficher user
- [ ] Protéger les routes sensibles (/profile, /checkout, etc.)
- [ ] Tester login, register, logout, persistance

---

**Prêt à coder ! 🚀**
