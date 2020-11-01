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

let children = []

for (const markdownPostPath of markdownPostPaths) {
  const markdownRawPost = fs.readFileSync(`content/posts/${markdownPostPath}`, 'utf8')
  const frontmatterWithPost = fm(markdownRawPost)
  children.push(Object.assign(frontmatterWithPost, { markdownPreview: marked(frontmatterWithPost.attributes.preview) }))
}

fs.writeFileSync(`output/index.html`,
  mustache.render(
    indexTemplate,
    Object.assign(topFrontmatterWithPost.attributes, { children, topMarkdownBody })
  )
)

console.log(topPost)