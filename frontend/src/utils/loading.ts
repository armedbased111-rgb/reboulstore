
/**
 * Gestionnaire global des états de chargement
 * Permet de suivre les requêtes en cours
 */
class LoadingManager {
  private loadingCount = 0;
  private listeners: Array<(isLoading: boolean) => void> = [];

  /**
   * Démarre un chargement
   */
  start() {
    this.loadingCount++;
    this.notifyListeners();
  }

  /**
   * Arrête un chargement
   */
  stop() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.notifyListeners();
  }

  /**
   * Vérifie si un chargement est en cours
   */
  isLoading(): boolean {
    return this.loadingCount > 0;
  }

  /**
   * S'abonner aux changements d'état
   */
  subscribe(listener: (isLoading: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifier tous les listeners
   */
  private notifyListeners() {
    const isLoading = this.isLoading();
    this.listeners.forEach(listener => listener(isLoading));
  }
}

export const loadingManager = new LoadingManager();