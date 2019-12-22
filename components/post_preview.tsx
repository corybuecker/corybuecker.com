import React, { FunctionComponent } from 'react'
import Link from 'next/link'

type PostPreviewProps = {
  title: string
  published: string
  body: string
  path: string
}

const PostPreview: FunctionComponent<PostPreviewProps> = ({
  title,
  published,
  body,
  path
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
      </p>
      <div>{body}</div>
    </article>
  )
}

export default PostPreview
