/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-16 17:10:47
 * @FilePath: /geekedu-web/src/components/topic-course-item/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbBar } from '../thumb-bar'
import styles from './index.module.scss'

interface PropInterface {
  cid: number
  title: string
  thumb: string
  charge: number
  category: any
  viewTimes: number
  isVipFree: boolean
  isNeedLogin: boolean
  thumbCount: number
  commentCount: number
}

export const TopicCourseItem: React.FC<PropInterface> = ({
  cid,
  title,
  thumb,
  charge,
  category,
  viewTimes,
  isVipFree,
  isNeedLogin,
  thumbCount,
  commentCount,
}) => {
  const navigate = useNavigate()
  const goDetail = () => {
    navigate(`/topic/detail/${cid}`)
  }

  return (
    <div className={styles['topic-item-comp']} onClick={() => goDetail()}>
      <div className={styles['topic-thumb']}>
        <div className={styles['thumb-bar']}>
          <ThumbBar value={thumb} width={133} height={100} border={null} />
        </div>
      </div>
      <div className={styles['topic-body']}>
        <div className={styles['topic-title']}>{title}</div>
        <div className={styles['topic-info']}>
          <div className={styles.category}>{category}</div>
          <span className={styles['read-count']}>
            {viewTimes}
            次阅读
          </span>
          <span className={styles['thumb-count']}>
            {thumbCount}
            次点赞
          </span>
        </div>
      </div>
    </div>
  )
}
