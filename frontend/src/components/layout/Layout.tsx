import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useCookieConsent } from '../../contexts/CookieConsentContext';
import { LEGAL_SITE_INFO } from '../../copy/legalSiteInfo';
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
  const { showBanner } = useCookieConsent();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Bannière promotionnelle — z-[10000] en root context pour rester au-dessus du menu mobile (z-9999) */}
      <div className="relative z-[10000]">
        <PromoBanner />
      </div>

      {/* Header fixe en haut avec barre publicitaire attachée */}
      <div className="sticky top-0 z-[9999]">
      <Header />
      </div>
      
      {/* Contenu principal - prend tout l'espace disponible */}
      <main className={cn('flex-1', showBanner && 'pb-36 sm:pb-28')}>
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
    { label: 'CGV & vente en ligne', to: '/cgv' },
    { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
    { label: 'Mentions légales', to: '/mentions-legales' },
    { label: 'Cookies', to: '/cookies' },
  ]}
  socialLinks={[
    { label: 'Instagram', href: 'https://instagram.com/reboul', target: '_blank' },
    { label: 'Facebook', href: 'https://facebook.com/reboul', target: '_blank' },
  ]}
  slogan="REBOUL STORE - Votre boutique de vêtements et accessoires"
  legalInfo={{
    companyName: LEGAL_SITE_INFO.raisonSociale,
    registeredCompany: `Société enregistrée en France - SIRET: ${LEGAL_SITE_INFO.siret}`,
    vat: `TVA: ${LEGAL_SITE_INFO.tvaIntracommunautaire}`,
  }}
/>
    </div>
  );
};
