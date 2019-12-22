import React, { FunctionComponent } from 'react'

type ImageProps = {
  src: string
  alt?: string
}
const Image: FunctionComponent<ImageProps> = ({ alt, src }) => {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <source srcSet={src} type="image/png" />
      <img src={src} alt={alt} />
    </picture>
  )
}

export default Image
