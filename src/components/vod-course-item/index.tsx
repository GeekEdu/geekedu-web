/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 20:15:44
 * @FilePath: /geekedu-web/src/components/vod-course-item/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbBar } from '../thumb-bar'
import styles from './index.module.scss'

interface PropInterface {
  cid: number
  title: string
  videosCount: number
  thumb: string
  charge: number
  isFree: number
  userCount: number
  category: any
}
export const VodCourseItem: React.FC<PropInterface> = ({
  cid,
  title,
  videosCount,
  thumb,
  charge,
  isFree,
  userCount,
  category,
}) => {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/courses/detail/${cid}`)
  }

  return (
    <div className={styles['vod-course-item-comp']} onClick={() => goDetail()}>
      <div className={styles['vod-course-thumb']}>
        <div className={styles['thumb-bar']}>
          <ThumbBar value={thumb} width={264} height={198} border={null} />
        </div>
      </div>
      <div className={styles['vod-course-body']}>
        <div className={styles['vod-course-title']}>{title}</div>
        <div className={styles['vod-course-info']}>
          <div className={styles['vod-course-sub']}>{category.name}</div>
          <div className={styles['vod-course-charge']}>
            {!isFree && charge > 0 && (
              <span className={styles['charge-text']}>
                <span className={styles.unit}>￥</span>
                {charge}
              </span>
            )}
            {isFree && <span className={styles['free-text']}>免费</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
