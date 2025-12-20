// frontend/src/pages/LoaderPlayground.tsx
import { PageLoader } from '../components/loaders/PageLoader'

/**
 * Page de test pour le loader inter-page.
 *
 * Route : /loader-playground
 */
export const LoaderPlayground = () => {
  return (
    <main
      id="MainContent"
      role="main"
      tabIndex={-1}
      className="min-h-screen flex flex-col items-center justify-center gap-6"
    >
      <PageLoader />

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          Loader Playground
        </h1>
        <p className="text-sm text-neutral-600 max-w-md text-center">
          Cette page affiche en continu le loader inter-page pour ajuster son
          design et son rythme sans logique de navigation.
        </p>
      </div>
    </main>
  )
}