// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://icar6618.github.io',
  base: '/portfolio',
  build: {
    format: 'file'
  }
});
