/**
 * Contexte **Early Access** — première année : site et expérience qui progressent,
 * catalogue enrichi avec de **nouvelles pièces chaque semaine**.
 *
 * Réutiliser pour bannières, footer, e-mails, autre modale : importer `EARLY_ACCESS`.
 * Ton : discret, technique (Marathon / fiche données), cohérent ACW* (mono, //, uppercase).
 */
export const EARLY_ACCESS = {
  /** Ligne HUD sous le titre (mono, très bas contraste) */
  hudLine: 'EARLY_ACCESS // Y01_WK_DROP',
  /** Fil décoratif modale / repères techniques (aligné COMMS) */
  frameDatum: 'COMMS // RBL-EA-01',
  /** Préfixe encart type notice / datasheet */
  noteLabel: 'NOTE :',
  /**
   * Phrase lisible, sous le bloc principal — reste en français naturel ;
   * affichage UI en petit capitales côté composant.
   */
  summary:
    'Accès anticipé année un : le site et le catalogue évoluent en continu. Nouvelles pièces ajoutées chaque semaine.',
} as const
