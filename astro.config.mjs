import { defineConfig } from 'astro/config';
import { transformerMetaHighlight } from '@shikijs/transformers';
import rehypeImageFigures from './src/plugins/rehype-image-figures.js';
import sitemap from '@astrojs/sitemap';

function lineNumbersTransformer() {
  return {
    name: 'line-numbers',
    pre(node) {
      if (this.options.meta?.__raw?.includes('showLineNumbers')) {
        node.properties['data-line-numbers'] = '';
      }
    },
  };
}

function titleTransformer() {
  return {
    name: 'title',
    pre(node) {
      const raw = this.options.meta?.__raw ?? '';
      const match = raw.match(/\btitle="([^"]+)"/);
      if (match) {
        node.properties['data-title'] = match[1];
      }
    },
  };
}

export default defineConfig({
  site: 'https://backintheday.dev',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeImageFigures],
    shikiConfig: {
      theme: 'github-dark',
      wrap: false,
      transformers: [
        transformerMetaHighlight(),
        lineNumbersTransformer(),
        titleTransformer(),
      ],
    },
  },
});
