// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://icar6618.github.io',
  base: '/portfolio',
  // /portfolio/ (uk), /portfolio/en/, /portfolio/ru/ → index.html in each folder
  build: {
    format: 'directory'
  },
  vite: {
    build: {
      cssTarget: ['chrome80', 'edge80', 'firefox103', 'safari14']
    }
  },
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk', 'en', 'ru'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
