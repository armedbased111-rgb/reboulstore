import React from 'react';

export const highlightText = (text: string, query: string): React.ReactNode[] => {
  if (!query || query.trim() === '') {
    return [text];
  }

  const parts: React.ReactNode[] = [];
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      React.createElement('span', { key: `highlight-${keyCounter++}`, className: 'bg-yellow-200' }, match[0])
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

