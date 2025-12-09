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
      <Footer
  logo={
    <img
      src="https://res.cloudinary.com/dxen69pdo/image/upload/v1753365190/logo_w_hzhfoc.png"
      alt="REBOUL STORE"
      className="w-full h-[40px] object-contain filter invert ml-[2px]"
      style={{ filter: 'invert(1)' }}
    />
  }
  customerServiceLinks={[
    { label: 'Livraison', to: '/livraison' },
    { label: 'CGV', to: '/cgv' },
    { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
    { label: 'Conditions générales de vente', to: '/conditions-generales-de-vente' },
    { label: 'Mentions légales', to: '/mentions-legales' },
    { label: 'Cookies', to: '/cookies' },
  ]}
  socialLinks={[
    { label: 'Instagram', href: 'https://instagram.com/reboul', target: '_blank' },
    { label: 'Facebook', href: 'https://facebook.com/reboul', target: '_blank' },
  ]}
  slogan="REBOUL STORE - Votre boutique de vêtements et accessoires"
  legalInfo={{
    companyName: 'REBOUL STORE',
    registeredCompany: 'Société enregistrée en France - SIRET: 92802711500012',
    vat: 'TVA: FR92802711500012',
  }}
/>
    </div>
  );
};
