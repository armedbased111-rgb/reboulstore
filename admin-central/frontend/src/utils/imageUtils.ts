/**
 * Utilitaires pour la gestion des URLs d'images
 */

/**
 * Base URL de l'API backend Reboul Store (pour les images)
 * Les images sont servies depuis le backend Reboul Store (port 3001)
 * et non depuis l'Admin Central backend (port 4001)
 */
const getApiBaseUrl = (): string => {
  // Si VITE_REBOUL_API_URL est défini, l'utiliser (pour les images du backend Reboul)
  if (import.meta.env.VITE_REBOUL_API_URL) {
    return import.meta.env.VITE_REBOUL_API_URL;
  }
  
  // En développement, utiliser localhost:3001 (backend Reboul Store)
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }
  
  // En production, utiliser le chemin relatif /api-reboul (proxifié par nginx vers backend Reboul)
  // Ou si les images sont sur Cloudinary, elles seront déjà en URL complète
  return '/api-reboul';
};

/**
 * Construit l'URL complète d'une image depuis le backend
 * 
 * @param imageUrl - URL de l'image (peut être relative ou absolue)
 * @returns URL complète de l'image
 * 
 * @example
 * // URL relative depuis le backend
 * getImageUrl('/uploads/product-image.jpg')
 * // => 'http://localhost:3001/uploads/product-image.jpg'
 * 
 * @example
 * // URL déjà complète (externe, ex: Cloudinary)
 * getImageUrl('https://example.com/image.jpg')
 * // => 'https://example.com/image.jpg'
 * 
 * @example
 * // URL relative sans slash initial
 * getImageUrl('uploads/product-image.jpg')
 * // => 'http://localhost:3001/uploads/product-image.jpg'
 */
export const getImageUrl = (imageUrl: string | null | undefined): string | null => {
  // Si pas d'URL, retourner null (le composant gérera l'affichage du placeholder)
  if (!imageUrl) {
    return null;
  }

  // Si l'URL est déjà complète (http:// ou https://), la retourner telle quelle
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Si l'URL commence par /, c'est une URL relative au backend
  // Construire l'URL complète avec la base URL de l'API
  const baseUrl = getApiBaseUrl();
  
  // Nettoyer la base URL (enlever le slash final si présent)
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Nettoyer l'URL de l'image (ajouter le slash initial si absent)
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${cleanBaseUrl}${cleanImageUrl}`;
};

/**
 * Construit l'URL complète pour plusieurs images
 * 
 * @param imageUrls - Tableau d'URLs d'images
 * @returns Tableau d'URLs complètes (filtre les null)
 */
export const getImageUrls = (imageUrls: (string | null | undefined)[]): (string | null)[] => {
  return imageUrls.map(url => getImageUrl(url));
};

