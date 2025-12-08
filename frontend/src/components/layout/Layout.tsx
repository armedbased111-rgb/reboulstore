import { ReactNode } from 'react';
import { PromoBanner } from './PromoBanner';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Composant Layout - Wrapper principal de l'application
 * Structure : Header + Contenu principal + Footer
 * 
 * TODO: Remplacer le styling placeholder par les maquettes Figma/Framer
 */
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Bannière promotionnelle en haut */}
      <PromoBanner />
      
      {/* Header fixe en haut */}
      <Header />
      
      {/* Contenu principal - prend tout l'espace disponible */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer en bas */}
      <Footer />
    </div>
  );
};
