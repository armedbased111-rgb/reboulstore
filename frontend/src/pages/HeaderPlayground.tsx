// Page de test : affiche les 3 variantes de header dans des conteneurs scrollables
// Chaque variante est isolée dans un div h-[480px] overflow-y-auto
// → la sticky se joue à l'intérieur du conteneur, on peut tester le comportement sans quitter la page

import { HeaderReboulVariantA } from '../components/ui/21st/HeaderReboulVariantA'
import { HeaderReboulVariantB } from '../components/ui/21st/HeaderReboulVariantB'
import { HeaderReboulVariantC } from '../components/ui/21st/HeaderReboulVariantC'

const VARIANTS = [
  {
    id: 'A',
    label: 'Éditoriale Symétrique',
    description: 'Logo centré, nav split gauche/droite, underline slide au hover. Compact au scroll.',
    Component: HeaderReboulVariantA,
  },
  {
    id: 'B',
    label: 'Double Bande',
    description: 'Top bar marques (disparaît au scroll) + nav principale avec dropdown hover.',
    Component: HeaderReboulVariantB,
  },
  {
    id: 'C',
    label: 'Asymétrique Contemporaine',
    description: 'Grand logo Cormorant italic gauche, séparateur vertical, nav droite. Drawer mobile.',
    Component: HeaderReboulVariantC,
  },
]

// Faux contenu pour simuler une page et tester le sticky dans chaque conteneur
function FakePageContent() {
  return (
    <div className="p-8 space-y-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`h-14 rounded-sm ${i % 3 === 0 ? 'bg-stone-100' : 'bg-stone-50'}`}
        />
      ))}
    </div>
  )
}

export function HeaderPlayground() {
  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4 md:px-10">
      {/* En-tête de la page */}
      <div className="mb-10">
        <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">
          Reboul — Dev Playground
        </p>
        <h1
          className="text-3xl text-stone-900 tracking-[0.1em] uppercase"
          style={{ fontFamily: "'Cormorant', serif" }}
        >
          Header Variants
        </h1>
        <p className="text-xs text-stone-400 mt-2 max-w-md">
          Scrolle dans chaque fenêtre pour tester le comportement sticky de chaque variante.
        </p>
      </div>

      {/* Grille des variantes */}
      <div className="space-y-14 max-w-screen-xl mx-auto">
        {VARIANTS.map(({ id, label, description, Component }) => (
          <div key={id}>
            {/* Label + description */}
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[10px] tracking-widest uppercase text-stone-400">
                Variant {id}
              </span>
              <span className="text-sm text-stone-700 font-medium">{label}</span>
              <span className="text-xs text-stone-400 hidden md:inline">{description}</span>
            </div>

            {/* Conteneur scrollable isolé */}
            <div className="h-[480px] overflow-y-auto border border-stone-200 bg-white relative shadow-sm">
              <Component />
              <FakePageContent />
            </div>
          </div>
        ))}
      </div>

      {/* Footer de la page */}
      <div className="mt-16 text-center">
        <p className="text-[10px] tracking-widest uppercase text-stone-300">
          /header-playground · Reboul Store
        </p>
      </div>
    </div>
  )
}
