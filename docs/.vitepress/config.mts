import { defineConfig } from 'vitepress'

const isPagesBuild = process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'phenotypeActions'
const docsBase = isPagesBuild ? `/${repoName}/` : '/'

export default defineConfig({
  title: 'phenotypeActions',
  description: 'Shared GitHub Actions and reusable workflows for Phenotype repositories',
  lang: 'en-US',
  base: docsBase,
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    siteTitle: 'phenotypeActions',
    nav: [{ text: 'Guide', link: '/guide/' }],
    sidebar: {
      '/guide/': [
        { text: 'Guide', items: [{ text: 'Getting Started', link: '/guide/' }] }
      ]
    },
    socialLinks: [{ icon: 'github', link: `https://github.com/KooshaPari/${repoName}` }],
    search: { provider: 'local' }
  },
  markdown: { lineNumbers: true },
  ignoreDeadLinks: true
})
