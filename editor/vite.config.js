import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' → build je přenositelný na libovolnou podcestu
// (killbottleneck.com/skin-editor/ i GitHub Pages) beze změny.
// fs.allow kořen repa: editor importuje ../validator a ../skins — JEDINÁ kopie
// validátoru i dat skinů v repu (anti-drift, viz scripts/check-upstream.mjs).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
});
