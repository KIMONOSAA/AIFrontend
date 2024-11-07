import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Layout, List, Tag } from 'antd';
import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { courseOpenController, courseLearnRecordController } from '@/services/course/index';
import './style.scss'
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
        console.log(response);

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handleVideoChange = (mediaId: string, teachPlan: { id: number; pname: string; description: string; label: string }) => {
    // 更新当前教学计划信息
    setCurrentTeachPlan(teachPlan);
    // videoRef.current.pause(); // 暂停当前视频
    // const currentTimeNow = videoRef.current.currentTime;
    // if (currentTime !== null) {
    //   threeHandleUpdateCourse(teachPlan.id, teachPlan.pname, teachPlan.description, teachPlan.label); // 更新学习记录
    // }

    const newUrl = `http://localhost:63090/media/show?fileMd5=${mediaId}`;
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
  return (
    <Layout style={{ overflow: 'hidden', width: '100%' }}>
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{courseInfo.name || '无'}</span>
          </div>
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
            <video
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
            </video>
          </div>
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