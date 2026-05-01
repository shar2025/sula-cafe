import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sulacafe.com',
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
