import Markdown from 'react-markdown'
import React from 'react'
import PropTypes from 'prop-types'
import Image from './image'

const Revised = ({ revised }) => {
  if (revised === undefined) return null

  return (
    <span>
      &nbsp; (Revised:&nbsp;
      <time dateTime={revised}>{new Date(revised).toLocaleDateString()}</time>)
    </span>
  )
}

Revised.propTypes = {
  revised: PropTypes.string
}

const Post = ({ title, published, body, revised }) => {
  return (
    <article>
      <h1>{title}</h1>
      <p>
        <time dateTime={published}>
          {new Date(published).toLocaleDateString()}
        </time>
        <Revised revised={revised}></Revised>
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
  revised: PropTypes.string,
  body: PropTypes.string.isRequired
}

export default Post
