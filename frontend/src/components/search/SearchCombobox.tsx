import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup } from '../ui/command';
import { useSearch } from '../../hooks/useSearch';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { highlightText } from '../../utils/highlightText';
import type { SearchSuggestion } from '../../services/search';

interface SearchComboboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  width?: string;
  renderWithoutPopover?: boolean;
}

export const SearchCombobox = ({
  open,
  onOpenChange,
  width = 'w-72',
  renderWithoutPopover = false,
}: SearchComboboxProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const { suggestions, loading } = useSearch(searchQuery, open);
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus l'input quand le composant s'ouvre
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Scroll vers l'élément sélectionné
  useEffect(() => {
    if (selectedIndex >= 0) {
      const element = document.querySelector(`[data-index="${selectedIndex}"]`);
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = useCallback((suggestion: SearchSuggestion) => {
    addToHistory(suggestion.name);
    
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.type === 'category' && suggestion.slug) {
      navigate(`/catalog?category=${suggestion.slug}`);
    } else if (suggestion.type === 'brand' && suggestion.slug) {
      navigate(`/catalog?brand=${suggestion.slug}`);
    }
    
    setSearchQuery('');
    onOpenChange(false);
  }, [navigate, addToHistory, onOpenChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const historyItems = history.slice(0, 5);
    const allItems = [
      ...historyItems.map(item => ({ type: 'history' as const, data: item })),
      ...suggestions.map(s => ({ type: 'suggestion' as const, data: s })),
    ];

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && allItems[selectedIndex]) {
      e.preventDefault();
      const item = allItems[selectedIndex];
      if (item.type === 'history') {
        // C'est un historique
        setSearchQuery(item.data.query);
      } else {
        // C'est une suggestion
        handleSelect(item.data);
      }
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  }, [selectedIndex, history, suggestions, handleSelect, onOpenChange]);

  const popularCategories = categories?.slice(0, 5) || [];
  const popularBrands = brands?.slice(0, 5) || [];

  const content = (
    <Command className={`${width} rounded-lg border border-gray-200 shadow-lg`} shouldFilter={false}>
      <CommandInput
        ref={inputRef}
        value={searchQuery}
        onValueChange={setSearchQuery}
        onKeyDown={handleKeyDown}
        placeholder="Rechercher des produits, catégories, marques..."
        autoFocus={open}
      />
      <CommandList>
        {searchQuery.trim() === '' ? (
          <>
            {/* Historique de recherche */}
            {history.length > 0 && (
              <CommandGroup heading="Recherches récentes">
                {history.slice(0, 5).map((item, index) => (
                  <div
                    key={item.timestamp}
                    onClick={() => {
                      setSearchQuery(item.query);
                    }}
                    data-index={index}
                    className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                  >
                    <div className="flex-1">
                      {item.query}
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.query);
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      role="button"
                      aria-label="Supprimer de l'historique"
                    >
                      ×
                    </span>
                  </div>
                ))}
                {history.length > 0 && (
                  <div 
                    onClick={clearHistory}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 text-gray-500 text-xs"
                  >
                    Effacer tout
                  </div>
                )}
              </CommandGroup>
            )}

            {/* Catégories populaires */}
            {popularCategories.length > 0 && (
              <CommandGroup heading="Catégories populaires">
                {popularCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      navigate(`/catalog?category=${category.slug}`);
                      onOpenChange(false);
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
                  >
                    {category.name}
                  </div>
                ))}
              </CommandGroup>
            )}

            {/* Marques populaires */}
            {popularBrands.length > 0 && (
              <CommandGroup heading="Marques populaires">
                {popularBrands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => {
                      navigate(`/catalog?brand=${brand.slug}`);
                      onOpenChange(false);
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
                  >
                    {brand.name}
                  </div>
                ))}
              </CommandGroup>
            )}
          </>
        ) : (
          <>
            {loading && <CommandEmpty>Recherche en cours...</CommandEmpty>}
            {!loading && suggestions.length === 0 && (
              <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
            )}
            {!loading && suggestions.length > 0 && (
              <CommandGroup heading="Résultats">
                {suggestions.map((suggestion, index) => {
                  const itemIndex = history.length + index;
                  return (
                    <div
                      key={`${suggestion.type}-${suggestion.id}`}
                      onClick={() => handleSelect(suggestion)}
                      data-index={itemIndex}
                      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 ${selectedIndex === itemIndex ? 'bg-gray-100' : ''}`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {suggestion.imageUrl && (
                          <img
                            src={suggestion.imageUrl}
                            alt={suggestion.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="flex-1">{highlightText(suggestion.name, searchQuery)}</span>
                        <span className="ml-auto text-xs text-gray-500 uppercase">
                          {suggestion.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </Command>
  );

  if (renderWithoutPopover) {
    return content;
  }

  return content;
};

