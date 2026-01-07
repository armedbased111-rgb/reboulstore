import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthAdminProvider } from './contexts/AuthAdminContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { trackPageView } from './utils/analytics';
import Home from './pages/Home';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/reboul/products/ProductsPage';
import CreateProductPage from './pages/admin/reboul/products/CreateProductPage';
import EditProductPage from './pages/admin/reboul/products/EditProductPage';
import OrdersPage from './pages/admin/reboul/orders/OrdersPage';
import OrderDetailPage from './pages/admin/reboul/orders/OrderDetailPage';
import UsersPage from './pages/admin/reboul/users/UsersPage';
import UserDetailPage from './pages/admin/reboul/users/UserDetailPage';
import CategoriesPage from './pages/admin/reboul/categories/CategoriesPage';
import CreateCategoryPage from './pages/admin/reboul/categories/CreateCategoryPage';
import EditCategoryPage from './pages/admin/reboul/categories/EditCategoryPage';
import BrandsPage from './pages/admin/reboul/brands/BrandsPage';
import CreateBrandPage from './pages/admin/reboul/brands/CreateBrandPage';
import EditBrandPage from './pages/admin/reboul/brands/EditBrandPage';
import CollectionsPage from './pages/admin/reboul/collections/CollectionsPage';
import SettingsPage from './pages/admin/reboul/settings/SettingsPage';
import CouponsPage from './pages/admin/reboul/coupons/CouponsPage';
import CreateCouponPage from './pages/admin/reboul/coupons/CreateCouponPage';
import EditCouponPage from './pages/admin/reboul/coupons/EditCouponPage';

/**
 * Router interne avec tracking GA4
 */
function AppRouter() {
  const location = useLocation();

  // Track les changements de page (pour SPA)
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <Routes>
        {/* Route publique : Sélection de magasin */}
        <Route path="/" element={<Home />} />
        
        {/* Routes publiques : Login admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/reboul/login" element={<LoginPage />} />
        
        {/* Routes protégées */}
        <Route
          path="/admin/reboul/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/products/new"
          element={
            <ProtectedRoute>
              <CreateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/users/:id"
          element={
            <ProtectedRoute>
              <UserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/categories/new"
          element={
            <ProtectedRoute>
              <CreateCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/categories/:id/edit"
          element={
            <ProtectedRoute>
              <EditCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/brands"
          element={
            <ProtectedRoute>
              <BrandsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/brands/new"
          element={
            <ProtectedRoute>
              <CreateBrandPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/brands/:id/edit"
          element={
            <ProtectedRoute>
              <EditBrandPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/collections"
          element={
            <ProtectedRoute>
              <CollectionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/coupons"
          element={
            <ProtectedRoute>
              <CouponsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/coupons/new"
          element={
            <ProtectedRoute>
              <CreateCouponPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reboul/coupons/:id/edit"
          element={
            <ProtectedRoute>
              <EditCouponPage />
            </ProtectedRoute>
          }
        />
        
        {/* Redirection root vers dashboard si connecté, sinon login */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/reboul/dashboard" replace />}
        />
      </Routes>
  );
}

function App() {
  return (
    <AuthAdminProvider>
      <AppRouter />
    </AuthAdminProvider>
  );
}

export default App;
