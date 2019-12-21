import React, { useEffect } from 'react'
import PostPreview from '../components/post_preview'
import Post from '../components/post'
import Header from '../components/header'
import pages from '../src/content.json'
import Head from 'next/head'
import '../stylesheets/main.scss'

const renderPreview = (page, index) => {
  return (
    <article key={index}>
      <PostPreview
        body={page.attributes.preview}
        path={page.path}
        title={page.attributes.title}
        published={page.attributes.published}
      ></PostPreview>
    </article>
  )
}

const renderPost = page => {
  return (
    <article key={0}>
      <Head>
        <title>{page.attributes.title} - Cory Buecker</title>
      </Head>
      <Post
        body={page.body}
        path={page.path}
        title={page.attributes.title}
        published={page.attributes.published}
      ></Post>
    </article>
  )
}

const Home = () => {
  useEffect(() => {
    fetch('https://analytics.corybuecker.com')
  }, [])

  return (
    <div>
      <div className="container">
        <div className="content">
          <Header></Header>
          <main>
            <div className="wrapper">
              {pages.map((page, index) => {
                return index === 0
                  ? renderPost(page)
                  : renderPreview(page, index)
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Home
