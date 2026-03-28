/**
 * Infos légales — source unique (compléter avant prod).
 * Utilisée par Layout (footer), Mentions légales, Politique de confidentialité.
 */
export const LEGAL_SITE_INFO = {
  raisonSociale: 'REBOUL STORE',
  formeJuridique: '[Forme juridique — ex. SASU]',
  siegeSocial: '[Adresse complète du siège — rue, CP, ville]',
  siret: '92802711500012',
  rcs: '[RCS — ex. RCS Marseille B 928 027 115]',
  tvaIntracommunautaire: 'FR92802711500012',
  directeurPublication: '[Prénom NOM]',
  emailContact: 'contact@reboulstore.com',
  hebergeur: {
    nom: '[Nom légal de l’hébergeur]',
    adresse: '[Adresse complète]',
    siteWeb: '[https://...]',
  },
  mediateurConsommation: {
    nom: '[Nom du médiateur — à désigner]',
    url: '[URL du site / formulaire]',
    adresse: '[Adresse postale du médiateur]',
  },
} as const;
