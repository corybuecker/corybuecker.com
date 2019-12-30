import Header from '../../components/header'
import Post from '../../components/post'
import React, { useEffect } from 'react'
import Head from 'next/head'

import posts from '../../src/content.json'
import '../../stylesheets/main.scss'
import recordPageview from '../../src/utils/analytics'

const postsBySlug = posts.reduce((p, post) => {
  p[post.path] = post
  return p
}, {})

const PostBySlug = post => {
  useEffect(() => {
    recordPageview()
  }, [])

  return (
    <div>
      <Head>
        <title>{post.attributes.title} - Cory Buecker</title>
        <meta name="description" content={post.attributes.preview} />
      </Head>
      <div className="container">
        <div className="content">
          <Header></Header>
          <main>
            <div className="wrapper">
              <div>
                <Post
                  key="1"
                  body={post.body}
                  title={post.attributes.title}
                  published={post.attributes.published}
                  revised={post.attributes.revised}
                ></Post>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

PostBySlug.getInitialProps = async ({ query }) => postsBySlug[query.slug]

export default PostBySlug
