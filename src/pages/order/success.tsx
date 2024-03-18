/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 15:43:10
 * @FilePath: /geekedu-web/src/pages/order/success.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import successIcon from '../../assets/img/commen/icon-adopt.png'
import styles from './success.module.scss'

function OrderSuccessPage() {
  document.title = '支付成功'
  const result = new URLSearchParams(useLocation().search)
  const [totalAmount, setTotalAmount] = useState(
    result.get('total_amount') || 0,
  )
  const [tradeNo, setTradeNo] = useState(result.get('trade_no') || 0)
  const [tradeStatus, setTradeStatus] = useState(result.get('trade_status') || '交易成功')
  const [outTradeNo, setOutTradeNo] = useState(result.get('out_trade_no') || 0)

  return (
    <div className="container">
      <div className={styles['pay-success-box']}>
        <div className={styles['success-info']}>
          <img src={successIcon} />
          {tradeStatus}
          ！！！
        </div>
        <div className={styles.tradeNo}>
          交易订单号：
          {tradeNo}
        </div>
        <div className={styles.price}>
          实付款：
          <span className={styles.value}>
            ￥
            <strong>{totalAmount}</strong>
          </span>
        </div>
        <div className={styles['btn-box']}>
          <Link replace to="/">
            <div className={styles.button}>返回首页</div>
          </Link>
          <Link replace to="/member/orders">
            <div className={styles['find-button']}>查看订单</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
