export function createSiteMeta({ base = '/' } = {}) {
  return {
    base,
    title: 'phenotypeActions',
    description: 'Documentation',
    themeConfig: {
      nav: [
        { text: 'Home', link: base || '/' },
      ],
    },
  }
}
