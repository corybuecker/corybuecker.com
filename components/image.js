import React from 'react'
import PropTypes from 'prop-types'

const Image = ({ alt, src }) => {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" alt={alt} />
      <source srcSet={src} type="image/png" alt={alt} />
      <img src={src} alt={alt} />
    </picture>
  )
}

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
}

export default Image
