import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // 1. Symulacja przeglądarki
    // Dzięki temu 'window', 'document' itp. będą dostępne w testach
    environment: 'jsdom', 
    
    // 2. Włączenie zmiennych globalnych
    // Pozwala używać describe, it, expect bez importowania ich w każdym pliku
    globals: true,
    
    // Opcjonalnie: Gdzie szukać plików testowych (domyślnie szuka wszędzie *.test.js)
    include: ['tests/**/*.{test,spec}.js'],
  },
});
