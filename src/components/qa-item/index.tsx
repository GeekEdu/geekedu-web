/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-17 15:19:45
 * @FilePath: /geekedu-web/src/components/qa-item/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import icon from '../../assets/img/commen/icon-question.png'
import styles from './index.module.scss'

interface PropInterface {
  cid: number
  title: string
  credit1: number
  statusText: string
  status: number
  viewTimes: number
  answerCount: number
  voteCount: number
}
export const QaItem: React.FC<PropInterface> = ({
  cid,
  title,
  credit1,
  statusText,
  status,
  viewTimes,
  answerCount,
  voteCount,
}) => {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/wenda/detail/${cid}`)
  }

  return (
    <div className={styles['qa-item-comp']} onClick={() => goDetail()}>
      <div className={styles.icon}>
        <img src={icon} />
      </div>
      {status && (
        <div className={styles['status-label']}>{statusText}</div>
      )}
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <div className={styles.stat}>
          <span className={styles['answer-count']}>
            {answerCount}
            个回答
          </span>
          <span className={styles['view-times']}>
            {viewTimes}
            次浏览
          </span>
          <span className={styles['vote-count']}>
            {voteCount}
            次点赞
          </span>
          {credit1 > 0 && (
            <span className={styles['credit1-label']}>
              {credit1}
              积分
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
