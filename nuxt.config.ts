// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  app: {
      head: {
          viewport: 'width=device-width, initial-scale=1',
          title: '跨年倒數計時',
          meta: [
              { name: 'theme-color', content: '#f43f5e' },
              { name: 'google-site-verification', content: 'ztKMEYWYv5oRbWiHxUCdgPTbXqBKW5e5mshnU-IbM7w' },
              { property: 'og:title', content: '跨年倒數計時' },
              { property: 'og:url', content: 'https://newyear-firework.vercel.app/' },
              { property: 'og:image', content: 'https://newyear-firework.vercel.app/taipei101.jpg' },
              {
                  name: 'description',
                  content: '跨年倒數計時，2025，臺中跨年煙火、臺北跨年煙火、高雄跨年煙火、阿里山跨年煙火',
              },
              {
                  property: 'og:description',
                  content: '跨年倒數計時，2025，臺中跨年煙火、臺北跨年煙火、高雄跨年煙火、阿里山跨年煙火',
              },
          ],
      },
  },

  modules: [],

  postcss: {
      plugins: {
          tailwindcss: {},
          autoprefixer: {},
      },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },

  compatibilityDate: '2024-12-26',
})