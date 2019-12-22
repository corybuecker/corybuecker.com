import React, { FunctionComponent } from 'react'

type RevisedProps = {
  revised?: string
}

const Revised: FunctionComponent<RevisedProps> = ({ revised }) => {
  if (revised === undefined) return null

  return (
    <span>
      &nbsp; (Revised:&nbsp;
      <time dateTime={revised}>{new Date(revised).toLocaleDateString()}</time>)
    </span>
  )
}

export default Revised
