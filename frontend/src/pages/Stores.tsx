// useRef utilisé via useScrollAnimation
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page Stores - Localisation des boutiques
 * 
 * Affiche les 3 boutiques :
 * - Marseille
 * - Cassis
 * - Sanary-sur-Mer
 */
export const Stores = () => {
  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });

  const storesRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  const stores = [
    {
      id: 'marseille',
      name: 'Marseille',
      address: '123 Rue de la République, 13001 Marseille',
      phone: '+33 4 91 23 45 67',
      email: 'marseille@reboulstore.com',
      hours: {
        weekdays: '10h - 19h',
        sunday: '11h - 18h',
      },
      description: 'Notre boutique principale au cœur de la cité phocéenne.',
    },
    {
      id: 'cassis',
      name: 'Cassis',
      address: '45 Avenue des Calanques, 13260 Cassis',
      phone: '+33 4 42 01 23 45',
      email: 'cassis@reboulstore.com',
      hours: {
        weekdays: '10h - 19h',
        sunday: '11h - 18h',
      },
      description: 'Entre mer et calanques, découvrez notre sélection premium.',
    },
    {
      id: 'sanary',
      name: 'Sanary-sur-Mer',
      address: '78 Boulevard de la République, 83110 Sanary-sur-Mer',
      phone: '+33 4 94 12 34 56',
      email: 'sanary@reboulstore.com',
      hours: {
        weekdays: '10h - 19h',
        sunday: '11h - 18h',
      },
      description: 'Une touche de modernité dans cette charmante station balnéaire.',
    },
  ];

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <div className="w-full">
        {/* Hero Section */}
        <section ref={heroRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium uppercase tracking-tight mb-6">
              Nos boutiques
            </h1>
            <p className="text-base sm:text-lg text-black/70 max-w-3xl uppercase leading-relaxed">
              Retrouvez-nous dans nos trois boutiques du sud de la France.
            </p>
          </div>
        </section>

        {/* Stores Grid */}
        <section ref={storesRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="border border-black/10 rounded-md p-6 hover:border-black/30 transition-colors"
                >
                  <h2 className="text-xl sm:text-2xl font-medium uppercase tracking-tight mb-4">
                    {store.name}
                  </h2>
                  <p className="text-sm text-black/70 uppercase leading-relaxed mb-6">
                    {store.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-black/70 flex-shrink-0 mt-1" />
                      <p className="text-xs sm:text-sm text-black/70 uppercase leading-relaxed">
                        {store.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-black/70 flex-shrink-0" />
                      <a
                        href={`tel:${store.phone.replace(/\s/g, '')}`}
                        className="text-xs sm:text-sm text-black/70 uppercase hover:text-black transition-colors"
                      >
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-black/70 flex-shrink-0" />
                      <a
                        href={`mailto:${store.email}`}
                        className="text-xs sm:text-sm text-black/70 uppercase hover:text-black transition-colors"
                      >
                        {store.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-3 pt-2 border-t border-black/10">
                      <Clock className="w-4 h-4 text-black/70 flex-shrink-0 mt-1" />
                      <div className="text-xs sm:text-sm text-black/70 uppercase">
                        <p>Lun - Sam : {store.hours.weekdays}</p>
                        <p>Dim : {store.hours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

