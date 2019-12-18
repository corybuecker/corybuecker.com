
import Header from '../../components/header'
import Post from '../../components/post'
import React, { useEffect } from 'react'
import Head from 'next/head'

import '../../stylesheets/minima-classic.scss'

import posts from '../../src/content.json'

const postsBySlug = posts.reduce((p, post) => {
  p[post.path] = post
  return p
}, {})

const PostBySlug = (post) => {
  useEffect(() => {
    fetch('https://analytics.corybuecker.com')
  }, [])

  return (
    <div>
      <Head>
        <title>{post.attributes.title} - Cory Buecker</title>
      </Head>
      <Header></Header>
      <main className='page-content' aria-label='Content'>
        <div className='wrapper'>
          <Post key='1' body={post.body} path={post.path} title={post.attributes.title} published={post.attributes.published}></Post>
        </div>
      </main>
    </div>
  )
}

PostBySlug.getInitialProps = async ({ query }) =>
  postsBySlug[query.slug]

export default PostBySlug
