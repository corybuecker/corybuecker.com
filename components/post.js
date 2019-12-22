import Markdown from 'react-markdown'
import React from 'react'
import PropTypes from 'prop-types'

const Image = ({ alt, src }) => {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" alt={alt} />
      <source srcSet={src} type="image/png" alt={alt} />
      <img src={src} alt={alt} />
    </picture>
  )
}
Image.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
}

const Post = ({ title, published, body, path }) => {
  return (
    <article>
      <h1>{title}</h1>
      <p>
        <time dateTime={published}>
          {new Date(published).toLocaleDateString()}
        </time>
      </p>

      <div>
        <Markdown source={body} renderers={{ image: Image }}></Markdown>
      </div>
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
