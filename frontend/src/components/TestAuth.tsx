import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function TestAuth() {
  const { user, isAuthenticated, loading, login, register, logout } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: 'test@reboul.com',
    password: 'motdepasse123',
  });

  const [registerData, setRegisterData] = useState({
    email: 'nouveau@reboul.com',
    password: 'motdepasse123',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '0612345678',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    setActionLoading(true);
    try {
      await login(loginData);
      setSuccess('✅ Connexion réussie !');
    } catch (err: any) {
      setError(`❌ Erreur login: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setActionLoading(true);
    try {
      await register(registerData);
      setSuccess('✅ Inscription réussie !');
    } catch (err: any) {
      setError(`❌ Erreur register: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setSuccess('✅ Déconnexion réussie !');
    setError('');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>🔄 Chargement de la session...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🔐 Test Authentification</h1>
      
      {/* État actuel */}
      <div style={{ 
        padding: '20px', 
        marginBottom: '20px', 
        backgroundColor: isAuthenticated ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isAuthenticated ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '5px'
      }}>
        <h2>📊 État actuel</h2>
        <p><strong>Authentifié :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
        {isAuthenticated && user && (
          <>
            <p><strong>ID :</strong> {user.id}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Prénom :</strong> {user.firstName || 'Non renseigné'}</p>
            <p><strong>Nom :</strong> {user.lastName || 'Non renseigné'}</p>
            <p><strong>Téléphone :</strong> {user.phone || 'Non renseigné'}</p>
            <p><strong>Rôle :</strong> {user.role}</p>
            <p><strong>Vérifié :</strong> {user.isVerified ? '✅' : '❌'}</p>
          </>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div style={{ 
          padding: '15px', 
          marginBottom: '20px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: '15px', 
          marginBottom: '20px', 
          backgroundColor: '#d4edda', 
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '5px'
        }}>
          {success}
        </div>
      )}

      {!isAuthenticated ? (
        <>
          {/* Formulaire Login */}
          <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>🔑 Connexion</h2>
            <div style={{ marginBottom: '10px' }}>
              <label>Email :</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Mot de passe :</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px'
                }}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={actionLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              {actionLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          {/* Formulaire Register */}
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>📝 Inscription</h2>
            <div style={{ marginBottom: '10px' }}>
              <label>Email :</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Mot de passe (min 8 caractères) :</label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Prénom :</label>
              <input
                type="text"
                value={registerData.firstName}
                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Nom :</label>
              <input
                type="text"
                value={registerData.lastName}
                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Téléphone :</label>
              <input
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px'
                }}
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={actionLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              {actionLoading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* User connecté */}
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>👤 Profil</h2>
            <p>Vous êtes connecté en tant que <strong>{user?.email}</strong></p>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Se déconnecter
            </button>
          </div>

          {/* Check localStorage */}
          <div style={{ padding: '20px', marginTop: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
            <h2>💾 localStorage</h2>
            <p><strong>Token stocké :</strong> {localStorage.getItem('reboul_auth_token') ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>User stocké :</strong> {localStorage.getItem('reboul_user') ? '✅ Oui' : '❌ Non'}</p>
            <details>
              <summary style={{ cursor: 'pointer', color: '#007bff' }}>Voir le token</summary>
              <pre style={{ 
                backgroundColor: '#fff', 
                padding: '10px', 
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px',
                border: '1px solid #ddd'
              }}>
                {localStorage.getItem('reboul_auth_token') || 'Aucun token'}
              </pre>
            </details>
          </div>
        </>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '5px' }}>
        <h3>📝 Instructions de test :</h3>
        <ol>
          <li>Teste d'abord l'<strong>inscription</strong> avec un nouvel email</li>
          <li>Si tu as déjà un compte, utilise la <strong>connexion</strong></li>
          <li>Une fois connecté, <strong>recharge la page</strong> (F5) → La session doit persister !</li>
          <li>Clique sur <strong>Déconnexion</strong> → Le localStorage doit être nettoyé</li>
          <li>Vérifie dans DevTools → Application → Local Storage</li>
        </ol>
      </div>
    </div>
  );
}
