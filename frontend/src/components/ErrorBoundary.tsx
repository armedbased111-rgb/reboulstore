import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Composant pour capturer les erreurs React
 * 
 * Utilisation :
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Mettre à jour l'état pour afficher l'UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logger l'erreur pour le debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Ici on pourrait envoyer l'erreur à un service de monitoring (Sentry, etc.)
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Sinon, afficher l'UI d'erreur par défaut
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="mb-8">
              <AlertTriangle className="w-16 h-16 text-black/20 mx-auto mb-4" />
              <h1 className="text-3xl sm:text-4xl font-medium uppercase tracking-tight mb-4">
                Une erreur est survenue
              </h1>
              <p className="text-base text-black/70 uppercase leading-relaxed mb-6">
                Désolé, une erreur inattendue s'est produite. Notre équipe a été notifiée.
              </p>
            </div>

            {/* Détails de l'erreur en développement uniquement */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-left">
                <p className="text-sm font-medium text-red-800 uppercase mb-2">
                  Détails de l'erreur (dev uniquement) :
                </p>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md font-[Geist] text-sm font-medium uppercase hover:bg-black/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 border border-black/20 text-black px-6 py-3 rounded-md font-[Geist] text-sm font-medium uppercase hover:bg-black/5 transition-colors"
              >
                Recharger la page
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 border border-black/20 text-black px-6 py-3 rounded-md font-[Geist] text-sm font-medium uppercase hover:bg-black/5 transition-colors"
              >
                <Home className="w-4 h-4" />
                Accueil
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

