import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Tutorial: FC<IProps> = () => {
  return <div>Tutorial</div>
}

export default memo(Tutorial)
