import Header from '../../components/header'
import Post from '../../components/post'
import React, { useEffect } from 'react'
import Head from 'next/head'

import posts from '../../src/content.json'
import '../../stylesheets/main.scss'

const postsBySlug = posts.reduce((p, post) => {
  p[post.path] = post
  return p
}, {})

const PostBySlug = post => {
  useEffect(() => {
    fetch('https://analytics.corybuecker.com')
  }, [])

  return (
    <div>
      <Head>
        <title>{post.attributes.title} - Cory Buecker</title>
      </Head>
      <div className="container">
        <div className="content">
          <Header></Header>
          <main>
            <div className="wrapper">
              <Post
                key="1"
                body={post.body}
                path={post.path}
                title={post.attributes.title}
                published={post.attributes.published}
              ></Post>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

PostBySlug.getInitialProps = async ({ query }) => postsBySlug[query.slug]

export default PostBySlug
