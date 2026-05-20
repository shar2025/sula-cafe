import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://sulacafe.com',
  // Astro 5 default is 'static'.  Pages stay prerendered; the /api/chai
  // endpoint opts into SSR via `export const prerender = false`.
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://sulacafe.com' || item.url === 'https://sulacafe.com/') {
          item.url = 'https://sulacafe.com/';
          return item;
        }
        if (item.url.endsWith('/')) {
          item.url = item.url.replace(/\/$/, '');
        }
        return item;
      },
    }),
  ],
});
