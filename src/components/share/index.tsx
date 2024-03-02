import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconQQ from '../../assets/img/commen/icon-qq.png'
import iconSina from '../../assets/img/commen/icon-weibo.png'
import styles from './index.module.scss'

interface PropInterface {
  cid: number
  title: string
  thumb: string
}
export const ShareComp: React.FC<PropInterface> = ({ cid, title, thumb }) => {
  const navigate = useNavigate()
  const [qqUrl, setQQUrl] = useState<string>('')
  const [sinaUrl, setSinaUrl] = useState<string>('')
  const config = useSelector((state: any) => state.systemConfig.value.config)
  useEffect(() => {
    getData()
  }, [cid])

  const getData = () => {
    const baseUrl = new URL(config.pc_url)
    const url = encodeURIComponent(
      `${baseUrl.protocol
        }//${
        baseUrl.host
        }${baseUrl.pathname
        }topic/detail/`,
    )

    const qqValue
      = `https://connect.qq.com/widget/shareqq/index.html?url=${
       url
       }${cid
       }&title=${
       title
       }&summary=${
       title
       }&pics=${
       thumb
       }&site=${
       config.webname}`
    setQQUrl(qqValue)
    const sinaValue
      = `https://service.weibo.com/share/share.php?url=${
       url
       }${cid
       }&title=${
       title
       }&pic=${
       thumb}`
    setSinaUrl(sinaValue)
  }

  return (
    <div className={styles.share}>
      <span>分享到</span>
      {qqUrl && (
        <a className={styles.qq} target="_blank" href={qqUrl} rel="noreferrer">
          <img
            className={styles['qq-icon']}
            style={{ width: 40, height: 40 }}
            src={iconQQ}
          />
        </a>
      )}
      {sinaUrl && (
        <a className={styles.sina} target="_blank" href={sinaUrl} rel="noreferrer">
          <img
            className={styles['sina-icon']}
            style={{ width: 40, height: 40 }}
            src={iconSina}
          />
        </a>
      )}
    </div>
  )
}
