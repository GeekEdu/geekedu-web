import { useEffect, useRef, useState } from 'react'
import { Skeleton, message } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { course as vod } from '../../api/index'
import {
  CourseVideoComments,
  Empty,
  HistoryRecord,
  SnaoShotDialog,
} from '../../components'
import { getPlayId, getToken, savePlayId } from '../../utils/index'
import { VideoListComp } from './components/video/video-list'
import { VideoChapterListComp } from './components/video/video-chapter-list'
import styles from './video.module.scss'

declare const window: any
let timer: any = null
let clock: any = null
function VodPlayPage() {
  const navigate = useNavigate()
  const params = useParams()
  const pathname = useLocation().pathname
  const [loading, setLoading] = useState<boolean>(false)
  const [cid, setCid] = useState(0)
  const [vid, setVid] = useState(Number(params.courseId))
  const [course, setCourse] = useState<any>({})
  const [video, setVideo] = useState<any>({})
  const [videos, setVideos] = useState<any>([])
  const [chapters, setChapters] = useState<any>([])
  const [isWatch, setIsWatch] = useState<boolean>(false)
  const [buyVideos, setBuyVideos] = useState<any>([])
  const [videoWatchedProgress, setVideoWatchedProgres] = useState<any>([])
  const [isLastpage, setIsLastpage] = useState<boolean>(false)
  const [lastVideoId, setLastVideoId] = useState(0)
  const [comments, setComments] = useState<any>([])
  const [commentLoading, setCommentLoading] = useState<boolean>(false)
  const [commentUsers, setCommentUsers] = useState<any>({})
  const [attach, setAttach] = useState<any>([])
  const [showTry, setShowTry] = useState<boolean>(false)
  const [isBuy, setIsBuy] = useState<boolean>(false)
  const [lastSeeValue, setLastSeeValue] = useState<any>(null)
  const [playUrl, setPlayUrl] = useState<string>('')
  const [isIframe, setIsIframe] = useState<boolean>(false)
  const [playendedStatus, setPlayendedStatus] = useState<boolean>(false)
  const [checkPlayerStatus, setCheckPlayerStatus] = useState<boolean>(false)
  const [totalTime, setTotalTime] = useState(10)
  const [playDuration, setPlayDuration] = useState(0)
  const [currentTab, setCurrentTab] = useState(4)
  const [isfixTab, setIsfixTab] = useState<boolean>(false)
  const user = useSelector((state: any) => state.loginUser.value.user)
  const config = useSelector((state: any) => state.systemConfig.value.config)
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)
  const configFunc = useSelector(
    (state: any) => state.systemConfig.value.configFunc,
  )
  const myRef = useRef(0)
  const courseRef: any = useRef(null)
  const tabs = [
    {
      name: '课时评论',
      id: 4,
    },
    {
      name: '课程附件',
      id: 5,
    },
  ]

  useEffect(() => {
    setVid(Number(params.courseId))
    window.player && window.player.destroy()
    myRef.current = 0
  }, [params.courseId])

  useEffect(() => {
    clock && clearInterval(clock)
    timer && clearInterval(timer)
    window.removeEventListener('scroll', handleTabFix, true)
    window.player && window.player.destroy()
  }, [pathname])

  useEffect(() => {
    getDetail()
    getComments()
    window.addEventListener('scroll', handleTabFix, true)
    return () => {
      clock && clearInterval(clock)
      timer && clearInterval(timer)
      window.removeEventListener('scroll', handleTabFix, true)
    }
  }, [vid])

  useEffect(() => {
    courseRef.current = course
  }, [course])

  useEffect(() => {
    if (playendedStatus && !isLastpage)
      countDown()
  }, [playendedStatus])

  useEffect(() => {
    myRef.current = playDuration
  }, [playDuration])

  const handleTabFix = () => {
    const scrollTop
      = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop
    const navbar = document.querySelector('#NavBar') as HTMLElement
    if (navbar) {
      const offsetTop = navbar.offsetTop
      scrollTop > offsetTop ? setIsfixTab(true) : setIsfixTab(false)
    }
  }

  const getDetail = () => {
    if (loading)
      return

    setLoading(true)
    vod.video(vid).then((res: any) => {
      document.title = res.data.course.title
      setPlayendedStatus(false)
      clock && clearInterval(clock)
      setCourse(res.data.course)
      setVideo(res.data.video)
      setVideos(res.data.videos)
      setChapters(res.data.chapters)
      setIsWatch(res.data.isWatch)
      setVideoWatchedProgres(res.data.videoWatchedProgress)
      setBuyVideos(res.data.buy_videos)
      const chapterId = Number.parseInt(res.data.video.chapterId) || 0

      // 视频排序数组
      let videoBox = []
      if (chapterId === 0) {
        videoBox = res.data.videos[chapterId]
      }
      else {
        for (let k = 0; k < res.data.chapters.length; k++) {
          const chap = Number.parseInt(res.data.chapters[k].id)
          if (typeof res.data.videos[chap] !== 'undefined')
            videoBox.push(...res.data.videos[chap])
        }
      }

      // 读取下一个视频
      for (let j = 0; j < videoBox.length; j++) {
        if (res.data.video.id === videoBox[j].id) {
          if (1 + j >= videoBox.length) {
            setIsLastpage(true)
          }
          else {
            setIsLastpage(false)
            setLastVideoId(videoBox[j + 1].id)
          }
        }
      }

      // 播放记录跳转
      let last_see_value = null
      if (
        res.data.videoWatchedProgress
        && res.data.videoWatchedProgress[vid]
        && res.data.videoWatchedProgress[vid].watchSeconds > 0
      ) {
        last_see_value = {
          time: 5,
          pos: res.data.video_watched_progress[vid].watch_seconds,
        }
        setLastSeeValue(last_see_value)
      }
      else {
        last_see_value = {
          time: 5,
          pos: 10,
        }
      }

      // 当前用户已购买 || 可以试看
      if (res.data.isWatch || res.data.video.freeSeconds > 0) {
        getPlayInfo(
          res.data.isWatch,
          res.data.video.freeSeconds,
          res.data.video.banDrag,
          last_see_value,
        )
      }

      // 获取附件
      getAttach(res.data.course.id)

      setLoading(false)
    })
  }

  const getPlayInfo = (
    active: boolean,
    free_seconds: number,
    ban_drag: number,
    last_see_value: any,
  ) => {
    let isTrySee = 0
    if (active === false && free_seconds > 0)
      isTrySee = 1

    vod.playInfo(vid, { isTry: isTrySee }).then((res: any) => {
      // if (res.data.urls.length === 0) {
      if (res.data.url.length === 0) {
        message.error('无播放地址')
        return
      }

      const playUrls = res.data.url
      const firstPlayUrl = playUrls[0].url

      if (firstPlayUrl.substr(1, 6) === 'iframe') {
        setIsIframe(true)
        const playUrl = firstPlayUrl.replace(
          '>',
          ' style="width:100%;height:506px" >',
        )
        setPlayUrl(playUrl)
        return
      }
      setIsIframe(false)
      initDPlayer(playUrls, isTrySee, 0, last_see_value)
    })
  }

  const initDPlayer = (
    playUrls: any,
    isTrySee: number,
    ban_drag: number,
    lastSeeParams: any,
  ) => {
    savePlayId(String(params.courseId))
    const dplayerUrls: any[] = []
    playUrls.forEach((item: any) => {
      dplayerUrls.push({
        name: item.name,
        url: item.url,
      })
    })
    // 初始化播放器
    const bulletSecretFontSize = !config.player.bulletSecret.size
      ? 14
      : config.player.bulletSecret.size
    // window.player = new window.Player({
    //   id: 'meedu-player-container',
    //   url: playUrls[0].url,
    //   autoplay: false, // 自动播放
    //   height: '507px', // 播放器高度
    //   width: '900px', // 播放器宽度
    //   volume: 0.6, //
    //   videoInit: true, // 初始化播放器显示视频首帧
    //   playbackRate: [0.5, 0.75, 1, 1.5, 2], // 播放速度
    //   lastPlayTime: 10, // 视频起播时间（单位：秒）
    //   lastPlayTimeHideDelay: 5, // 提示文字展示时长（单位：秒）
    // })
    window.player = new window.DPlayer({
      container: document.getElementById('meedu-player-container'),
      autoplay: false,
      video: {
        quality: dplayerUrls,
        defaultQuality: 0,
        pic: config.player.cover,
      },
      try: isTrySee === 1,
      bulletSecret: {
        enabled: Number.parseInt(config.player.enabledBulletSecret) === 1,
        text: config.player.bulletSecret.text
          .replace('${user.mobile}', user.mobile)
          .replace('${mobile}', user.mobile)
          .replace('${user.id}', user.id),
        size: `${bulletSecretFontSize}px`,
        color: !config.player.bulletSecret.color
          ? 'red'
          : config.player.bulletSecret.color,
        opacity: config.player.bulletSecret.opacity,
      },
      ban_drag: ban_drag === 1,
      playbackSpeed: ban_drag === 1 ? [1] : [0.5, 0.75, 1, 1.25, 1.5, 2],
      last_see_pos: lastSeeParams,
    })

    // window.player.once('ready', () => { console.log('ready') })
    // 监听播放进度更新evt
    window.player.on('timeupdate', () => {
      playTimeUpdate(Number.parseInt(window.player.video.currentTime), false)
    })
    window.player.on('ended', () => {
      playTimeUpdate(Number.parseInt(window.player.video.currentTime), true)
      setPlayendedStatus(true)
    })
    window.player.on('sub_course', () => {
      paySelect(1)
    })
    window.player.on('play_error', (e: any) => {
      console.log('视频播放错误,错误信息:', e)
    })

    checkPlayer()
  }

  const checkPlayer = () => {
    timer = setInterval(() => {
      const playId = getPlayId()
      if (playId && Number.parseInt(playId) !== Number(params.courseId)) {
        timer && clearInterval(timer)
        window.player && window.player.destroy()
        setCheckPlayerStatus(true)
      }
      else {
        setCheckPlayerStatus(false)
      }
    }, 5000)
  }

  const playTimeUpdate = (duration: number, isEnd: boolean) => {
    if (duration - myRef.current >= 10 || isEnd === true) {
      setPlayDuration(duration)
      vod
        .videoRecord(vid, {
          duration,
        })
        .then((res: any) => {})
    }
  }

  const countDown = () => {
    let totalTime = 10
    clock = setInterval(() => {
      totalTime--
      setTotalTime(totalTime)
      if (totalTime === 0) {
        clock && clearInterval(clock)
        goNextVideo(lastVideoId)
      }
    }, 1000)
  }

  const goPlay = (item: any) => {
    if (!isLogin) {
      goLogin()
      return
    }
    clock && clearInterval(clock)
    setLastSeeValue(null)
    setTotalTime(10)
    navigate(`/courses/video/${item.id}`, { replace: true })
  }

  const goNextVideo = (id: number) => {
    clock && clearInterval(clock)
    setLastSeeValue(null)
    setTotalTime(10)
    navigate(`/courses/video/${id}`, { replace: true })
  }

  const paySelect = (val: number) => {
    if (!isLogin) {
      goLogin()
      return
    }
    if (val === 2) {
      goRole()
      return
    }
    if (val === 1) {
      navigate(
        `/order?goods_id=${
        courseRef.current.id
           }&goods_type=vod&goods_charge=${
           courseRef.current.charge
           }&goods_label=点播课程&goods_name=${
           courseRef.current.title
           }&goods_thumb=${
           courseRef.current.thumb}`,
      )
      return
    }
    if (val === 3) {
      navigate(
        `/order?goods_id=${
        video.id
           }&goods_type=video&goods_charge=${
           video.charge
           }&goods_label=视频&goods_name=${
           video.title
           }&goods_thumb=${
           course.thumb}`,
      )
    }
  }

  const getComments = () => {
    if (commentLoading)
      return

    setCommentLoading(true)
    vod.videoComments(vid).then((res: any) => {
      setComments(res.data.data.data)
      setCommentUsers(res.data.users)
      setCommentLoading(false)
    })
  }

  const resetComments = () => {
    setCommentLoading(false)
    setComments([])
    setCommentUsers({})
  }

  const goLogin = () => {
    const url = encodeURIComponent(
      window.location.pathname + window.location.search,
    )
    navigate(`/login?redirect=${url}`)
  }

  const goRole = () => {
    navigate('/vip')
  }

  const getAttach = (cid: number) => {
    vod.detail(cid).then((res: any) => {
      setAttach(res.data.attach)
      setIsBuy(res.data.isBuy)
      setShowTry(!res.data.isBuy)
    })
  }

  const download = (id: number) => {
    const token = getToken()
    if (!isLogin) {
      goLogin()
      return
    }
    if (!isBuy) {
      message.error('请购买课程后下载')
      return
    }
    window.open(
      `${config.url}/api/v2/course/attach/${id}/download?token=${token}`,
    )
  }

  const tabChange = (id: number) => {
    setCurrentTab(id)
  }

  return (
    <>
      {isfixTab && (
        <div className="fix-nav">
          <div className="course-tabs">
            {tabs.map((item: any) => (
              <div
                key={item.id}
                className={
                  currentTab === item.id ? 'active item-tab' : 'item-tab'
                }
                onClick={() => tabChange(item.id)}
              >
                {item.name}
                {currentTab === item.id && <div className="actline"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="container">
        <div className="bread-nav">
          <a
            onClick={() => {
              navigate('/')
            }}
          >
            首页
          </a>
          {' '}
          /
          <a
            onClick={() => {
              navigate('/courses')
            }}
          >
            录播课
          </a>
          {' '}
          /
          {loading && (
            <Skeleton.Button
              active
              style={{
                width: 400,
                height: 16,
              }}
            >
            </Skeleton.Button>
          )}
          {!loading && (
            <>
              <a
                onClick={() => {
                  navigate(`/courses/detail/${course.id}`)
                }}
              >
                {course.title}
              </a>
              {' '}
              /
              <span>{video.title}</span>
            </>
          )}
        </div>
        <HistoryRecord id={video.id} title={video.title} type="video" />
        <div className={styles['course-info']}>
          <div className={styles['video-box']}>
            <div
              className={styles['play-box']}
              style={{
                backgroundImage: `url(${config.player.cover})`,
                backgroundSize: 'cover',
              }}
            >
              {checkPlayerStatus && (
                <div className={styles['des-video']}>
                  您已打开新视频，暂停本视频播放
                </div>
              )}
              {!playendedStatus && (isWatch || video.freeSeconds > 0) && (
                <>
                  {isIframe && (
                    <div
                      className="iframe-player-box"
                      dangerouslySetInnerHTML={{ __html: playUrl }}
                    >
                    </div>
                  )}
                  {!isIframe && (
                    <div
                      className="meedu-player-container"
                      id="meedu-player-container"
                    >
                      {/* <video id="player-container-id" preload="auto" playsinline webkit-playsinline></video> */}
                    </div>
                  )}
                </>
              )}
              {(playendedStatus || (!isWatch && video.freeSeconds <= 0)) && (
                <>
                  {isLogin && (
                    <div className={styles['alert-message']}>
                      {playendedStatus && (
                        <>
                          {!isWatch && (
                            <div className={styles['subscribe-info']}>
                              试看结束，购买课程观看所有视频
                            </div>
                          )}
                          {isWatch && !isLastpage && (
                            <>
                              <div
                                className={styles['next-page']}
                                onClick={() => goNextVideo(lastVideoId)}
                              >
                                播放下一节课程
                              </div>
                              <div className={styles['last-video']}>
                                {totalTime}
                                秒后开始自动播放下一节
                              </div>
                            </>
                          )}
                          {isWatch && isLastpage && (
                            <div className={styles['last-video']}>
                              恭喜你学完最后一节
                            </div>
                          )}
                        </>
                      )}
                      {course.charge > 0 && isWatch === false && (
                        <div
                          className={styles['subscribe-button']}
                          onClick={() => paySelect(1)}
                        >
                          <span>
                            订阅课程 ￥
                            {course.charge}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {!isLogin && (
                    <div className={styles['alert-message']}>登录后观看</div>
                  )}
                </>
              )}
            </div>
            <div className="course-chapter-box">
              {loading
              && Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 260,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Skeleton.Button
                    active
                    style={{
                      width: 260,
                      height: 16,
                      marginBottom: 30,
                    }}
                  >
                  </Skeleton.Button>
                  <Skeleton.Button
                    active
                    style={{
                      width: 260,
                      height: 20,
                      marginBottom: 50,
                    }}
                  >
                  </Skeleton.Button>
                </div>
              ))}
              {!loading && chapters.length > 0 && (
                <VideoChapterListComp
                  chapters={chapters}
                  course={course}
                  video={video}
                  videos={videos}
                  isBuy={isBuy}
                  buyVideos={buyVideos}
                  switchVideo={(item: any) => goPlay(item)}
                />
              )}
              {!loading && chapters.length === 0 && videos[0] && (
                <VideoListComp
                  course={course}
                  video={video}
                  videos={videos[0]}
                  isBuy={isBuy}
                  buyVideos={buyVideos}
                  switchVideo={(item: any) => goPlay(item)}
                />
              )}
            </div>
          </div>
          <div className="course-tabs" id="NavBar">
            {tabs.map((item: any) => (
              <div
                key={item.id}
                className={
                  currentTab === item.id ? 'active item-tab' : 'item-tab'
                }
                onClick={() => tabChange(item.id)}
              >
                {item.name}
                {currentTab === item.id && <div className="actline"></div>}
              </div>
            ))}
          </div>
        </div>
        {currentTab === 4 && (
          <CourseVideoComments
            fresh={loading}
            vid={vid}
            isBuy={isBuy}
            comments={comments}
            commentUsers={commentUsers}
            success={() => {
              resetComments()
              getComments()
            }}
          />
        )}
        {currentTab === 5 && (
          <div className={styles['attach-list-box']}>
            {attach.length === 0 && <Empty></Empty>}
            {attach.length > 0
            && attach.map((item: any) => (
              <div className={styles['attach-item']} key={item.id}>
                <div className={styles['attach-name']}>{item.name}</div>
                <a
                  onClick={() => download(item.id)}
                  className={styles['download-attach']}
                >
                  下载附件
                </a>
              </div>
            ))}
          </div>
        )}
        {configFunc.snapshort && isWatch && (
          <SnaoShotDialog id={vid} duration={playDuration} resourceType="vod" />
        )}
      </div>
    </>
  )
}

export default VodPlayPage
