import Markdown from 'react-markdown'
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
const Post = ({ title, published, body, path }) => {
  return (
    <article>
      <header>
        <h1>{title}</h1>
        <p>
          <time dateTime={published}>
            {new Date(published).toLocaleDateString()}
          </time>
        </p>
      </header>
      <div>
        <Markdown source={body}></Markdown>
      </div>
      <Link href="/post/[slug]" as={`/post/${path}`}>
        <a hidden=""></a>
      </Link>
    </article>
  )
}
Post.propTypes = {
  title: PropTypes.string.isRequired,
  published: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
}
export default Post
