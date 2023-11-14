import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Courses: FC<IProps> = () => {
  return <div>Courses</div>
}

export default memo(Courses)
