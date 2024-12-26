// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
        viewport: 'width=device-width, initial-scale=1',
        meta: [
            { name: 'theme-color', content: '#f43f5e' },
            { property: 'og:title', content: '2025跨年煙火倒數' },
            { property: 'og:url', content: 'https://https://newyear-firework.vercel.app/' },
            { property: 'og:image', content: 'https://https://newyear-firework.vercel.app//taipei101.jpg' },
            { name: 'description', content: '2025跨年煙火倒數，2025，臺中跨年煙火、臺北跨年煙火、高雄跨年煙火、阿里山跨年煙火' },
            {
                property: 'og:description',
                content: '2025跨年煙火倒數，2025，臺中跨年煙火、臺北跨年煙火、高雄跨年煙火、阿里山跨年煙火',
            },
        ],
    },
},
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
})
