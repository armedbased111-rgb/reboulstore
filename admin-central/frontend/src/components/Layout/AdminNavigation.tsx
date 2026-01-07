import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, X, Folder, Tag, Settings, Archive, Ticket } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Navigation avec tabs animées Aceternity UI
 */
export default function AdminNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Déterminer l'onglet actif basé sur l'URL
  const getActiveTab = () => {
    if (location.pathname.includes('/dashboard')) return 'dashboard';
    if (location.pathname.includes('/products')) return 'products';
    if (location.pathname.includes('/categories')) return 'categories';
    if (location.pathname.includes('/brands')) return 'brands';
    if (location.pathname.includes('/collections')) return 'collections';
    if (location.pathname.includes('/coupons')) return 'coupons';
    if (location.pathname.includes('/orders')) return 'orders';
    if (location.pathname.includes('/users')) return 'users';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const tabs = [
    {
      title: 'Dashboard',
      value: 'dashboard',
      icon: LayoutDashboard,
      onClick: () => {
        navigate('/admin/reboul/dashboard');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Produits',
      value: 'products',
      icon: Package,
      onClick: () => {
        navigate('/admin/reboul/products');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Catégories',
      value: 'categories',
      icon: Folder,
      onClick: () => {
        navigate('/admin/reboul/categories');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Marques',
      value: 'brands',
      icon: Tag,
      onClick: () => {
        navigate('/admin/reboul/brands');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Collections',
      value: 'collections',
      icon: Archive,
      onClick: () => {
        navigate('/admin/reboul/collections');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Codes Promo',
      value: 'coupons',
      icon: Ticket,
      onClick: () => {
        navigate('/admin/reboul/coupons');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Commandes',
      value: 'orders',
      icon: ShoppingCart,
      onClick: () => {
        navigate('/admin/reboul/orders');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Utilisateurs',
      value: 'users',
      icon: Users,
      onClick: () => {
        navigate('/admin/reboul/users');
        setIsMobileMenuOpen(false);
      },
    },
    {
      title: 'Paramètres',
      value: 'settings',
      icon: Settings,
      onClick: () => {
        navigate('/admin/reboul/settings');
        setIsMobileMenuOpen(false);
      },
    },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    tab.onClick();
  };

  const activeTabValue = getActiveTab();

  // Fermer le menu mobile si on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop/Tablette : Tabs horizontales */}
      <div className="hidden md:flex flex-row items-center justify-start [perspective:1000px] relative overflow-x-auto overflow-y-hidden no-visible-scrollbar max-w-full py-3 -mx-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.value === activeTabValue;
          
          return (
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab)}
              className="relative px-3 md:px-4 py-2 rounded-full flex items-center space-x-1.5 md:space-x-2 transition-colors flex-shrink-0"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className="absolute inset-0 bg-black rounded-full"
                />
              )}
              <Icon className={cn(
                "w-4 h-4 md:w-4 md:h-4 relative z-10 transition-colors flex-shrink-0",
                isActive ? "text-white" : "text-gray-600"
              )} />
              <span className={cn(
                "relative z-10 text-xs md:text-sm font-medium transition-colors whitespace-nowrap",
                isActive ? "text-white" : "text-gray-600"
              )}>
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile : Menu hamburger */}
      <div className="md:hidden py-2 relative z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[44px] touch-manipulation"
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {(() => {
              const activeTab = tabs.find(t => t.value === activeTabValue);
              const ActiveIcon = activeTab?.icon;
              return ActiveIcon ? (
                <>
                  <ActiveIcon className="w-5 h-5 text-gray-700 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {activeTab.title}
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-700">Menu</span>
              );
            })()}
          </div>
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-700 flex-shrink-0 ml-2" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700 flex-shrink-0 ml-2" />
          )}
        </button>

        {/* Menu mobile dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-[60px] bg-white border-b border-gray-200 shadow-lg z-50 overflow-hidden rounded-b-lg max-h-[calc(100vh-80px)] overflow-y-auto"
              style={{ marginTop: '0' }}
            >
                <div className="px-2 py-2 space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.value === activeTabValue;
                    
                    return (
                      <button
                        key={tab.value}
                        onClick={() => handleTabClick(tab)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors min-h-[44px] touch-manipulation",
                          isActive 
                            ? "bg-black text-white" 
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        )}
                      >
                        <Icon className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive ? "text-white" : "text-gray-600"
                        )} />
                        <span className="text-sm font-medium flex-1 text-left">{tab.title}</span>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

