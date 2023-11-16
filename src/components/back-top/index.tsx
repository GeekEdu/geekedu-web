import React, { memo } from 'react'
import type { FC } from 'react'

import styles from './index.module.scss'
import icon from '@/assets/img/commen/icon-top.png'

const BackTop: FC = () => {
  return (
    <div className={styles['backTop']} onClick={() => window.scrollTo(0, 0)}>
      <img src={icon} alt='xxx' />
      <span>顶部</span>
    </div>
  )
}

export default memo(BackTop)
