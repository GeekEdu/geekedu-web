/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 12:38:04
 * @FilePath: /geekedu-web/src/store/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { configureStore } from '@reduxjs/toolkit'
import systemConfigReducer from './system/systemConfigSlice'
import loginUserReducer from './user/loginUserSlice'
import navsMenuReducer from './nav-menu/navMenuConfigSlice'
import orderInfoReducer from './order/orderInfoSlice'

const store = configureStore({
  reducer: {
    loginUser: loginUserReducer,
    systemConfig: systemConfigReducer,
    navsConfig: navsMenuReducer,
    orderInfo: orderInfoReducer,
  },
})

export default store
