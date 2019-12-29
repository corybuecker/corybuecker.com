import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import Markdown from 'react-markdown'
import Revised from './revised'

type PostPreviewProps = {
  title: string
  published: string
  body: string
  path: string
  revised?: string
}

const PostPreview: FunctionComponent<PostPreviewProps> = ({
  title,
  published,
  body,
  path,
  revised
}) => {
  return (
    <article>
      <h1>
        <Link href="/post/[slug]" as={`/post/${path}`}>
          <a>{title}</a>
        </Link>
      </h1>
      <p>
        <time dateTime={published}>
          {new Date(published).toLocaleDateString()}
        </time>
        <Revised revised={revised}></Revised>
      </p>
      <div>
        <Markdown source={body}></Markdown>
      </div>
    </article>
  )
}

export default PostPreview
