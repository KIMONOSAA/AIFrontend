import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Layout, List, Tag } from 'antd';
import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { courseOpenController, courseLearnRecordController } from '@/services/course/index';
import './style.scss';

const { Content, Sider } = Layout;
const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [teachplans, setTeachplans] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [courseInfo, setCourseInfo] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await courseOpenController.getPreviewInfo({
          courseId: Number(courseId),
          courseLearnRecordDto: { courseRecordId: 0 }
        });
        // console.log('999',response);

        setCourseInfo(response.data.courseBase);
        setTeachplans(response.data.teachplans.map(plan => ({
          ...plan,
          teachplanMedia: plan.teachplanMedia || {}
        })));
      } catch (error) {
        console.error('获取课程详情时发生错误:', error);
      }
    };
    fetchCourseDetail();
  }, [courseId]);

  // const handleVideoChange = (mediaId: string) => {
  //   const newUrl = `http://localhost:63090/media/show?fileMd5=${mediaId}`;
  //   setVideoUrl(newUrl);
  // };
  const [videoDuration, setVideoDuration] = useState<number | null>(null); // 保存视频时长

  const handleVideoChange = (mediaId: string, teachPlan: { id: number; pname: string; description: string; label: string }) => {
    // 更新当前教学计划信息
    setCurrentTeachPlan(teachPlan);
    // videoRef.current.pause(); // 暂停当前视频
    // const currentTimeNow = videoRef.current.currentTime;
    // if (currentTime !== null) {
    //   threeHandleUpdateCourse(teachPlan.id, teachPlan.pname, teachPlan.description, teachPlan.label); // 更新学习记录
    // }http://192.168.101.132:9090/browser/video/3%2F4%2F342602e471862fd9a4301d6239372e27%2F342602e471862fd9a4301d6239372e27.mp4

    // const newUrl = "http://192.168.101.132:9090/browser/3%2F4%2F342602e471862fd9a4301d6239372e27%2F342602e471862fd9a4301d6239372e27.mp4"
    const newUrl = `http://localhost:63090/media/show?fileMd5=${mediaId}`;
    // const newUrl = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";
    setVideoUrl(newUrl);
  };

  const handleCourseClick = (teacherId: string, subjects: string, courseId: string) => {
    navigate(`/practice/${teacherId}`, { state: { subjects, courseId } });
  };


  //更新学习记录
  // 保存当前视频的教学计划信息
  const [currentTeachPlan, setCurrentTeachPlan] = useState<{ id: number; pname: string; description: string; label: string } | null>(null);
  const threeHandleUpdateCourse = async (id: number, pname: string, description: string, label: string, currentTimeNow: number
  ) => {
    const body = {
      courseName: courseInfo.tags,
      courseTeachPlanRecord: {
        pname: pname,
        totalTime: videoDuration ? videoDuration.toString() : '', // 当前观看视频的总时长
        description: description,
        id: Number(id),
        label: `[${JSON.parse(label).join(',')}]`,
        timelength: currentTimeNow,
      },
      courseId: Number(courseId)
    };
    try {
      const response = await courseLearnRecordController.updateCourseRecord(body);
      console.log('currentTime现在传的', currentTimeNow);
      // 处理成功逻辑
      console.log('body:', body);
      console.log('更新成功:', response);
    } catch (error) {
      // 处理错误逻辑
      console.error("更新课程记录失败:", error);
    }
  };
  const [isExpanded, setIsExpanded] = useState(false); // 控制详情展开状态

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  //播放器
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  let wasPaused: boolean
  const [volume, setVolume] = useState(1);
  const [isScrubbing, setIsScrubbing] = useState(false)
  const timeUpdate = useRef<HTMLDivElement | null>(null)
  const speedBtn = useRef<HTMLButtonElement | null>(null)
  const videoContainer = useRef<HTMLDivElement | null>(null)
  const loadDate = useRef<HTMLDivElement | null>(null)
  const timelinecontainer = useRef<HTMLDivElement | null>(null)

  //音量高低
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setVolume(newValue);
    if (event.target.value) {
      if (videoRef.current) {
        videoRef.current.volume = parseFloat(event.target.value);
      }
    }
  };

  //暂停播放
  const toggleAndPlayAnePaues: React.MouseEventHandler<HTMLButtonElement | HTMLVideoElement> = (event) => {
    event.stopPropagation();
    if (videoRef.current) {
      setIsPaused((prev: any) => {
        if (prev) {
          videoRef.current?.pause();
        } else {
          videoRef.current?.play();
        }
        return !prev;
      });
    }
  };
  //总时长时间
  const handleChangeUpdate = () => {
    if (timeUpdate.current) {
      if (timeUpdate.current.textContent !== null && videoRef.current) {
        const current: number = videoRef.current.duration
        if (current !== undefined) {
          if (timeUpdate.current.textContent !== undefined) {
            timeUpdate.current.textContent = updateTime(
              current
            );
          }
        }
      }
    }
  };
  //时间对应的图片显示
  const handleVolumeChange = () => {
    if (videoRef.current && videoContainer.current) {
      setVolume(videoRef.current.volume)
      let volumeLevel;
      if (videoRef.current.muted || videoRef.current.volume === 0) {
        setVolume(0)
        volumeLevel = "muted"
      } else if (videoRef.current.volume >= 0.5) {
        volumeLevel = "high"
      } else {
        volumeLevel = "low"
      }

      videoContainer.current.dataset.volumeLevel = volumeLevel
    }
  }

  //更新时间秒数
  const TimeMinuteSecond = () => {
    if (loadDate.current && videoRef.current && timelinecontainer.current) {
      loadDate.current.textContent = updateTime(videoRef.current.currentTime)
      const percent = videoRef.current.currentTime / videoRef.current.duration
      timelinecontainer.current.style.setProperty("--progress-position", percent.toString())
    }
  };

  const updateTime = (time: number): string | null => {
    if (videoRef.current) {
      const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
      });

      const hour = Math.floor(time / 3600);
      const minute = Math.floor((time / 60) % 60);
      const second = Math.floor(time % 60);

      if (hour === 0) {
        return `${leadingZeroFormatter.format(minute)}:${leadingZeroFormatter.format(second)}`;
      } else {
        return `${leadingZeroFormatter.format(hour)}:${leadingZeroFormatter.format(minute)}:${leadingZeroFormatter.format(second)}`;
      }
    }

    return null;
  };
  // //888
  // //时间线(e.buttons & 1)右键点击就是1所以e.buttons是看看你有没有点击有点击才会更新没点击而是移动的话就只会灰色的进度条跟你移动
  // const handleMouseDown = (e) => {

  //   if (timelinecontainer.current && videoRef.current) {
  //     const rect = timelinecontainer.current.getBoundingClientRect()

  //     const percent = Math.min(Math.max(0, e.nativeEvent.x - rect.x), rect.width) / rect.width

  //     setIsScrubbing((e.buttons & 1) === 1)
  //     if (isScrubbing) {
  //       wasPaused = videoRef.current.paused
  //     } else {
  //       videoRef.current.currentTime = percent * videoRef.current.duration
  //     }

  //   }

  //   handleMouseMove(e)
  // }

  // //e.x就是当前鼠标x轴的像素，但是请记住整个页面的x最左边到鼠标，所以我们还要有DomRect这个也就是getBoundingClientRect()里面的x就是他与页面的相差距离他的width也就是整个元素的宽度
  // const handleMouseMove = (e) => {
  //   if (timelinecontainer.current && videoRef.current) {
  //     const timelineRect = timelinecontainer.current.getBoundingClientRect();
  //     const position = Math.min(Math.max(1, e.nativeEvent.x - timelineRect.x), timelineRect.width) / timelineRect.width;
  //     timelinecontainer.current.style.setProperty('--preview-position', position);
  //     if (isScrubbing) {
  //       e.preventDefault();
  //       timelinecontainer.current.style.setProperty('--progress-position', position);
  //     }
  //   }
  // };
  // //点击后松开一定要写这个方法要把setIsScrubbing((e.buttons & 1) === 1)变成false
  // const handleMouseUp = () => {
  //   setIsScrubbing(false);
  // };
  // //888

  //时间线(e.buttons & 1)右键点击就是1所以e.buttons是看看你有没有点击有点击才会更新没点击而是移动的话就只会灰色的进度条跟你移动
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('handleMouseDown', e);

    if (timelinecontainer.current && videoRef.current) {
      const rect = timelinecontainer.current.getBoundingClientRect()
      const percent = Math.min(Math.max(0, e.nativeEvent.x - rect.x), rect.width) / rect.width
      setIsScrubbing((e.buttons & 1) === 1)
      // if(videoContainer.current){
      //   videoContainer.current.classList.toggle("scrubbing", isScrubbing)
      // }
      if (isScrubbing) {
        wasPaused = videoRef.current.paused
        // videoRef.current.pause()
      } else {
        videoRef.current.currentTime = percent * videoRef.current.duration
        // if (!wasPaused) videoRef.current.play()
      }
    }
    // handleMouseMove(e)
  }
  //e.x就是当前鼠标x轴的像素，但是请记住整个页面的x最左边到鼠标，所以我们还要有DomRect这个也就是getBoundingClientRect()里面的x就是他与页面的相差距离他的width也就是整个元素的宽度
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('handleMouseMove', e);
    if (timelinecontainer.current && videoRef.current) {
      const timelineRect = timelinecontainer.current.getBoundingClientRect();
      const numberWidth = (Math.min(Math.max(1, e.nativeEvent.x - timelineRect.x), timelineRect.width) / timelineRect.width).toString();
      timelinecontainer.current.style.setProperty('--preview-position', numberWidth)
      if (isScrubbing) {
        e.preventDefault()
        timelinecontainer.current.style.setProperty('--progress-position', numberWidth)
      }

    }
  }
  //点击后松开一定要写这个方法要把setIsScrubbing((e.buttons & 1) === 1)变成false
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // console.log('handleMouseUp', e);
    if (isScrubbing) {
      setIsScrubbing(false);
      // handleMouseDown(e); // 调用handleMouseDown可能导致重复操作，检查逻辑
    }
  };

  //倍速
  const changePlaybackSpeed = () => {
    let newPlaybackRate = videoRef.current ? videoRef.current.playbackRate + 0.25 : 1;
    if (newPlaybackRate > 2) newPlaybackRate = 0.25;
    if (videoRef.current) {
      videoRef.current.playbackRate = newPlaybackRate;
    }
    if (speedBtn.current) {
      speedBtn.current.textContent = `${newPlaybackRate}倍`;
    }

  }
  //下面就是剧场模式，全屏，画中画
  const toggleTheaterMode = () => {
    if (videoContainer.current)
      videoContainer.current.classList.toggle("theater")
  }

  const toggleFullScreenMode = () => {
    if (document.fullscreenElement == null && videoContainer.current) {
      videoContainer.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const toggleMiniPlayerMode = () => {
    if (videoContainer.current && videoRef.current) {
      if (videoContainer.current.classList.contains("mini-player")) {
        document.exitPictureInPicture()
      } else {
        videoRef.current.requestPictureInPicture()
      }
    }
  }
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;


      const handleEnterPiP = () => {
        if (videoContainer.current) {
          videoContainer.current.classList.add("mini-player");
        }
      };

      const handleLeavePiP = () => {
        if (videoContainer.current) {
          videoContainer.current.classList.remove("mini-player");
        }
      };


      video.addEventListener('enterpictureinpicture', handleEnterPiP);
      video.addEventListener('leavepictureinpicture', handleLeavePiP);


      return () => {
        video.removeEventListener('enterpictureinpicture', handleEnterPiP);
        video.removeEventListener('leavepictureinpicture', handleLeavePiP);
      };
    }
  }, []);
  return (
    <Layout style={{ overflow: 'hidden', width: '100%' }}>
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '-60px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{courseInfo.name || '无'}</span>
          </div>
          <div className='video-all'>
            <div className='left'>
              <div ref={videoContainer} className={`video-container ${isPaused ? 'play' : 'paused'}`} data-volume-level="high">
                <img className="thumbnail-img"></img>
                <div className='video-controls-container'>
                  <div className="timeline-container" onMouseUp={handleMouseUp} ref={timelinecontainer} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} >
                    <div className="timeline" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                      <img className="preview-img" />
                      <div className="thumb-indicator"></div>
                    </div>
                  </div>
                  <div className='controls'>
                    <button className="play-pause-btn" onClick={toggleAndPlayAnePaues}>
                      <svg className="play-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                      </svg>

                      <svg className="pause-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                      </svg>
                    </button>
                    <div className="volume-container">
                      <button className="mute-btn">
                        <svg className="volume-high-icon" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                        </svg>
                        <svg className="volume-low-icon" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                        </svg>
                        <svg className="volume-muted-icon" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                        </svg>

                      </button>
                      {/* <input className="volume-slider" type="range" min="0" max="1" step="any" value="1" /> */}
                      <input
                        className="volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="any"
                        value={volume}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="duration-container">
                      <div ref={loadDate} className="current-time" >00:00</div>
                      /
                      <div ref={timeUpdate} className="total-time"></div>
                    </div>
                    {/* 字幕后面再做 */
                  /* <button className="captions-btn">
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z" />
                    </svg>
                  </button> */}
                    <button ref={speedBtn} onClick={changePlaybackSpeed} className="speed-btn wide-btn">
                      1.0倍
                    </button>
                    <button className="mini-player-btn" onClick={toggleMiniPlayerMode}>
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" />
                      </svg>
                    </button>
                    <button className="theater-btn" onClick={toggleTheaterMode}>
                      <svg className="tall" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
                      </svg>
                      <svg className="wide" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z" />
                      </svg>
                    </button>
                    <button className="full-screen-btn" onClick={toggleFullScreenMode}>
                      <svg className="open" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                      <svg className="close" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {videoUrl &&
                  <video
                    ref={videoRef}
                    key={videoUrl}
                    // src={videoUrl}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setVideoDuration(videoRef.current.duration);
                        console.log('视频时长:', videoRef.current.duration);
                      }
                    }}
                    // onTimeUpdate
                    onPause={() => {
                      if (videoRef.current) {
                        const currentTimeNow = videoRef.current.currentTime; // 直接获取当前播放时间
                        console.log('新:', currentTimeNow); // 记录最新的暂停时间
                        if (currentTeachPlan) {
                          threeHandleUpdateCourse(currentTeachPlan.id, currentTeachPlan.pname, currentTeachPlan.description, currentTeachPlan.label, currentTimeNow);
                          console.log('视频播放暂停')
                        }
                      }
                    }}
                    onEnded={() => {
                      if (videoRef.current) {
                        // setCurrentTime(videoRef.current.currentTime);
                        const currentTimeNow = videoRef.current.currentTime; // 直接获取当前播放时间
                        if (currentTeachPlan) {
                          threeHandleUpdateCourse(currentTeachPlan.id, currentTeachPlan.pname, currentTeachPlan.description, currentTeachPlan.label, currentTimeNow);
                          console.log('视频播放结束');
                        }
                      }
                    }}
                    onVolumeChange={handleVolumeChange}
                    onTimeUpdate={TimeMinuteSecond}
                    onLoadedData={handleChangeUpdate}
                    onClick={toggleAndPlayAnePaues}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                }

              </div>
              {/* <video controls style={{width:600 , height: 500}}>
          <source src={videoDataAndVideoInfo.data} type="video/mp4" /> 
      </video> */}


              {/* {(dataId && item) && <VideoComments videoId={dataId} item={item} />} */}
            </div>

            {/* <div className='right'>
                <RecommendedVideos videoDataAndVideoInfo={videoDataAndVideoInfo} />
              </div> */}
          </div>
          {/* <div style={{ position: 'relative', width: '100%', 
            paddingTop: '1%' 
            // paddingTop: '56.25%' 
          }}> */}
          {/* <video
              ref={videoRef}

              key={videoUrl}
              src={videoUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setVideoDuration(videoRef.current.duration);
                  console.log('视频时长:', videoRef.current.duration);
                }
              }}
              // onTimeUpdate
              onPause={() => {
                if (videoRef.current) {
                  const currentTimeNow = videoRef.current.currentTime; // 直接获取当前播放时间
                  console.log('新:', currentTimeNow); // 记录最新的暂停时间
                  if (currentTeachPlan) {
                    threeHandleUpdateCourse(currentTeachPlan.id, currentTeachPlan.pname, currentTeachPlan.description, currentTeachPlan.label, currentTimeNow);
                    console.log('视频播放暂停')
                  }
                }
              }}
              onEnded={() => {
                if (videoRef.current) {
                  // setCurrentTime(videoRef.current.currentTime);
                  const currentTimeNow = videoRef.current.currentTime; // 直接获取当前播放时间
                  if (currentTeachPlan) {
                    threeHandleUpdateCourse(currentTeachPlan.id, currentTeachPlan.pname, currentTeachPlan.description, currentTeachPlan.label, currentTimeNow);
                    console.log('视频播放结束');
                  }
                }
              }}
              controls
            >
              <source src={videoUrl} type='video/mp4' />
            </video> */}

          {/* </div> */}
          <div style={{ marginTop: '20px', gap: '10px', flexWrap: 'wrap' }}>
            {courseInfo && (
              <>
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #e8e8e8', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                    <Tag icon={<EyeOutlined />} color="blue">浏览量：{courseInfo.browses || '无'}</Tag>
                    <Tag color="blue">课程标签：{courseInfo.tags || '无'}</Tag>
                    <Tag color="blue">年级：{courseInfo.grade || '无'}</Tag>
                    <Tag color="blue">有效天数：{courseInfo.validDays || '无'}</Tag>
                  </div>
                  <div style={{ maxHeight: isExpanded ? 'none' : '30px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                    <p style={{ margin: '8px 0', lineHeight: '1.5', color: '#666' }}>
                      {courseInfo.description || '无'}
                    </p>
                  </div>
                  <Button type="link" onClick={toggleExpand} style={{ padding: 0, marginTop: '8px', color: '#1890ff' }}>
                    {isExpanded ? '收起' : '展开更多'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Content>
      <Sider width={300} style={{ background: '#fff' }}>
        <div style={{ padding: '20px' }}>
          <Button type="primary" style={{ marginBottom: '20px', width: '100%', backgroundColor: '#1677ff' }}>
            教学计划集合
          </Button>
          <List
            itemLayout="horizontal"
            dataSource={teachplans}
            style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<PlayCircleOutlined style={{ color: '#1677ff', fontSize: '20px' }} />}
                  title={<a
                    style={{ color: '#000', fontWeight: 'normal' }}
                    onClick={() => {
                      handleVideoChange(item.teachplanMedia.mediaId, {
                        id: item.id,
                        pname: item.pname,
                        description: item.description,
                        label: item.label,
                      });

                      // threeHandleUpdateCourse(item.id, item.pname, item.description, item.label);
                      // handleChange({
                      //   id: item.id,
                      //   pname: item.pname,
                      //   description: item.description,
                      //   label: item.label,
                      // });
                    }}
                  >{item.pname}</a>}
                  description={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>

                      <Button
                        onClick={() => handleCourseClick(item.id, courseInfo.tags, item.courseId)}
                        style={{
                          borderColor: '#1677ff',
                          color: '#1677ff',
                          backgroundColor: 'transparent',
                          fontSize: '12px'
                        }}
                      >
                        进入练习
                      </Button>
                    </div>

                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>
      {/* <Sider width={300} style={{ background: '#f7f9fc' }}>
        <div style={{ padding: '20px' }}>
          <Button type="primary" style={{ marginBottom: '20px', width: '100%', backgroundColor: '#1677ff' }}>
            教学计划集合
          </Button>
          <List
            itemLayout="horizontal"
            dataSource={teachplans}
            style={{
              height: 'calc(100vh - 200px)',
              overflowY: 'auto',
              '& .ant-list-item': { padding: '8px 0' },
              '& .ant-list-item:hover': { backgroundColor: '#e6f4ff' }
            }}
            renderItem={(item) => (
              <List.Item style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  avatar={<PlayCircleOutlined style={{ color: '#1677ff', fontSize: '20px' }} />}
                  title={
                    <a
                      onClick={() => handleVideoChange(item.id, {
                        id: item.id,
                        pname: item.pname,
                        description: item.pname,
                        label: item.pname,
                      })}
                      style={{ color: '#000', fontWeight: 'normal' }}
                    >
                      {item.pname}
                    </a>
                  }
                  description={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <Button
                        onClick={() => handleCourseClick(item.id, [], item.id)}
                        size="small"
                        style={{
                          borderColor: '#1677ff',
                          color: '#1677ff',
                          backgroundColor: 'transparent',
                          fontSize: '12px'
                        }}
                      >
                        进入练习
                      </Button>
                      <span style={{ color: '#8c8c8c', fontSize: '12px' }}>{item.duration}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Sider> */}
    </Layout>
  );
};
export default CourseDetail;