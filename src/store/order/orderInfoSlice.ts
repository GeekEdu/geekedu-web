/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-03-18 12:30:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 12:36:59
 * @FilePath: /geekedu-web/src/store/order/orderInfoSlice.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createSlice } from '@reduxjs/toolkit'

interface OrderStoreInterface {
  orderId: string
  orderStatusText: string
  orderNotes: string
  goodsType: string
  goodsName: string
  goodsPrice: string
  goodsDiscount: string
  amount: string
  payType: string
  createdTime: any
  cancelTime: any
}

const defaultValue: OrderStoreInterface = {
  orderId: '',
  orderStatusText: '',
  orderNotes: '',
  goodsType: '',
  goodsName: '',
  goodsPrice: '',
  goodsDiscount: '',
  amount: '',
  payType: '',
  createdTime: '',
  cancelTime: '',
}

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState: {
    value: defaultValue,
  },
  reducers: {
    orderInfoAction(state, action) {
      state.value.orderId = action.payload.orderId
      state.value.orderStatusText = action.payload.orderStatusText
      state.value.orderNotes = action.payload.orderNotes
      state.value.goodsType = action.payload.goodsType
      state.value.goodsName = action.payload.goodsName
      state.value.goodsPrice = action.payload.goodsPrice
      state.value.goodsDiscount = action.payload.goodsDiscount
      state.value.amount = action.payload.amount
      state.value.payType = action.payload.payType
      state.value.createdTime = action.payload.createdTime
      state.value.cancelTime = action.payload.cancelTime
    },
  },
})

export default orderInfoSlice.reducer

export const {
  orderInfoAction,
} = orderInfoSlice.actions

export type { OrderStoreInterface }
