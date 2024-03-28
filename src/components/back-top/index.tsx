import React from 'react'
import icon from '../../assets/img/commen/icon-top.png'
import styles from './index.module.scss'

export const BackTop: React.FC = () => {
  return (
    <div className={styles.backTop} onClick={() => window.scrollTo(0, 0)}>
      <img src={icon} />
      <span>顶部</span>
    </div>
  )
}
