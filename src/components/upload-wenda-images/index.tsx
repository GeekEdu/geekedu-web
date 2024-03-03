import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import config from '../../js/config'
import uploadIcon from '../../assets/img/commen/upload.png'
import { getToken } from '../../utils/index'
import styles from './index.module.scss'

interface PropInterface {
  open: boolean
  fresh: boolean
  onUpdate: (thumbs: any[]) => void
}

export const UploadWendaImagesComp: React.FC<PropInterface> = ({
  open,
  fresh,
  onUpdate,
}) => {
  const [thumbs, setThumbs] = useState<any>([])
  const user = useSelector((state: any) => state.loginUser.value.user)

  useEffect(() => {
    setThumbs([])
  }, [fresh])

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    method: 'POST',
    action: `${config.app_url}/res/api/file/upload`,
    data: { from: 0 },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${getToken()}`,
    },
    beforeUpload: (file) => {
      const isPNG
        = file.type === 'image/png'
        || file.type === 'image/jpg'
        || file.type === 'image/jpeg'

      if (!isPNG)
        message.error(`${file.name}不是图片文件`)

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M)
        message.error('图片大小不超过2M')

      let canUp = true
      if (thumbs.length >= 6) {
        message.error('最多上传6张图片')
        canUp = false
      }
      return (isPNG && isLt2M && canUp) || Upload.LIST_IGNORE
    },
    onChange(info: any) {
      const { name, status, response } = info.file
      if (status === 'done') {
        if (response.status === 0) {
          message.success(`${name}上传成功`)
          const url = response.data.link
          const arr = [...thumbs]
          arr.push(url)
          setThumbs(arr)
          onUpdate(arr)
        }
        else {
          message.error('服务端错误！')
        }
      }
      else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  const del = (index: number) => {
    const arr = [...thumbs]
    arr.splice(index, 1)
    setThumbs(arr)
    onUpdate(arr)
  }

  return (
    <>
      {open && (
        <>
          <Upload {...props} showUploadList={false}>
            <div className={styles['btn-upload-image']}>
              <img src={uploadIcon} />
            </div>
          </Upload>
          {thumbs.length > 0
          && thumbs.map((imgItem: any, index: number) => (
            <div
              key={index}
              className={styles['img-item']}
              onClick={() => del(index)}
            >
              <img src={imgItem} />
            </div>
          ))}
        </>
      )}
    </>
  )
}
