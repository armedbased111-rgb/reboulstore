import { useState, useRef } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { animateRevealUp } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page Contact - Formulaire de contact + informations boutique
 */
export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const heroRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.1 });

  const formRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.2, distance: 40 });
  }, { threshold: 0.2 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // TODO: Implémenter l'envoi du formulaire via API
    // Pour l'instant, simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow">
      <div className="w-full">
        {/* Hero Section */}
        <section ref={heroRef} className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium uppercase tracking-tight mb-6">
              Contact
            </h1>
            <p className="text-base sm:text-lg text-black/70 max-w-3xl uppercase leading-relaxed">
              Une question ? Un besoin particulier ? N'hésitez pas à nous contacter.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Formulaire de contact */}
            <section ref={formRef}>
              <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-8">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium uppercase mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-black/20 rounded-md font-[Geist] text-sm uppercase focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-black/20 rounded-md font-[Geist] text-sm uppercase focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium uppercase mb-2">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-black/20 rounded-md font-[Geist] text-sm uppercase focus:outline-none focus:border-black transition-colors bg-white"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="order">Commande</option>
                    <option value="product">Produit</option>
                    <option value="return">Retour / Échange</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium uppercase mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-black/20 rounded-md font-[Geist] text-sm uppercase focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white px-6 py-3 rounded-md font-[Geist] text-sm font-medium uppercase hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-sm text-green-600 uppercase">
                    Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-sm text-red-600 uppercase">
                    Une erreur est survenue. Veuillez réessayer.
                  </p>
                )}
              </form>
            </section>

            {/* Informations de contact */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight mb-8">
                Informations
              </h2>
              <div className="space-y-8">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <Mail className="w-5 h-5 text-black/70 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base font-medium uppercase mb-2">Email</h3>
                      <a
                        href="mailto:contact@reboulstore.com"
                        className="text-sm text-black/70 uppercase hover:text-black transition-colors"
                      >
                        contact@reboulstore.com
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <Phone className="w-5 h-5 text-black/70 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base font-medium uppercase mb-2">Téléphone</h3>
                      <a
                        href="tel:+33491234567"
                        className="text-sm text-black/70 uppercase hover:text-black transition-colors"
                      >
                        +33 4 91 23 45 67
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <MapPin className="w-5 h-5 text-black/70 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base font-medium uppercase mb-2">Boutiques</h3>
                      <div className="text-sm text-black/70 uppercase space-y-2">
                        <p>Marseille - Centre-ville</p>
                        <p>Cassis - Port</p>
                        <p>Sanary-sur-Mer - Centre</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-black/10">
                  <h3 className="text-base font-medium uppercase mb-4">Horaires</h3>
                  <div className="text-sm text-black/70 uppercase space-y-2">
                    <p>Lundi - Samedi : 10h - 19h</p>
                    <p>Dimanche : 11h - 18h</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

