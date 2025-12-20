import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitaire pour combiner les classes TailwindCSS
 * 
 * Combine clsx (gestion conditionnelle de classes) avec tailwind-merge
 * (résolution des conflits de classes Tailwind)
 * 
 * @param inputs - Classes CSS à combiner
 * @returns String de classes combinées
 * 
 * @example
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500' (dernier gagne)
 * cn('px-4', isActive && 'bg-blue-500') // 'px-4 bg-blue-500' si isActive
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
