import { defineConfig, type Plugin } from 'vite';
import { renderBody, renderHead } from './src/markup.ts';

/**
 * Bakes the page markup and every <head> tag into index.html from
 * src/content.ts, so the HTML is complete before any JavaScript runs.
 * Vite restarts the dev server when content.ts or markup.ts change.
 */
function tourHtml(): Plugin {
  return {
    name: 'tour-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('<!--tour:head-->', renderHead()).replace('<!--tour:body-->', renderBody());
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [tourHtml()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
});
