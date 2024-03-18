import React, { useEffect, useState } from 'react'
import { Button, Input, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { order } from '../../api/index'
import { ThumbBar } from '../../components'
import defaultPaperIcon from '../../assets/img/commen/default-paper.png'
import defaultVipIcon from '../../assets/img/commen/default-vip.png'
import zfbIcon from '../../assets/img/commen/icon-zfb.png'
import wepayIcon from '../../assets/img/commen/icon-wepay.png'
import cradIcon from '../../assets/img/commen/icon-crad.png'
import { getAppUrl, getToken } from '../../utils/index'
import { orderInfoAction } from '../../store/order/orderInfoSlice'
import styles from './index.module.scss'

function OrderPage() {
  document.title = '收银台'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const result = new URLSearchParams(useLocation().search)
  const [loading, setLoading] = useState<boolean>(false)
  const [payment, setPayment] = useState<string>('')
  const [payments, setPayments] = useState<any>([])
  const [paymentScene, setPaymentScene] = useState<string>('pc')
  const [promoCode, setPromoCode] = useState<string>('')
  const [promoCodeModel, setPromoCodeModel] = useState<any>(null)
  const [pcCheckLoading, setPcCheckLoading] = useState(false)
  const [aliStatus, setAliStatus] = useState<boolean>(false)
  const [weStatus, setWeStatus] = useState<boolean>(false)
  const [handStatus, setHandStatus] = useState<boolean>(false)
  const [hasThumb, setHasThumb] = useState<boolean>(false)
  const [configTip, setConfigTip] = useState<number>(999)
  const [discount, setDiscount] = useState<number>(0)
  const [goodsType, setGoodsType] = useState(result.get('goods_type'))
  const [goodsId, setGoodsId] = useState(Number(result.get('goods_id')))
  const [goodsThumb, setGoodsThumb] = useState<string>(
    String(result.get('goods_thumb')),
  )
  const [goodsName, setGoodsName] = useState(result.get('goods_name'))
  const [goodsLabel, setGoodsLabel] = useState(result.get('goods_label'))
  const [tgGid, setTgGid] = useState(Number(result.get('tg_gid')) || 0)
  const [courseId, setCourseId] = useState(Number(result.get('course_id')))
  const [goodsCharge, setGoodsCharge] = useState(
    Number(result.get('goods_charge')),
  )
  const [courseType, setCourseType] = useState(result.get('course_type'))
  const [total, setTotal] = useState<number>(
    Number(result.get('goods_charge')),
  )
  const [totalVal, setTotalVal] = useState<number>(0)
  const configFunc = useSelector(
    (state: any) => state.systemConfig.value.configFunc,
  )
  const systemConfig = useSelector(
    (state: any) => state.systemConfig.value.config,
  )

  useEffect(() => {
    initData()
  }, [goodsType])

  useEffect(() => {
    let val = total - discount
    val = val < 0 ? 0 : val
    setTotalVal(val)
  }, [total, discount])

  useEffect(() => {
    const data = []
    if (aliStatus) {
      data.push({
        name: '支付宝',
        sign: 'alipay',
      })
    }
    if (weStatus) {
      data.push({
        name: '微信支付',
        sign: 'wechatpay',
      })
    }
    if (handStatus) {
      data.push({
        name: '手动打款',
        sign: 'handpay',
      })
    }
    setPayments(data)
  }, [aliStatus, weStatus, handStatus])

  const initData = () => {
    if (goodsType === 'role')
      setHasThumb(true)
    else if (goodsType === 'vod')
      setHasThumb(true)
    else if (goodsType === 'live')
      setHasThumb(true)
    else if (goodsType === 'video')
      setHasThumb(true)
    else if (goodsType === 'book')
      setHasThumb(true)
    else if (goodsType === 'topic')
      setHasThumb(true)
    else if (goodsType === 'path')
      setHasThumb(true)
    else if (goodsType === 'tg')
      setHasThumb(true)
    else if (goodsType === 'ms')
      setHasThumb(true)
    else if (goodsType === 'k12')
      setHasThumb(true)
    else if (goodsType === 'paper')
      setHasThumb(true)
    else if (goodsType === 'mockpaper')
      setHasThumb(true)
    else if (goodsType === 'practice')
      setHasThumb(true)

    params()
  }

  const params = () => {
    order
      .payments({
        scene: 'pc',
      })
      .then((res: any) => {
        const payments = res.data
        for (let i = 0; i < payments.length; i++) {
          setPayment(payments[0].sign)
          if (payments[i].sign === 'alipay')
            setAliStatus(true)
          else if (payments[i].sign === 'wechatpay')
            setWeStatus(true)
          else if (payments[i].sign === 'handpay')
            setHandStatus(true)
        }
      })
  }

  const checkPromoCode = () => {
    if (loading)
      return

    if (!promoCode)
      return

    setPcCheckLoading(true)
    if (
      configFunc.share
      && (promoCode.substr(0, 1) === 'u' || promoCode.substr(0, 1) === 'U')
    ) {
      setConfigTip(0)
      return
    }
    setConfigTip(999)
    setLoading(true)
    order
      .promoCodeCheck(promoCode)
      .then((res: any) => {
        if (res.data.can_use !== 1) {
          setConfigTip(0)
        }
        else {
          setConfigTip(1)
          setPromoCodeModel(res.data.promo_code)
          const value = Number.parseInt(res.data.promo_code.invited_user_reward)
          setDiscount(value)
        }
        setLoading(false)
        setPcCheckLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        setConfigTip(999)
        setPcCheckLoading(false)
      })
  }

  const payHandler = () => {
    if (!payment) {
      message.error('请选择支付方式')
      return
    }
    if (loading)
      return

    setLoading(true)
    if (goodsType === 'vod') {
      // 点播课程
      order
        .createCourseOrder({
          course_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'video') {
      // 视频
      order
        .createVideoOrder({
          video_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'role') {
      order
        .createRoleOrder({
          goodsId,
          goodsType: 'VIP',
          promoCode,
          payment: payment === 'alipay' ? 'ALIPAY' : (payment === 'wechatpay' ? 'WX_PAY' : 'OTHER'),
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'live') {
      order
        .createLiveOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'book') {
      order
        .createBookOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'paper') {
      order
        .createPaperOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'practice') {
      order
        .createPracticeOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'mockpaper') {
      order
        .createMockpaperOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'path') {
      order
        .createPathOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'tg') {
      order
        .createTgOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
          gid: tgGid,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'ms') {
      order
        .createMsOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'topic') {
      order
        .createTopicOrder(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
    else if (goodsType === 'k12') {
      order
        .createK12Order(goodsId, {
          goods_id: goodsId,
          promo_code: promoCode,
        })
        .then((res: any) => {
          orderCreatedHandler(res.data)
        })
        .catch((e) => {
          setLoading(false)
        })
    }
  }

  // const orderCreatedHandler = (data: any) => {
  //   setLoading(false)
  //   // 判断是否继续走支付平台支付
  //   if (data.statusText === '已支付') {
  //     // 优惠全部抵扣
  //     message.success('支付成功')

  //     setTimeout(() => {
  //       navigate(-1)
  //     }, 1000)
  //   }
  //   else {
  //     if (payment === 'alipay') {
  //       const host = getAppUrl()
  //       const redirect = encodeURIComponent(`${host}/success`)
  //       const indexUrl = encodeURIComponent(`${host}/`)
  //       window.location.href
  //         = `${systemConfig.url
  //          }/trade/api/aliPay/pay?order_id=${
  //          data.orderId
  //          }&payment_scene=${
  //          paymentScene
  //          }&scene=${
  //          paymentScene
  //          }&payment=${
  //          payment
  //          }&token=${
  //          getToken()
  //          }&redirect=${
  //          redirect
  //          }&cancel_redirect=${
  //          indexUrl}`
  //     }
  //     else if (payment === 'handpay' || payment === 'wechatpay') {
  //       navigate(
  //         `/order/pay?orderId=${
  //         data.orderId
  //            }&price=${
  //            totalVal
  //            }&payment=${
  //            payment
  //            }&type=${
  //            goodsType
  //            }&id=${
  //            goodsId
  //            }&course_id=${
  //            courseId
  //            }&course_type=${
  //            courseType}`,
  //       )
  //     }
  //     else {
  //       payFailure()
  //     }
  //   }
  // }
  const orderCreatedHandler = (data: any) => {
    setLoading(false)
    dispatch(orderInfoAction(data))
    // 跳转页面
    navigate(
      `/order/pay?payment=${
        payment
      }&type=${
        goodsType
      }&id=${
        goodsId
      }&course_id=${
        courseId
      }&course_type=${
        courseType}`,
    )
    // }
    // else {
    //   payFailure()
    // }
  }

  const payFailure = () => {
    message.error('无法支付')
    setLoading(false)
  }

  return (
    <div className="container">
      <div className={styles.box}>
        <div className={styles.tit}>订阅信息</div>
        <div className={styles['goods-box']}>
          {hasThumb && (
            <div className={styles['goods-thumb']}>
              {goodsType === 'book'
                ? (
                  <ThumbBar
                    value={goodsThumb}
                    width={90}
                    height={120}
                    border={4}
                  >
                  </ThumbBar>
                  )
                : goodsType === 'mockpaper'
                || goodsType === 'paper'
                || goodsType === 'practice'
                  ? (
                    <img
                      style={{ width: 160, height: 120, borderRadius: 4 }}
                      src={defaultPaperIcon}
                    />
                    )
                  : goodsType === 'role'
                    ? (
                      <img
                        style={{ width: 160, height: 120, borderRadius: 4 }}
                        src={defaultVipIcon}
                      />
                      )
                    : (
                      <ThumbBar
                        value={goodsThumb}
                        width={160}
                        height={120}
                        border={4}
                      >
                      </ThumbBar>
                      )}
            </div>
          )}
          <div className={styles['goods-info']}>
            <div className={styles['goods-name']}>{goodsName}</div>
            <div className={styles['goods-label']}>{goodsLabel}</div>
          </div>
          <div className={styles['goods-charge']}>
            <span className={styles.small}>￥</span>
            {total}
          </div>
        </div>
        <div className={styles.tit}>优惠码</div>
        <div className={styles['promocode-box']}>
          <Input
            className={styles.input}
            value={promoCode}
            placeholder="请输入优惠码"
            onChange={(e) => {
              setPromoCode(e.target.value)
            }}
            disabled={pcCheckLoading}
          >
          </Input>
          <div
            className={styles['btn-confirm']}
            onClick={() => checkPromoCode()}
          >
            验证
          </div>
          {configTip === 0 && (
            <div className={styles.tip}>此优惠码无效，请重新输入验证</div>
          )}
          {configTip === 1 && (
            <div className={styles.tip}>
              此优惠码有效，已减免
              {discount <= total ? discount : total}
              元
            </div>
          )}
        </div>
        <div className={styles.tit}>支付方式</div>
        <div className={styles['credit2-box']}>
          {payments.map((item: any) => (
            <div
              key={item.sign}
              className={
                item.sign === payment
                  ? styles['payment-active-item']
                  : styles['payment-item']
              }
              onClick={() => setPayment(item.sign)}
            >
              {item.sign === 'alipay' && <img src={zfbIcon} />}
              {item.sign === 'wechatpay' && <img src={wepayIcon} />}
              {/* {item.sign === 'handpay' && <img src={cradIcon} />} */}
            </div>
          ))}
        </div>
        <div className={styles.line}></div>
        <div className={styles['price-box']}>
          <span>优惠码已减</span>
          <span className={styles.red}>
            {discount <= total ? discount : total}
          </span>
          <span>元，需支付</span>
          <span className={styles.red}>
            ￥
            <span className={styles.big}>{totalVal}</span>
          </span>
        </div>
        <div className={styles['order-tip']}>请在15分钟内支付完成</div>
        <Button
          type="primary"
          loading={loading}
          className={styles['btn-submit']}
          onClick={() => payHandler()}
        >
          提交订单
        </Button>
      </div>
    </div>
  )
}

export default OrderPage
