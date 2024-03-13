/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-13 16:18:57
 * @FilePath: /geekedu-web/src/pages/live/components/detail/video-list/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DurationText } from '../../../../../components'
import lockIcon from '../../../../../assets/img/commen/icon-lock.png'
import unLockIcon from '../../../../../assets/img/commen/icon-unlock.png'
import { dateFormat } from '../../../../../utils/index'
import styles from './index.module.scss'

interface PropInterface {
  videos: any[]
  course: any
  isBuy: boolean
  switchVideo: (item: any) => void
}

export const VideoListComp: React.FC<PropInterface> = ({
  course,
  videos,
  isBuy,
  switchVideo,
}) => {
  return (
    <>
      <div className={styles['chapter-item']}>
        <div className={styles['chapter-videos-box']}>
          {videos.length > 0
          && videos.map((item: any) => (
            <div
              key={item.id}
              className={styles['video-item']}
              onClick={() => switchVideo(item)}
            >
              {isBuy && (
                <img className={styles['play-icon']} src={unLockIcon} />
              )}
              {!isBuy && (
                <img className={styles['play-icon']} src={lockIcon} />
              )}
              <div className={styles['video-title']}>
                <div className={styles.text}>{item.title}</div>
              </div>
              <div className={styles['video-info']}>
                {item.status === 0 && (
                  <span style={{ color: '#3ca7fa' }}>
                    {dateFormat(item.liveTime)}
                  </span>
                )}
                {item.status === 1 && (
                  <span style={{ color: '#04c877' }}>直播中</span>
                )}
                {item.status === 2 && (
                  <>
                    <span>已结束 </span>
                    <DurationText seconds={item.duration} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
