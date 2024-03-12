import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { user as member } from '../../../../../api/index'
import {
  loginAction,
  setNewAddress,
} from '../../../../../store/user/loginUserSlice'
import backIcon from '../../../../../assets/img/back@2x.png'
import { ConfirmDialog } from '../confirm-dialog'
import { EditAddressDialog } from '../edit-address'
import styles from './index.module.scss'

interface PropInterface {
  open: boolean
  id: number
  isV: boolean
  onExchange: () => void
  onCancel: () => void
}

export const GoodsDetailComp: React.FC<PropInterface> = ({
  open,
  id,
  isV,
  onExchange,
  onCancel,
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [goods, setGoods] = useState<any>([])
  const [address, setAddress] = useState<string>('')
  const [openMask, setOpenMask] = useState<boolean>(false)
  const [dialogStatus, setDialogStatus] = useState<boolean>(false)
  const [addressId, setAddressId] = useState(0)
  const user = useSelector((state: any) => state.loginUser.value.user)
  const addressForm = useSelector(
    (state: any) => state.loginUser.value.addressForm,
  )

  useEffect(() => {
    if (open)
      getDetail()
  }, [open, id, isV])

  useEffect(() => {
    if (
      addressForm
      && addressForm.name
      && addressForm.mobile
      && addressForm.province
      && addressForm.city
      && addressForm.area
      && addressForm.street
    ) {
      const value
        = `${addressForm.name
         } ${
         addressForm.mobile
         } ${
         addressForm.province
         } ${
         addressForm.city
         } ${
         addressForm.area
         } ${
         addressForm.street}`
      setAddress(value)
      setAddressId(0)
    }
  }, [addressForm])

  const getDetail = () => {
    if (id === 0)
      return

    member.creditMallDetail(id).then((res: any) => {
      setGoods(res.data)
      if (!isV)
        getAddress()
    })
  }

  const getAddress = () => {
    member.creditMallAddress().then((res: any) => {
      const address = res.data
      if (
        addressForm
        && addressForm.name
        && addressForm.mobile
        && addressForm.province
        && addressForm.city
        && addressForm.area
        && addressForm.street
      ) {
        const value
          = `${addressForm.name
           } ${
           addressForm.mobile
           } ${
           addressForm.province
           } ${
           addressForm.city
           } ${
           addressForm.area
           } ${
           addressForm.street}`
        setAddress(value)
        setAddressId(0)
      }
      else if (
        address[0]
        && address[0].name !== ''
        && address[0].mobile !== ''
        && address[0].province !== ''
        && address[0].city !== ''
        && address[0].area !== ''
        && address[0].street != ''
      ) {
        const value
          = `${address[0].name
           } ${
           address[0].mobile
           } ${
           address[0].province
           } ${
           address[0].city
           } ${
           address[0].area
           } ${
           address[0].street}`
        setAddress(value)
        dispatch(setNewAddress(address[0]))
        setAddressId(address[0].id)
      }
      else {
        setAddressId(0)
        setAddress('请输入地址')
      }
    })
  }

  const resetUserDetail = () => {
    member.detail().then((res: any) => {
      const loginData = res.data
      dispatch(loginAction(loginData))
      onExchange()
    })
  }

  const exchange = () => {
    if (user.credit1 < goods.charge) {
      message.error('积分余额不足')
      return
    }
    if (!isV && address === '请输入地址') {
      message.error('请填写地址')
      return
    }
    setOpenMask(true)
  }

  const changeAddress = () => {
    setDialogStatus(true)
  }

  const submitHandle = () => {
    if (!isV) {
      const form = {
        address_id: addressId,
        name: addressForm.name,
        mobile: addressForm.mobile,
        province: addressForm.province,
        city: addressForm.city,
        area: addressForm.area,
        street: addressForm.street,
      }
      member.creditMallExchange(id, form).then((res: any) => {
        message.success('兑换成功')
        setOpenMask(false)
        resetUserDetail()
      })
    }
    else if (isV) {
      member.creditMallExchange(id, {}).then((res: any) => {
        setOpenMask(false)
        message.success('兑换成功')
        resetUserDetail()
      })
    }
  }

  return (
    <>
      {open && (
        <div className={styles['goodsDetail-box']}>
          <ConfirmDialog
            open={openMask}
            onSubmit={() => submitHandle()}
            onCancel={() => setOpenMask(false)}
          >
          </ConfirmDialog>
          <EditAddressDialog
            open={dialogStatus}
            onCancel={() => {
              setDialogStatus(false)
            }}
          >
          </EditAddressDialog>
          <div className={styles['btn-title']} onClick={() => onCancel()}>
            <img className={styles.back} src={backIcon} />
            <span>更多商品</span>
          </div>
          <div className={styles.body}>
            <div
              className={styles['goods-thumb']}
              style={{ backgroundImage: `url(${goods.cover})` }}
            >
            </div>
            <div className={styles.right}>
              <div className={styles['goods-title']}>{goods.title}</div>
              <div className={styles['goods-content']}>
                <div className={styles['goods-value']}>
                  {goods.charge}
                  积分
                </div>
                <div className={styles['goods-type']}>
                  {!isV && <span>商品类型:发实物</span>}
                  {isV && (
                    <>
                      {(goods.goodsType === 'vod'
                      || goods.goodsType === 'live'
                      || goods.goodsType === 'book') && (
                        <span>商品类型:换课程</span>
                      )}
                      {goods.goodsType === 'vip' && <span>商品类型:换会员</span>}
                    </>
                  )}
                </div>
              </div>
              <div className={styles['goods-info']}>
                <div
                  className={styles['goods-button']}
                  onClick={() => exchange()}
                >
                  立即兑换
                </div>
                {!isV && (
                  <div className={styles['address-bar']}>
                    <div className={styles['address-item']}>
                      <div className={styles['address-name']}>收货人信息</div>
                      <div
                        className={styles['address-button']}
                        onClick={() => changeAddress()}
                      >
                        编辑地址
                      </div>
                    </div>
                    <div className={styles['address-value']}>{address}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.name}>
              <i></i>
              商品介绍
            </div>
            <div
              className={styles.desc}
              dangerouslySetInnerHTML={{ __html: goods.intro }}
            >
            </div>
          </div>
        </div>
      )}
    </>
  )
}
