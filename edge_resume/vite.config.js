import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // relative paths ensure the build runs anywhere (GitHub Pages, Vercel, HF Spaces)
  build: {
    target: 'esnext' // enables modern JS features like top-level await and optimal compilation
  }
});
