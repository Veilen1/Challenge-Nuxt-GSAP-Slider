export default {
  components: true,
  head: {
    title: 'Nuxt GSAP Project',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A Nuxt project with GSAP animations and SCSS styling' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css' }
    ]
  },

  css: [
    '@/assets/styles/main.scss'
  ],

  plugins: [
    '@/plugins/gsap.js'
  ],

  build: {
    extend(config, ctx) {
    }
  },

  compatibilityDate: '2025-02-26'
};