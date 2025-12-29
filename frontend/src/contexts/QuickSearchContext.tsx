import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface QuickSearchContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const QuickSearchContext = createContext<QuickSearchContextType | undefined>(undefined);

export const QuickSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Raccourci clavier Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const value = {
    isOpen,
    open,
    close,
    toggle,
  };

  return (
    <QuickSearchContext.Provider value={value}>
      {children}
    </QuickSearchContext.Provider>
  );
};

export const useQuickSearchContext = () => {
  const context = useContext(QuickSearchContext);
  if (context === undefined) {
    throw new Error('useQuickSearchContext must be used within a QuickSearchProvider');
  }
  return context;
};

