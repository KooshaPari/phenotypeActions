export function createSiteMeta({ base = '/' } = {}) {
  return {
    base,
    title: 'phenotypeActions',
    description: 'GitHub Actions and workflows for Phenotype',
    themeConfig: {
      nav: [
        { text: 'Home', link: base || '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'Reference', link: '/reference/' },
      ],
    },
  }
}
