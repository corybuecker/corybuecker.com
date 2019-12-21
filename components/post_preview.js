import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const PostPreview = ({ title, published, body, path }) => {
  return (
    <article>
      <h1>{title}</h1>
      <p>
        <time dateTime={published}>
          {new Date(published).toLocaleDateString()}
        </time>
      </p>

      <div>{body}</div>
      <Link href="/post/[slug]" as={`/post/${path}`}>
        <a>Read full post</a>
      </Link>
    </article>
  )
}

PostPreview.propTypes = {
  title: PropTypes.string.isRequired,
  published: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
}

export default PostPreview
