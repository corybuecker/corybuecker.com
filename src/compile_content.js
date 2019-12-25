const fm = require('front-matter')
const fs = require('fs')
const path = require('path')

const markdownPages = fs.readdirSync(path.join(process.cwd(), 'content'))

const compiledPages = []

markdownPages.forEach(pagePath => {
  const contents = fm(
    fs.readFileSync(path.join(process.cwd(), 'content', pagePath), 'utf-8')
  )

  contents.path = pagePath.replace('.md', '').replace(/^[0-9]{3}\-/, '')
  compiledPages.push(contents)
})

const publishedCompiledPages = compiledPages
  .filter(
    page => !page.attributes.draft || process.env.NODE_ENV !== 'production'
  )
  .reverse()

console.log(publishedCompiledPages.map(page => page.attributes.title))

fs.writeFileSync(
  path.join(process.cwd(), 'src', 'content.json'),
  JSON.stringify(publishedCompiledPages)
)
