import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, message as Message } from 'antd'
import { wsGeekedu, live } from '../../api/index'
import { getToken } from '../../utils/index'
import styles from './index.module.scss'

interface PropInterface {
  chat: any
  enabledChat: boolean
  enabledMessage: boolean
  cid: number
  vid: number
  disabled: boolean
  change: (userDisabled: boolean, messageDisabled: boolean) => void
  sign: (params: any) => void
  endSign: () => void
}

declare const window: any
let ws: any = null
const ChatBox: React.ForwardRefRenderFunction<any, PropInterface> = ({
  chat,
  enabledChat,
  enabledMessage,
  cid,
  vid,
  disabled,
  change,
  sign,
  endSign,
}, ref) => {
  const [chatChannel, setChatChannel] = useState<string>('')
  const [connect_url, setConnectUrl] = useState<string>('')
  const [chatUser, setChatUser] = useState<any>({})
  const [enabledScrollBottom, setEnabledScrollBottom]
    = useState<boolean>(false)
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [over, setOver] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(100)
  const [total, setTotal] = useState(0)
  const [newId, setNewId] = useState(null)
  const [chatRecords, setChatRecords] = useState<any>([])
  const [userDisabled, setUserDisabled] = useState<boolean>(false)
  const [messageDisabled, setMessageDisabled] = useState<boolean>(false)
  const user = useSelector((state: any) => state.loginUser.value.user)

  useEffect(() => {
    if (chat && typeof chat !== 'undefined') {
      setChatChannel(chat.channel)
      setChatUser(chat.user)
      setConnectUrl(chat.connect_url)
      if (enabledChat && cid && vid)
        init(chat.connect_url, String(cid), String(vid))
    }
    setEnabledScrollBottom(true)
    getChatRecords()
  }, [chat, cid, vid, enabledChat])

  useEffect(() => {
    if (enabledScrollBottom)
      chatBoxScrollBottom()
  }, [chatRecords])

  useEffect(() => {
    if (disabled)
      setUserDisabled(true)
    else
      setUserDisabled(false)

    if (enabledMessage)
      setMessageDisabled(true)
    else
      setMessageDisabled(false)
  }, [disabled, enabledMessage])

  const getMoreChatRecords = () => {
    setEnabledScrollBottom(false)
    let num = page
    num++
    setPage(num)
    getChatRecords()
  }

   // 使用useImperativeHandle暴露给父组件的方法
   useImperativeHandle(ref, () => ({
    sendMessage,
  }))

  const init = (connectUrl: string, cid: string, vid: string) => {
    let url = connectUrl
    url = url.replace(':courseId', cid)
    url = url.replace(':videoId', vid)
    url = url.replace(':token', getToken())
    console.log(url)
    if ('WebSocket' in window) {
      ws = new WebSocket(url)
      ws.onopen = () => {
        chanEvt('connect-success')
      }
      ws.onclose = (evt: any) => {
        chanEvt('losed')
      }
      ws.onmessage = (evt: any) => {
        setEnabledScrollBottom(true)
        const message = JSON.parse(evt.data)
        if (message.t === 'message') {
          // const msgV = JSON.parse(message.v)
          const msgV = message.v
          const arr = chatRecords
          arr.push({
            msg_body: msgV,
            user: message.u,
          })
          setChatRecords([...arr])
        }
        else if (message.t === 'connect') {
          const arr = chatRecords
          arr.push({
            local: 1,
            msg_body: {
              chat_id: 0,
            },
            content: `${message.u.nickname}已加入`,
          })
          setChatRecords([...arr])
        }
        else if (message.t === 'sign-in-created') {
          sign(message.params)
        }
        else if (message.t === 'sign-in-closed') {
          endSign()
        }
        else if (message.t === 'room-ban') {
          setMessageDisabled(true)
          change(userDisabled, true)
        }
        else if (
          message.t === 'room-user-ban'
          && message.params[0] === user.id
        ) {
          setUserDisabled(true)
          change(true, messageDisabled)
        }
        else if (message.t === 'room-un-ban') {
          setMessageDisabled(false)
          change(userDisabled, false)
        }
        else if (
          message.t === 'room-user-un-ban'
          && message.params[0] === user.id
        ) {
          setUserDisabled(false)
          change(false, messageDisabled)
        }
        else if (message.t === 'room-over') {
          Message.success('当前直播已结束')
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        }
        else if (message.t === 'message-deleted') {
          const delID = message.params.ids[0]
          const arr = chatRecords
          const index = arr.findIndex((ele: any) => {
            return ele.msg_body.chat_id === delID
          })
          if (index) {
            arr.splice(index, 1)
            setChatRecords([...arr])
          }
        }
      }
      ws.onerror = (evt: any) => {
        chanEvt('enter_fail')
      }
    }
    else {
      Message.error('您的浏览器不支持 WebSocket!')
    }
  }

  const chanEvt = (e: any) => {
    setEnabledScrollBottom(true)
    const mesMap: any = {
      'connect-success': '已加入聊天室',
      'enter_fail': '无法加入聊天室',
      'offline': '已断开连接',
      'losed': '已断开连接',
      'reconnect': '已重新连接',
      'connectold': '异地登录',
      'connect-repeat': '异地登录',
      'connect-lose': '已断开链接',
    }

    const arr = chatRecords
    arr.push({
      local: 1,
      msg_body: {
        chat_id: 0,
      },
      content: mesMap[e],
    })
    setChatRecords([...arr])
  }

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }

  const getChatRecords = () => {
    if (pageLoading || over)
      return

    setPageLoading(true)
    live
      .chatMsgPaginate(cid, vid, {
        pageNum: page,
        pageSize: size,
      })
      .then((res: any) => {
        setTotal(res.data.total)
        if (res.data.data[0])
          setNewId(res.data.data[0].id)

        const chatData = res.data.data.reverse()
        const arr = chatRecords
        arr.unshift(...chatData)
        setChatRecords([...arr])
        if (size !== res.data.data.length)
          setOver(true)
        else
          setOver(false)

        setPageLoading(false)
        if (page > 1)
          moveScroll()
      })
  }

  const moveScroll = () => {
    setTimeout(() => {
      const box = document.getElementById('chatBox') as HTMLElement
      const itemBox = document.getElementById(String(newId)) as HTMLElement
      box.scrollTop = itemBox.offsetTop
    }, 150)
  }

  const chatBoxScrollBottom = () => {
    setTimeout(() => {
      const box = document.getElementById('chatBox') as HTMLElement
      box.scrollTop = box.scrollHeight
    }, 150)
  }

  return (
    <div className={styles['chat-all-box']}>
      {(messageDisabled || userDisabled) && (
        <div className={styles['tip-box']}>
          {messageDisabled && <div className={styles.tip}>全员已禁言</div>}
          {!messageDisabled && userDisabled && (
            <div className={styles.tip}>您已被禁言</div>
          )}
        </div>
      )}
      <div className="chat-box" id="chatBox">
        {chatRecords.length > 0 && !over && total !== 0 && (
          <div className="bullet-chat active">
            <div className="addmore" onClick={() => getMoreChatRecords()}>
              加载更多
            </div>
          </div>
        )}
        {chatRecords.map((item: any, index: number) => (
          <div
            key={index + (item.msg_body.content || item.content)}
            id={item.id}
            className="bullet-chat"
          >
            {item.local && (
              <div className="alert-message">
                <span className="text-block">{item.content}</span>
              </div>
            )}
            {!item.local && (
              <>
                <div
                  // className={
                  //   item.msg_body.role === 'teacher'
                  //   || item.msg_body.role === 'assistant'
                  //     ? 'teacher nickname'
                  //     : 'nickname'
                  // }
                  className='nickname'
                >
                  {item.user.nick_name}
                </div>
                <div className="message-content">
                  <div className="chat-content">{item.msg_body.content}</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default forwardRef(ChatBox)
