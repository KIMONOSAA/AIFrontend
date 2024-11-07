 //88888
 const [videoUrl, setVideoUrl] = useState('https://media.w3.org/2010/05/sintel/trailer_hd.mp4')
 const [isPaused, setIsPauesd] = useState(false);
 const videoRef = useRef(null)
 let wasPaused
 const [volume, setVolume] = useState(1);
 const [isScrubbing, setIsScrubbing] = useState(false)
 const timeUpdate = useRef(null)
 const speedBtn = useRef(null)
 const videoContainer = useRef(null)
 const loadDate = useRef(null)
 const timelinecontainer = useRef(null)

 //音量高低
 const handleChange = (event) => {
   const newValue = parseFloat(event.target.value);
   setVolume(newValue);
   if (event.target.value) {
     if (videoRef.current) {
       videoRef.current.volume = parseFloat(event.target.value);
     }
   }
 };
 //暂停播放
 const toggleAndPlayAnePaues = (event) => {
   event.stopPropagation();
   if (videoRef.current) {
     setIsPauesd((prev) => {
       if (prev) {
         videoRef.current.pause();

       } else {
         videoRef.current.play();

       }
       return !prev;
     });
   }
 };
 //总时长时间
 const handleChangeUpdate = () => {
   if (timeUpdate.current && videoRef.current) {
     const duration = videoRef.current.duration;
     timeUpdate.current.textContent = updateTime(duration);
   }
 };
 useEffect(() => {
   if (videoRef.current) {
     videoRef.current.addEventListener('timeupdate', TimeMinuteSecond);
     return () => {
       videoRef.current.removeEventListener('timeupdate', TimeMinuteSecond);
     };
   }
 }, []);

 const updateTime = (time) => {
   const hour = Math.floor(time / 3600);
   const minute = Math.floor((time / 60) % 60);
   const second = Math.floor(time % 60);
   return `${hour > 0 ? `${hour}:` : ''}${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`;
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
     loadDate.current.textContent = updateTime(videoRef.current.currentTime);
     const percent = (videoRef.current.currentTime / videoRef.current.duration);
     timelinecontainer.current.style.setProperty("--progress-position", percent.toString());
   }
 };
 //时间线(e.buttons & 1)右键点击就是1所以e.buttons是看看你有没有点击有点击才会更新没点击而是移动的话就只会灰色的进度条跟你移动
 const handleMouseDown = (e) => {

   if (timelinecontainer.current && videoRef.current) {
     const rect = timelinecontainer.current.getBoundingClientRect()

     const percent = Math.min(Math.max(0, e.nativeEvent.x - rect.x), rect.width) / rect.width

     setIsScrubbing((e.buttons & 1) === 1)
     if (isScrubbing) {
       wasPaused = videoRef.current.paused
     } else {
       videoRef.current.currentTime = percent * videoRef.current.duration
     }

   }

   handleMouseMove(e)
 }

 //e.x就是当前鼠标x轴的像素，但是请记住整个页面的x最左边到鼠标，所以我们还要有DomRect这个也就是getBoundingClientRect()里面的x就是他与页面的相差距离他的width也就是整个元素的宽度
 const handleMouseMove = (e) => {
   if (timelinecontainer.current && videoRef.current) {
     const timelineRect = timelinecontainer.current.getBoundingClientRect();
     const position = Math.min(Math.max(1, e.nativeEvent.x - timelineRect.x), timelineRect.width) / timelineRect.width;
     timelinecontainer.current.style.setProperty('--preview-position', position);
     if (isScrubbing) {
       e.preventDefault();
       timelinecontainer.current.style.setProperty('--progress-position', position);
     }
   }
 };
 //点击后松开一定要写这个方法要把setIsScrubbing((e.buttons & 1) === 1)变成false
 const handleMouseUp = () => {
   setIsScrubbing(false);
 };
 //倍速
 const changePlaybackSpeed = () => {
   if (videoRef.current) {
     const newPlaybackRate = videoRef.current.playbackRate >= 2 ? 0.25 : videoRef.current.playbackRate + 0.25;
     videoRef.current.playbackRate = newPlaybackRate;
     if (speedBtn.current) speedBtn.current.textContent = `${newPlaybackRate}倍`;
   }
 };
 //下面就是剧场模式，全屏，画中画
 const toggleTheaterMode = () => videoContainer.current?.classList.toggle("theater");

 const toggleFullScreenMode = () => {
   if (document.fullscreenElement == null && videoContainer.current) {
     videoContainer.current.requestFullscreen()
   } else {
     document.exitFullscreen()
   }
 }
 // 剧场模式切换
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
     videoRef.current.addEventListener('loadedmetadata', handleChangeUpdate);
     return () => {
       videoRef.current.removeEventListener('loadedmetadata', handleChangeUpdate);
     };
   }
 }, []);

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
///999999999999999999

<div className='video-all'>
         <div className='left'>
           <div ref={videoContainer} className={`video-container ${isPaused ? 'play' : 'paused'}`} data-volume-level="high">
             <img className="thumbnail-img"></img>
             <div className='video-controls-container'>
               <div className="timeline-container" onMouseUp={handleMouseUp} ref={timelinecontainer} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} >
                 <div className="timeline" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                   {/* <img className="preview-img" /> */}
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

                 <button ref={speedBtn} onClick={changePlaybackSpeed} className="speed-btn wide-btn">
                   1.0倍
                 </button>
                 <button className="mini-player-btn" onClick={toggleMiniPlayerMode}>
                   <svg viewBox="0 0 24 24">
                     <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" />
                   </svg>
                 </button>
                 {/* <button className="theater-btn" onClick={toggleTheaterMode}>
                   <svg className="tall" viewBox="0 0 24 24">
                     <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
                   </svg>
                   <svg className="wide" viewBox="0 0 24 24">
                     <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z" />
                   </svg>
                 </button> */}
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
               <video onVolumeChange={handleVolumeChange} onTimeUpdate={TimeMinuteSecond} onLoadedData={handleChangeUpdate} onClick={toggleAndPlayAnePaues} ref={videoRef}>
                 <source src={videoUrl} type="video/mp4" />
               </video>
             }
           </div>
         </div>
       </div>