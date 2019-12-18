import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const PostPreview = ({ title, published, body, path }) => {
  return (
    <article
      className='post h-entry'
      itemScope=''
      itemType='http://schema.org/BlogPosting'
    >
      <header className='post-header'>
        <h1 className='post-title p-name' itemProp='name headline'>
          {title}
        </h1>
        <p className='post-meta'>
          <time
            className='dt-published'
            dateTime={published}
            itemProp='datePublished'
          >
            {new Date(published).toLocaleDateString()}
          </time>
        </p>
      </header>
      <div className='post-content e-content' itemProp='articleBody'>
        {body}
      </div>
      <Link href={`/post/${path}`} prefetch={false}>
        <a className='u-url'>Read full post</a>
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
