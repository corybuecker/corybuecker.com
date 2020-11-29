const fs = require('fs')
const marked = require('marked')
const fm = require('front-matter')
const mustache = require('mustache')

const renderer = {
  link(href: string, title: string, text: string) {
    return `<tracked-anchor><a href='${href}' title='${title}'>${text}</a></tracked-anchor>`
  }
}

marked.use({ renderer });

const indexTemplate: string = fs.readFileSync('./templates/index.mustache', 'utf8')
const postTemplate: string = fs.readFileSync('./templates/post.mustache', 'utf8')
const sitemapTemplate: string = fs.readFileSync('./templates/sitemap.mustache', 'utf8')

const markdownPostPaths = fs.readdirSync('./content/posts', (_err: NodeJS.ErrnoException, items: string[]) => {
  return items.map((item: string) => { return `content/posts/${item}` })
})

for (const markdownPostPath of markdownPostPaths) {
  const markdownRawPost = fs.readFileSync(`content/posts/${markdownPostPath}`, 'utf8')
  const frontmatterWithPost = fm(markdownRawPost)
  const markdownBody = marked(frontmatterWithPost.body)

  fs.mkdirSync(`output/post/${frontmatterWithPost.attributes.slug}`, { recursive: true })

  fs.writeFileSync(`output/post/${frontmatterWithPost.attributes.slug}/index.html`,
    mustache.render(
      postTemplate,
      Object.assign(frontmatterWithPost.attributes, { markdownBody })
    )
  )
}

const topPost = markdownPostPaths.pop()
const topMarkdownRawPost = fs.readFileSync(`content/posts/${topPost}`, 'utf8')
const topFrontmatterWithPost = fm(topMarkdownRawPost)
const topMarkdownBody = marked(topFrontmatterWithPost.body)
const main_lastmod = new Date(topFrontmatterWithPost.attributes.updated || topFrontmatterWithPost.attributes.published)
let children = []

for (const markdownPostPath of markdownPostPaths.reverse()) {
  const markdownRawPost = fs.readFileSync(`content/posts/${markdownPostPath}`, 'utf8')
  const frontmatterWithPost = fm(markdownRawPost)
  const sitemapLastMod = new Date(frontmatterWithPost.attributes.updated || frontmatterWithPost.attributes.published)
  children.push(Object.assign(frontmatterWithPost.attributes, { markdownPreview: marked(frontmatterWithPost.attributes.preview), sitemapLastMod: sitemapLastMod.toISOString() }))
}

fs.writeFileSync(`output/index.html`,
  mustache.render(
    indexTemplate,
    Object.assign(topFrontmatterWithPost.attributes, { children, topMarkdownBody })
  )
)

fs.writeFileSync(`output/sitemap.xml`,
  mustache.render(
    sitemapTemplate,
    Object.assign(topFrontmatterWithPost.attributes, { children, main_lastmod: main_lastmod.toISOString() })
  )
)

console.log(topPost)