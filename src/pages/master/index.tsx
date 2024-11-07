import React, { useState, useEffect } from 'react';
import { Layout, Carousel, message, Card } from 'antd';
import './style.scss';
import { courseBaseInfoController } from '@/services/course/index';
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;
interface CourseData {
  id: string;
  name: string;
  grade: string;
  description: string;
  pic: string;
  createDate: string;
  browses: number;
}

const Master: React.FC = () => {
  const [tags, setTags] = useState<string | null>(null);
  const [courseList, setCourseList] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const navigate = useNavigate();

  useEffect(() => {
    if (tags) {
      fetchCourseList(tags, page);
    }
  }, [tags, page]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  //高亮图标样式
  const [activeSubject, setActiveSubject] = useState('课程精品');
  const handleTagClick = (tag: string) => {
    setTags(tag);
    setPage(1);
    setCourseList([]);
    setActiveSubject(tag); // 更新 activeSubject 状态
  };
  const fetchCourseList = async (tag: string, current: number) => {
    setLoading(true);
    try {
      const response = await courseBaseInfoController.listAiMasterDataByPage({
        tags: tag,
        current,
        pageSize,
        sortField: 'browses',
      });
      if (response.data && response.data.records) {
        console.log(response.data.records);
        
        const newRecords = current === 1 ? response.data.records : [...courseList, ...response.data.records];
        setCourseList(newRecords);
        setTotal(response.data.total);
        message.success('课程数据加载成功！');
      }
    } catch (error) {
      console.error('加载课程数据时发生错误:', error);
      message.error('加载课程数据失败！');
    } finally {
      setLoading(false);
    }
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight && !loading && courseList.length < total) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  
  return (
    <ul
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0,
        listStyle: 'none',
        overflowY: courseList.length < 1 ? 'hidden' : 'auto',
        height: courseList.length < 1 ? '1000px' : 'calc(100% )',
        position: 'fixed',
        width: 'calc(100% - 0px)',
        top: courseList.length < 1 ? '37%' : '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        alignItems: 'flex-start',
      }}
      onScroll={onScroll}
    >
      <div style={{
        width: '100%',
        marginTop: courseList.length < 1 ? '200px' : '60px'
      }}>
        <Carousel arrows autoplay>
          {[...Array(3)].map((_, index) => (
            <div key={index}>
              <img
                src={index === 0 ? './p4.jpg' : (index === 1 ? './p1.jpg' : './p2.jpg')}
                alt={`banner ${index + 1}`}
                style={{ width: '100%', height: '650px' }}
              />
            </div>
          ))}
        </Carousel>
      </div>
      {/* <div className="goods" style={{ width: '100%', marginTop: '20px' }}>
        <h3 style={{ textAlign: 'center' }}>课程精品</h3>
        <ul style={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
          {['语文', '数学', '英语', '物理', '化学', '历史', '生物', '地理'].map((subject) => (
            <li key={subject} style={{ margin: '0 10px' }}>
              <a href="#" onClick={() => handleTagClick(subject)}>{subject}</a>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="container">
        <h2 className="section-title">热门好课</h2>
        <div className="nav-scroll">
          <div className="nav-tabs">
            {/* <a href="#" className="nav-item">课程精品</a> */}
            {['课程精品', '语文', '数学', '英语', '物理', '化学', '历史', '生物', '地理'].map((subject) => (
              <a
                key={subject}
                href="#"
                className={`nav-item ${activeSubject === subject ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTagClick(subject);
                }}
              >
                {subject}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="container">
        <h2 className="section-title">热门好课</h2>
        <div className="nav-scroll">
          <div className="nav-tabs">
            <a href="#" className="nav-item">课程精品</a>
            <a href="#" className="nav-item active">语文</a>
            <a href="#" className="nav-item">数学</a>
            <a href="#" className="nav-item">英语</a>
            <a href="#" className="nav-item">物理</a>
            <a href="#" className="nav-item">化学</a>
            <a href="#" className="nav-item">历史</a>
            <a href="#" className="nav-item">生物</a>
            <a href="#" className="nav-item">地理</a>
          </div>
        </div>
      </div>
      <div className="box1-hd" style={{ width: '100%', margin: '0px 40px' }}>
        <h3>精品推荐</h3>
        <a href="#">查看全部</a>
      </div> */}

      {courseList.length < 1 ? (
        <div style={{ textAlign: 'center', width: '100%', margin: '20px 0' }}>
          <p>暂无课程可显示</p>
        </div>
      ) : (
        // courseList.map((item: CourseData) => (
        //   <li key={item.id} style={{ width: '16%', margin: '2%', textAlign: 'center' }} onClick={() => handleCourseClick(item.id)}>
        //     <img src="./infomei_03.png" alt="课程图片" style={{ width: '100%', height: '150px' }} />
        //     <h4 style={{ margin: '10px 0' }}>{item.name}</h4>
        //     <p style={{ margin: '10px 0' }}>
        //       {item.description.length > 10 ? `${item.description.slice(0, 100)}...` : item.description}
        //     </p>
        //     <div className="infomei" style={{ color: '#888' }}>
        //       <span>{item.grade}</span> • 发布: {new Date(item.createDate).toLocaleDateString()}
        //     </div>
        //   </li>
        // ))

        //ai
        // courseList.map((item: CourseData) => (
        //   <div className="course-container" key={item.id} onClick={() => handleCourseClick(item.id)}>
        //     <div className="course-image">
        //       <img src="./infomei_03.png" alt={item.name} />
        //     </div>
        //     <h3 className="course-title">{item.name}</h3>
        //     <p className="course-desc">
        //       {item.description.length > 100 ? `${item.description.slice(0, 100)}...` : item.description}
        //     </p>
        //     <div className="course-footer">
        //       <div className="school-info">
        //         <img src="/placeholder.svg?height=20&width=20" alt="学校logo" className="school-logo" />
        //         <span className="school-name">某某大学</span>
        //       </div>
        //       <div className="view-count">
        //         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        //           <path d="M12 4.5c-5 0-9 5-9 7.5s4 7.5 9 7.5 9-5 9-7.5-4-7.5-9-7.5z" />
        //           <circle cx="12" cy="12" r="3" />
        //         </svg>
        //         <span>5403</span>
        //       </div>
        //     </div>
        //     <div className="course-meta">
        //       <span className="grade">{item.grade}</span> • 
        //       <span className="create-date">发布: {new Date(item.createDate).toLocaleDateString()}</span>
        //     </div>
        //   </div>
        // ));
        courseList.map((item: CourseData) => (
          <div key={item.id} className="course-container" onClick={() => handleCourseClick(item.id)} >
            <div className="course-image">
              <img src="./infomei_03.png" alt={item.name} />
            </div>
            <h3 className="course-title">{item.name}</h3>
            <p className="course-desc">  {item.description.length > 10 ? `${item.description.slice(0, 100)}...` : item.description}</p>
            <div className="course-footer">
              <div className="school-info">
                {/* <img src="/placeholder.svg?height=20&width=20" alt="学校logo" className="school-logo" /> */}
                <span className="school-name">{item.grade}</span>
              </div>
              <div className="view-count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 4.5c-5 0-9 5-9 7.5s4 7.5 9 7.5 9-5 9-7.5-4-7.5-9-7.5z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{item.browses}</span>
              </div>
            </div>
          </div>
        ))
      )}
      {loading && (
        Array.from({ length: pageSize }, (_, index) => (
          <Card key={index} loading={true} style={{ width: '16%', margin: '2%' }}>
            <p>加载中...</p>
          </Card>
        ))
      )}
    </ul>
  );
};

export default Master;
