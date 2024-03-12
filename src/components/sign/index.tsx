/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-12 12:36:37
 * @FilePath: /geekedu-web/src/components/sign/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react'
import { message } from 'antd'
import { sign } from '../../api/index'
import signIcon from '../../assets/img/commen/icon-sign-n.png'
import styles from './index.module.scss'

interface PropInterface {
  open: boolean
  success: () => void
}

export const SignComp: React.FC<PropInterface> = ({ open, success }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const goSign = () => {
    if (loading)
      return

    setLoading(true)
    sign
      .signIn()
      .then((res: any) => {
        setLoading(false)
        // if (res.data.reward === false)
        //   message.success(`今日已签到`)
        // else
        message.success(`签到成功，积分+${res.data}`)

        success()
      })
      .catch((e: any) => {
        message.error(e.message || JSON.stringify(e))
        setLoading(false)
      })
  }

  return (
    <>
      {open && (
        <div className={styles.backTop} onClick={() => goSign()}>
          <img src={signIcon} />
          <span>签到</span>
        </div>
      )}
    </>
  )
}
