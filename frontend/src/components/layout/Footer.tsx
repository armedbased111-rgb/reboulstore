import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Interface pour les liens de navigation interne (Customer Service)
 */
export interface FooterNavLink {
  label: string;
  to: string;
}

/**
 * Interface pour les liens sociaux externes
 */
export interface FooterSocialLink {
  label: string;
  href: string;
  target?: '_blank' | '_self';
}

/**
 * Interface pour les informations légales
 */
export interface FooterLegalInfo {
  companyName: string;
  registeredCompany?: string;
  siret?: string;
  vat?: string;
}

/**
 * Props du composant Footer
 */
export interface FooterProps {
  /** Logo : texte ou composant React (SVG, etc.) */
  logo?: ReactNode;
  /** Liens de navigation Customer Service */
  customerServiceLinks?: FooterNavLink[];
  /** Liens sociaux */
  socialLinks?: FooterSocialLink[];
  /** Slogan de la marque */
  slogan?: string;
  /** Informations légales */
  legalInfo?: FooterLegalInfo;
  /** Classe CSS additionnelle pour le footer */
  className?: string;
}

/**
 * Composant Footer - Pied de page
 * Copié exactement depuis A-COLD-WALL* : minimaliste, uppercase, fond blanc, texte noir
 * Structure : Logo + Navigation (Customer Service + Social) + Slogan + Section légale
 */
export const Footer = ({
  logo,
  customerServiceLinks = [],
  socialLinks = [],
  slogan,
  legalInfo,
  className = '',
}: FooterProps) => {
  // Valeurs par défaut
  const defaultCustomerServiceLinks: FooterNavLink[] = [
    { label: 'Delivery & Returns', to: '/delivery-returns' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Refund Policy', to: '/refund' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const defaultSocialLinks: FooterSocialLink[] = [
    { label: 'Instagram', href: 'https://instagram.com/reboulstore', target: '_blank' },
    { label: 'Spotify', href: 'https://open.spotify.com', target: '_blank' },
    { label: 'Apple Music', href: 'https://music.apple.com', target: '_blank' },
  ];

  const defaultSlogan = "L'héritage marseillais du streetwear premium";

  const defaultLegalInfo: FooterLegalInfo = {
    companyName: 'REBOUL STORE',
    registeredCompany: 'Registered company in France - SIRET: [À COMPLÉTER]',
    vat: 'VAT: [À COMPLÉTER]',
  };

  // Utiliser les props ou les valeurs par défaut
  const navLinks = customerServiceLinks.length > 0 ? customerServiceLinks : defaultCustomerServiceLinks;
  const socials = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;
  const footerSlogan = slogan || defaultSlogan;
  const legal = legalInfo || defaultLegalInfo;

  // Logo par défaut - SVG exact depuis A-COLD-WALL*
  const defaultLogo = (
    <svg width="48" height="29" viewBox="0 0 48 29" xmlns="http://www.w3.org/2000/svg" fillRule="nonzero" style={{ fill: 'currentColor' }}>
      <path d="M11.697 9.764h2.3981.474 1.487h1.9811-2.614-7.457-.04-.111h-1.928L9.292 11.25h1.9221.483-1.487Zm.516-1.583.699-2.138.681 2.138h-1.38Zm10.77 3.27c.864 0 1.585-.264 2.142-.785.552-.517.902-1.199 1.033-2.0191.032-.194h-1.811-.032.126c-.09.348-.203.608-.34.78-.238.307-.58.454-1.046.454-.451 0-.813-.177-1.11-.544-.298-.372-.45-.95-.45-1.718 0-.773.146-1.375.432-1.786.277-.4.647-.593 1.128-.593.474 0.823.134 1.06.412.13.154.242.397.333.7221.036.122h1.7971-.011-.176c-.023-.478-197-.96-.519-1.437-.584-.842-1.513-1.269-2.755-1.269-.932 0-1.713.318-2.32.944-.695.714-1.046 1.737-1.046 3.038 0 1.204.309 2.17.9162.869.614.7 1.465 1.055 2.53 1.055Zm8.304-.2h1.651.894-4.368.09-.496.983 4.864h1.69812.05-7.357.06-.211h-1.8771-.989 4.321-.053.267-.94-4.588h-1.851-.838 4.302-.04.226-993-4.4-.03-.128H29.1612.092 7.446.036.122Zm-7.72-9.173L22.047.066 22 0h-1.97311.7 2.078h1.841ZM0 15.671V29h2.165V17.856h43.67V29H48V15.67H0ZM39.77 2.7831.445.319.5-.66.482.66.444-.319-.482-.7.74-.229-.164-.523-.726.237V.722h-.604v.8461-.726-.237-.163.523.741.229-.487.7Z" />
    </svg>
  );

  const footerLogo = logo || defaultLogo;

  return (
    <footer className={`uppercase pb-4 text-black bg-white text-[11px] tracking-wide ${className}`}>
      <div className="p-[2px]">
        {/* Grille exacte depuis A-COLD-WALL* : grid 2 colonnes mobile, flex horizontal desktop */}
        <div className="grid grid-cols-2 gap-y-6 items-start md:flex md:gap-x-12 md:auto-cols-auto">
          
          {/* Logo - col-span-full pour prendre toute la largeur */}
          <div className="col-span-full">
            {footerLogo}
          </div>
          
          {/* Navigation 1 : Customer Service */}
          {navLinks.length > 0 && (
            <nav>
              <ul className="grid gap-y-3 md:gap-0">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="hover:text-gray-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          
          {/* Navigation 2 : Social Media */}
          {socials.length > 0 && (
            <nav>
              <ul className="grid gap-y-3 md:gap-0">
                {socials.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      target={link.target || '_self'}
                      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="hover:text-gray-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          
          {/* Slogan - aligné à droite sur desktop */}
          {footerSlogan && (
            <span className="col-span-full md:col-auto text-[11px] md:ml-auto">
              {footerSlogan}
            </span>
          )}
        </div>
        
        {/* Section légale - exactement comme A-COLD-WALL* */}
        <div className="mt-6 md:mt-4 text-[10px] uppercase leading-relaxed text-black">
          <p>
            All contents of this website are the property of{' '}
            <span className="whitespace-nowrap">{legal.companyName}</span>. 
            No part of this site, including all text and images, may be reproduced in any form without the prior written consent of{' '}
            <span className="whitespace-nowrap">{legal.companyName}</span>.
          </p>
          <br />
          <p>Copyright © {new Date().getFullYear()}. All Rights Reserved.</p>
          {legal.registeredCompany && (
            <>
              <br />
              <p>{legal.registeredCompany}</p>
            </>
          )}
          {legal.vat && (
            <>
              <br />
              <p>{legal.vat}</p>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
