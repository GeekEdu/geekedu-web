import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { QRCode, message } from 'antd'
import { order } from '../../api/index'
import wepayIcon from '../../assets/img/commen/icon-zfb@2x.png'
import cradIcon from '../../assets/img/commen/icon-card.png'
import { getAppUrl } from '../../utils/index'
import styles from './pay.module.scss'

const timer: any = null
function OrderPayPage() {
  document.title = '支付中'
  const navigate = useNavigate()
  const result = new URLSearchParams(useLocation().search)
  const [loading, setLoading] = useState<boolean>(true)
  const [payment, setPayment] = useState(result.get('payment'))
  const [id, setId] = useState(Number(result.get('id')))
  const [price, setPrice] = useState(Number(result.get('price')))
  const [orderId, setOrderId] = useState(Number(result.get('orderId')))
  const [goodsId, setGoodsId] = useState(Number(result.get('goods_id')))
  const [goodsType, setGoodsType] = useState(result.get('type'))
  const [courseId, setCourseId] = useState(Number(result.get('course_id')))
  const [courseType, setCourseType] = useState(result.get('course_type'))
  const [text, setText] = useState<string>('')
  const [qrode, setQrode] = useState<string>('loading')
  const [orderInfo, setOrderInfo] = useState<any>({})
  const user = useSelector((state: any) => state.loginUser.value.user)
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)
  const orderDesc = useSelector((state: any) => state.orderInfo.value)
  const systemConfig = useSelector((state: any) => state.systemConfig.value.config)

  useEffect(() => {
    initData()
    return () => {
      timer && clearInterval(timer)
    }
  }, [])

  const initData = () => {
    // 设置订单信息
    setOrderInfo(orderDesc)
    console.log(orderDesc)
    console.log(orderInfo)
    // timer = setInterval(checkOrder, 2000)
    if (payment === 'wechatpay') {
      order
        .payWechatScan({
          orderId,
        })
        .then((res: any) => {
          setQrode(res.data.qrCode)
          setLoading(false)
        })
        .catch((e) => {
          setLoading(false)
          // timer && clearInterval(timer)
          navigate('/')
        })
    }
    else if (payment === 'handpay') {
      order
        .handPay({
          order_id: orderId,
        })
        .then((res: any) => {
          setText(res.data.text)
          setLoading(false)
        })
        .catch((e) => {
          setLoading(false)
          // timer && clearInterval(timer)
          navigate('/')
        })
    }
  }

  const checkOrder = () => {
    order.checkOrderStatus({ orderId }).then((res: any) => {
      const status = res.data.status
      if (status === 9) {
        message.success('已成功支付')
        setTimeout(() => {
          goBack()
        }, 300)
      }
      else if (status === 7) {
        message.error('已取消')
        setTimeout(() => {
          goBack()
        }, 300)
      }
    })
  }

  const goBack = () => {
    timer && clearInterval(timer)
    if (goodsType === 'role') {
      navigate('/member', { replace: true })
    }
    else if (goodsType === 'book') {
      navigate(`/book/detail/${id}`)
    }
    else if (goodsType === 'vod') {
      navigate(`/courses/detail/${id}`)
    }
    else if (goodsType === 'live') {
      navigate(`/live/detail/${id}`)
    }
    else if (goodsType === 'topic') {
      navigate(`/topic/detail/${id}`)
    }
    else if (goodsType === 'video') {
      navigate(`/courses/video/${id}`)
    }
    else if (goodsType === 'path') {
      navigate(`/learnPath/detail/${id}`)
    }
    else if (goodsType === 'paper') {
      navigate(`/exam/papers/detail/${id}`)
    }
    else if (goodsType === 'practice') {
      navigate(`/exam/practice/detail/${id}`)
    }
    else if (goodsType === 'mockpaper') {
      navigate(`/exam/mockpaper/detail/${id}`)
    }
    else if (goodsType === 'k12') {
      navigate(`/k12/detail?id=${id}`)
    }
    else if (goodsType === 'tg') {
      if (courseType === 'course')
        navigate(`/courses/detail/${courseId}`)
      else if (courseType === 'live')
        navigate(`/live/detail/${courseId}`)
      else if (courseType === 'book')
        navigate(`/book/detail/${courseId}`)
      else if (courseType === 'learnPath')
        navigate(`/learnPath/detail/${courseId}`)
      else
        navigate(`/tg/detail?id=${courseId}`)
    }
    else if (goodsType === 'ms') {
      if (courseType === 'course')
        navigate(`/courses/detail/${courseId}`)
      else if (courseType === 'live')
        navigate(`/live/detail/${courseId}`)
      else if (courseType === 'book')
        navigate(`/book/detail/${courseId}`)
      else if (courseType === 'learnPath')
        navigate(`/learnPath/detail/${courseId}`)
      else
        navigate(`/ms/detail?id=${courseId}`)
    }
  }

  const goLogin = () => {
    timer && clearInterval(timer)
    const url = encodeURIComponent(
      window.location.pathname + window.location.search,
    )
    navigate(`/login?redirect=${url}`)
  }

  const confirm = () => {
    if (!isLogin) {
      goLogin()
      return
    }
    goBack()
  }

  const handleAliPay = () => {
    const host = getAppUrl()
    const redirect = encodeURIComponent(`${host}/success`)
    window.location.href
          = `${systemConfig.url
           }/trade/api/pay/aliPay?orderId=${
           orderInfo.orderId
           }&scene=pc&payment=ALIPAY
           &redirect=${redirect}`
  }

  return (
    <div className={styles.content}>
      {payment === 'alipay' && (
        <div className={styles['pay-box']}>
          <div className={styles['pay-info']}>
            <div className={styles['pay-top']}>
              <div className={styles.icon}>
                <img src={wepayIcon} />
                支付宝支付
              </div>
              <div className={styles.close} onClick={() => goBack()}>
                取消支付
              </div>
            </div>
            <div className={styles.paycode}>
              <div className={styles.info}>
                <div className={styles.orderNum}>
                  订单号：
                  {orderInfo.orderId}
                </div>
                <div className={styles.goodsName}>
                  商品名：
                  {orderInfo.goodsName}
                </div>
                <div className={styles.goodsType}>
                  商品类型：
                  {orderInfo.goodsType}
                </div>
                <div className={styles.orderNotes}>
                  订单备注：
                  {orderInfo.orderNotes}
                </div>
                <div className={styles.createdTime}>
                  订单创建时间：
                  {orderInfo.createdTime}
                </div>
                <div className={styles.price}>
                  <span>商品原价：</span>
                  <span className={styles.red}>
                    ￥
                    <strong>{orderInfo.goodsPrice}</strong>
                  </span>
                </div>
                <div className={styles.price}>
                  <span>优惠价：</span>
                  <span className={styles.red}>
                    ￥
                    <strong>{orderInfo.goodsDiscount}</strong>
                  </span>
                </div>
                <div className={styles.price}>
                  <span>需支付：</span>
                  <span className={styles.red}>
                    ￥
                    <strong>{orderInfo.amount}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.countDown}>
            请在
            {orderInfo.cancelTime}
            内完成支付
          </div>
          <div className={styles['btn-confirm']} onClick={() => handleAliPay()}>
            去支付
          </div>
        </div>
      )}
      {payment === 'wechatpay' && (
        <div className={styles['pay-box']}>
          <div className={styles['pay-info']}>
            <div className={styles['pay-top']}>
              <div className={styles.icon}>
                <img src={wepayIcon} />
                扫码支付
              </div>
              <div className={styles.close} onClick={() => goBack()}>
                取消支付
              </div>
            </div>
            <div className={styles.paycode}>
              <div className={styles.info}>
                <div className={styles.orderNum}>
                  订单号：
                  {orderInfo.orderId}
                </div>
                <div className={styles.goodsName}>
                  商品名：
                  {orderInfo.goodsName}
                </div>
                <div className={styles.goodsType}>
                  商品类型：
                  {orderInfo.goodsType}
                </div>
                <div className={styles.orderNotes}>
                  订单备注：
                  {orderInfo.orderNotes}
                </div>
                <div className={styles.createdTime}>
                  订单创建时间：
                  {orderInfo.createdTime}
                </div>
                <div className={styles.price}>
                  <span>商品原价：</span>
                  <span className={styles.red}>
                    ￥
                    <strong>{orderInfo.goodsPrice}</strong>
                  </span>
                </div>
                <div className={styles.price}>
                  <span>优惠价：</span>
                  <span className={styles.red}>
                    ￥
                    <strong>{orderInfo.goodsDiscount}</strong>
                  </span>
                </div>
                <div className={styles.price}>
                  <span>需支付：</span>
                  <span className={styles.red}>
                    ￥
                    <strong>{orderInfo.amount}</strong>
                  </span>
                </div>
              </div>
              <QRCode
                size={200}
                value={qrode}
                status={loading ? 'loading' : 'active'}
              />
            </div>
          </div>
          <div className={styles.countDown}>
            请在
            {orderInfo.cancelTime}
            内完成支付
          </div>
          <div className={styles['btn-confirm']} onClick={() => confirm()}>
            已完成支付
          </div>
        </div>
      )}
      {payment === 'handPay' && (
        <div className={styles['pay-box']}>
          <div className={styles['pay-info']}>
            <div className={styles['pay-top']}>
              <div className={styles.icon}>
                <img src={cradIcon} />
                手动支付
              </div>
              <div className={styles.close} onClick={() => goBack()}>
                取消支付
              </div>
            </div>
            <div className={styles.paycode2}>
              <div className={styles['hand-box']}>
                <div className={styles.tit}>收款信息及说明</div>
                <div
                  className={styles.text}
                  dangerouslySetInnerHTML={{ __html: text }}
                >
                </div>
              </div>
              <div className={styles.orderNum}>
                订单号：
                {orderInfo.orderId}
              </div>
              <div className={styles.goodsName}>
                商品名：
                {orderInfo.goodsName}
              </div>
              <div className={styles.goodsType}>
                商品类型：
                {orderInfo.goodsType}
              </div>
              <div className={styles.orderNotes}>
                订单备注：
                {orderInfo.orderNotes}
              </div>
              <div className={styles.createdTime}>
                订单创建时间：
                {orderInfo.createdTime}
              </div>
              <div className={styles.price}>
                <span>商品原价：</span>
                <span className={styles.red}>
                  ￥
                  <strong>{orderInfo.goodsPrice}</strong>
                </span>
              </div>
              <div className={styles.price}>
                <span>优惠价：</span>
                <span className={styles.red}>
                  ￥
                  <strong>{orderInfo.goodsDiscount}</strong>
                </span>
              </div>
              <div className={styles.price}>
                <span>需支付：</span>
                <span className={styles.red}>
                  ￥
                  <strong>{orderInfo.amount}</strong>
                </span>
              </div>
            </div>
          </div>
          <div className={styles['btn-confirm']} onClick={() => confirm()}>
            已完成支付
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderPayPage
