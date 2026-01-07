import { apiClient } from './api';
import type { Product } from '../types';
import type { Category } from '../types';
import type { Brand } from '../types';

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}

export const getSearchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    // Récupérer les produits
    const productsResponse = await apiClient.get<{ products: Product[] }>('/products', {
      params: { search: query, limit: 5 },
    });

    // Récupérer les catégories
    const categoriesResponse = await apiClient.get<Category[]>('/categories');
    const categories = categoriesResponse.data.filter((cat) =>
      cat.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    // Récupérer les marques
    const brandsResponse = await apiClient.get<Brand[]>('/brands');
    const brands = brandsResponse.data.filter((brand) =>
      brand.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const suggestions: SearchSuggestion[] = [];

    // Ajouter les produits
    productsResponse.data.products.forEach((product) => {
      suggestions.push({
        type: 'product',
        id: product.id,
        name: product.name,
        slug: undefined, // Product n'a pas de slug, on utilise l'ID pour la navigation
        imageUrl: product.images?.[0]?.url,
      });
    });

    // Ajouter les catégories
    categories.forEach((category) => {
      suggestions.push({
        type: 'category',
        id: category.id,
        name: category.name,
        slug: category.slug,
        imageUrl: category.imageUrl,
      });
    });

    // Ajouter les marques
    brands.forEach((brand) => {
      suggestions.push({
        type: 'brand',
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        imageUrl: brand.logoUrl, // Brand a logoUrl, pas imageUrl
      });
    });

    return suggestions.slice(0, 8); // Limiter à 8 suggestions
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
};

export const searchProducts = async (
  query: string,
  filters?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): Promise<SearchResult> => {
  try {
    const params: Record<string, string | number> = { search: query };
    if (filters?.category) params.category = filters.category;
    if (filters?.brand) params.brand = filters.brand;
    if (filters?.minPrice) params.minPrice = filters.minPrice;
    if (filters?.maxPrice) params.maxPrice = filters.maxPrice;

    const productsResponse = await apiClient.get<{ products: Product[] }>('/products', { params });

    // Récupérer catégories et marques pour les résultats
    const categoriesResponse = await apiClient.get<Category[]>('/categories');
    const brandsResponse = await apiClient.get<Brand[]>('/brands');

    return {
      products: productsResponse.data.products,
      categories: categoriesResponse.data,
      brands: brandsResponse.data,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { products: [], categories: [], brands: [] };
  }
};

