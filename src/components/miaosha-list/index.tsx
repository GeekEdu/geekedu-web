/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-26 15:29:22
 * @FilePath: /geekedu-web/src/components/miaosha-list/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { CountDown } from '../count-down'
import styles from './index.module.scss'

interface PropInterface {
  msData: any
}

export const MiaoshaList: React.FC<PropInterface> = ({ msData }) => {
  const calTime: any = (endAt: any) => {
    // 通过以过期时间减去当前时间，得到一个差值，单位为秒
    const now = new Date()
    const end = new Date(endAt)
    return Math.floor((end.getTime() - now.getTime()) / 1000)
  }

  return (
    <>
      {msData.data && (
        <div className={styles['ms-comp']}>
          <div className={styles['ms-content']}>
            <div className={styles['sp-mask']}></div>
            <div className={styles['sp-transform']}></div>
            <div className={styles.original_charge}>
              原价￥
              {msData.data.originPrice}
            </div>
            <div className={styles.charge}>
              <span className={styles['ms-text']}>限时秒杀价:</span>
              <span className={styles['charge-text']}>
                <span className={styles.unit}>￥</span>
                {msData.data.price}
              </span>
            </div>
            {msData.data.isOver && (
              <div className={styles.price}>
                <div className={styles.end}>已售罄</div>
              </div>
            )}
            {msData.data.isStart && (
              <div className={styles.price}>
                <div className={styles['ms-time']}>
                  距秒杀结束剩余
                  <CountDown timestamp={calTime(msData.data.endAt)} type="" />
                </div>
                <i className={styles.line}></i>
                <div className={styles['ms-time']}>
                  库存剩余
                  {msData.data.stock}
                  件
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
