const content = require('./src/content.json')
const withSass = require('@zeit/next-sass')

module.exports = withSass({
  exportPathMap: async (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) => {
    return content.reduce(
      (pages, page) => {
        pages[`/post/${page.path}`] = {
          page: '/post/[slug]',
          query: { slug: page.path }
        }

        return pages
      },
      {
        '/': { page: '/' }
      }
    )
  }
})
