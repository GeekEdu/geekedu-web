/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 20:00:36
 * @FilePath: /geekedu-web/src/pages/index/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Carousel, Row, Skeleton } from 'antd'
import { home, sign, viewBlock } from '../../api/index'
import { SignComp } from '../../components'
import styles from './index.module.scss'
import { VodComp } from './components/vod-v1'
import { LiveComp } from './components/live-v1'
import { BookComp } from './components/book-v1'
import { TopicComp } from './components/topic-v1'
import { LearnPathComp } from './components/learnpath-v1'
import { MiaoShaComp } from './components/ms-v1'
import { TuangouComp } from './components/tg-v1'

function IndexPage() {
  document.title = '首页'
  const navigate = useNavigate()
  const [signStatus, setSignStatus] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [blocksLoading, setBlocksLoading] = useState<boolean>(false)
  const [sliders, setSliders] = useState<any>([])
  const [blocks, setBlocks] = useState<any>([])
  const [notice, setNotice] = useState<any>({})
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)
  const configFunc = useSelector(
    (state: any) => state.systemConfig.value.configFunc,
  )

  useEffect(() => {
    if (isLogin)
      getSignStatus()

    getSliders()
    getPageBlocks()
    getNotice()
  }, [isLogin])

  const getSignStatus = () => {
    if (!configFunc.daySignIn)
      return

    sign.user().then((res: any) => {
      const is_submit = res.data
      if (!is_submit)
        setSignStatus(true)
      else
        setSignStatus(false)
    })
  }

  const getSliders = () => {
    if (loading)
      return

    setLoading(true)
    viewBlock.sliders({ platform: 'PC' }).then((res: any) => {
      setSliders(res.data)
      setLoading(false)
    })
  }

  const getPageBlocks = () => {
    if (blocksLoading)
      return

    setBlocksLoading(true)
    viewBlock
      .pageBlocks()
      .then((res: any) => {
        setBlocks(res.data)
        setBlocksLoading(false)
      })
  }

  const getNotice = () => {
    home.announcement().then((res: any) => {
      setNotice(res.data)
    })
  }

  const sliderClcik = (url: string) => {
    if (url.match('https:') || url.match('http:') || url.match('www'))
      window.location.href = url
    else
      navigate(url)
  }

  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
    textAlign: 'center',
    borderRadius: '16px 16px 0 0',
    cursor: 'pointer',
    border: 'none',
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <SignComp
        open={signStatus}
        success={() => setSignStatus(false)}
      >
      </SignComp>
      {loading && (
        <Row>
          <Skeleton.Button
            active
            style={{
              width: 1200,
              height: 400,
              borderRadius: '16px 16px 0 0',
            }}
          >
          </Skeleton.Button>
          <Skeleton active paragraph={{ rows: 0 }}></Skeleton>
          <div style={{ width: 1200, textAlign: 'center' }}>
            <Skeleton.Button
              active
              style={{ height: 30, width: 120, marginTop: 75 }}
            >
            </Skeleton.Button>
          </div>
          <div
            style={{
              width: 1200,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: 50,
            }}
          >
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 30,
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 30,
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 30,
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
            <div
              style={{
                width: 264,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 30,
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 264,
                  height: 198,
                  borderRadius: '8px 8px 0 0',
                }}
              >
              </Skeleton.Button>
              <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
            </div>
          </div>
        </Row>
      )}
      {!loading && sliders.length > 0 && (
        <Carousel autoplay>
          {sliders.map((item: any) => (
            <div
              key={item.sort}
              onClick={() => sliderClcik(item.url)}
              style={{ border: 'none', outline: 'none' }}
            >
              <img src={item.thumb} style={contentStyle} />
            </div>
          ))}
        </Carousel>
      )}
      {!loading && notice && (
        <a
          onClick={() => navigate(`/announcement?id=${notice.id}`)}
          className={styles.announcement}
        >
          公告：
          {notice.title}
        </a>
      )}
      {!blocksLoading
      && blocks.length > 0
      && blocks.map((item: any) => (
        <div className={styles.box} key={item.id}>
          {item.sign === 'pc-vod-v1' && (
            <VodComp
              name={item.items.title}
              items={item.items.items}
            >
            </VodComp>
          )}
          {item.sign === 'pc-live-v1' && (
            <LiveComp
              name={item.items.title}
              items={item.items.items}
            >
            </LiveComp>
          )}
          {item.sign === 'pc-book-v1' && (
            <BookComp
              name={item.items.title}
              items={item.items.items}
            >
            </BookComp>
          )}
          {item.sign === 'pc-topic-v1' && (
            <TopicComp
              name={item.items.title}
              items={item.items.items}
            >
            </TopicComp>
          )}
          {item.sign === 'pc-learnpath-v1' && (
            <LearnPathComp
              name={item.items.title}
              items={item.items.items}
            >
            </LearnPathComp>
          )}
          {item.sign === 'pc-ms-v1' && (
            <MiaoShaComp
              name={item.items.title}
              items={item.items.items}
            >
            </MiaoShaComp>
          )}
          {item.sign === 'pc-tg-v1' && (
            <TuangouComp
              name={item.items.title}
              items={item.items.items}
            >
            </TuangouComp>
          )}
        </div>
      ))}
    </div>
  )
}

export default IndexPage
