/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-03-28 15:31:41
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-28 16:18:24
 * @FilePath: /geekedu-web/src/components/coupon-item/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { FC } from 'react'
import React, { useState } from 'react'
import { message } from 'antd'
import styles from './index.module.scss'

// 定义组件接受的props类型
interface CouponItemProps {
  storeName: string
  discount: string
  couponCode: string
  validity: string
  imgUrl: string
}

export const CouponItemPage: FC<CouponItemProps> = ({ storeName, discount, couponCode, validity, imgUrl }) => {
  const [messageApi, contextHolder] = message.useMessage()
  // 复制优惠码到剪贴板
  const copyIt = () => {
    navigator.clipboard.writeText(couponCode).then(() => {
      messageApi.open({
        type: 'success',
        content: 'Copied!',
      })
    }).catch((err) => {
      console.error('Could not copy text: ', err)
    })
  }

  return (
    <>
      {contextHolder}
      <div className={styles['coupon-card']}>
        <div className={styles['coupon-main']}>
          <div className={styles['coupon-img']}>
            <img src={imgUrl} alt={`${storeName} coupon`} />
          </div>
          <div className={styles['coupon-vertical']}></div>
          <div className={styles['coupon-content']}>
            <h2>{storeName}</h2>
            <h1>
              {discount}
              <span>Coupon</span>
            </h1>
            <p>
              expires on
              {validity}
            </p>
          </div>
        </div>
        <div className={styles['coupon-copyButton']}>
          <input id="copyValue" type="text" readOnly value={couponCode} />
          <button onClick={copyIt} className={styles.copyBtn}>COPY</button>
        </div>
      </div>
    </>
  )
}
