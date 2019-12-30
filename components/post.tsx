import Markdown from 'react-markdown'
import React, { FunctionComponent } from 'react'
import Image from './image'
import Revised from './revised'
import TrackedAnchor from './tracked_anchor'

type PostProps = {
  title: string
  published: string
  body: string
  revised?: string
}

const Post: FunctionComponent<PostProps> = ({
  title,
  published,
  body,
  revised
}) => {
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
        <Markdown
          source={body}
          renderers={{ image: Image, link: TrackedAnchor }}
        ></Markdown>
      </div>
    </article>
  )
}

export default Post
