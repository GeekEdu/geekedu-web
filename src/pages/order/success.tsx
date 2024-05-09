import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { order } from '../../api/index'
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

  // 请求后端查询支付宝支付状态，更新订单信息和支付信息
  useEffect(() => {
    order.checkOrderStatus({ orderId: outTradeNo}).then((res: any) => {
      setTradeStatus(res.data ? '交易成功' : '交易失败')
    })
  }, [])

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
