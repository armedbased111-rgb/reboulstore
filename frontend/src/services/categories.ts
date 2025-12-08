import { api } from "./api";
import type { Category } from "../types/index";
/** 
 * Service pour gérer les catégories.
 */

// Récupérer toutes les catégories
export const getCategories = async (): Promise<Category[]> => {
    return await api.get<Category[]>('/categories');
}

// Récupérer une catégorie par son ID
export const getCategory = async (id: string): Promise<Category> => {
    return await api.get<Category>(`/categories/${id}`);
}

// Recuperer une catégorie par son slug
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
    return await api.get<Category>(`/categories/slug/${slug}`);
}