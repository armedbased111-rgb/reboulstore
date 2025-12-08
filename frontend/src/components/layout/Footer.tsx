import { Link } from 'react-router-dom';

/**
 * Composant Footer - Pied de page
 * Structure de base avec placeholders pour :
 * - Section "À propos"
 * - Liens utiles
 * - Informations légales
 * - Réseaux sociaux
 * 
 * TODO: Remplacer le styling placeholder par les maquettes Figma/Framer
 */
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section À propos - Placeholder */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-400 text-sm">
              Reboul Store - Concept-store de mode premium et streetwear
            </p>
            {/* TODO: Ajouter contenu depuis maquette Figma/Framer */}
          </div>

          {/* Section Liens - Placeholder */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-white transition-colors">
                  Catalogue
                </Link>
              </li>
              {/* TODO: Ajouter autres liens depuis maquette Figma/Framer */}
            </ul>
          </div>

          {/* Section Contact / Réseaux sociaux - Placeholder */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm mb-4">
              Marseille / Cassis / Sanary
            </p>
            {/* TODO: Ajouter réseaux sociaux depuis maquette Figma/Framer */}
            <div className="flex gap-4">
              {/* Placeholder icônes réseaux sociaux */}
              <span className="text-gray-400 text-sm">📱 Réseaux sociaux à venir</span>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Reboul Store. Tous droits réservés.</p>
            {/* TODO: Ajouter liens légaux (Mentions légales, CGV, etc.) depuis maquette */}
            <div className="mt-4 md:mt-0 flex gap-4">
              <Link to="/legal" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link to="/cgv" className="hover:text-white transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
