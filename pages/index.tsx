import React, { useEffect, FunctionComponent } from 'react'
import PostPreview from '../components/post_preview'
import Post from '../components/post'
import Header from '../components/header'
import Head from 'next/head'

import pages from '../src/content.json'
import recordPageview from '../src/utils/analytics'

import '../stylesheets/main.scss'

type pageProps = {
  path: string
  body: string
  attributes: {
    title: string
    published: string
    preview: string
    revised?: string
  }
}

type renderPreviewProps = {
  page: pageProps
  index: number
}

const renderPreview: FunctionComponent<renderPreviewProps> = ({
  page,
  index
}) => {
  return (
    <div key={index}>
      <PostPreview
        body={page.attributes.preview}
        path={page.path}
        title={page.attributes.title}
        published={page.attributes.published}
        revised={page.attributes.revised}
      ></PostPreview>
    </div>
  )
}

type renderPostProps = {
  page: pageProps
}

const renderPost: FunctionComponent<renderPostProps> = ({ page }) => {
  return (
    <div key={0}>
      <Head>
        <title>{page.attributes.title} - Cory Buecker</title>
        <meta name="description" content={page.attributes.preview} />
      </Head>
      <Post
        body={page.body}
        title={page.attributes.title}
        published={page.attributes.published}
        revised={page.attributes.revised}
      ></Post>
    </div>
  )
}

const Home = () => {
  useEffect(() => {
    recordPageview()
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
                  ? renderPost({ page })
                  : renderPreview({ page, index })
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Home
