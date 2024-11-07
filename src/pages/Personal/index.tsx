import React, { useCallback, useEffect, useState } from 'react'
import { getLoginUser } from '@/services/auth/userController'
import { getAccuracyChartById, listMyPracticeByPage } from '@/services/chart/chartController';
import { courseBaseInfoController } from '@/services/course/index';
import { message } from 'antd';
import './Personal.scss'
import ReactECharts from 'echarts-for-react'; // 引入 ECharts 组件
export default function Personal() {
    //个人信息
    const [activeTab, setActiveTab] = useState('personalInfo')
    const [userInfo, setUserInfo] = useState({});  // 用于存储用户信息
    useEffect(() => {
        const fetchUserInfo = async () => {
            const repo = await getLoginUser();
            setUserInfo(repo.data);  // 存储用户信息
            console.log('repo', repo.data);
        };
        fetchUserInfo();
    }, []);

    if (!userInfo) {
        return <div>加载中...</div>;
    }
    const userTypes = [
        { code: "605001", desc: "会员" },
        { code: "605002", desc: "超级会员" },
        { code: "605003", desc: "普通用户" }
    ];
    const getUserTypeDescription = (memberCode) => {
        const userType = userTypes.find(item => item.code === memberCode);
        return userType ? userType.desc : "未知类型";  // 如果没有匹配到，返回 "未知类型"
    };
    const userType = getUserTypeDescription(userInfo.member);

    //学习记录
    const [activeTabb, setActiveTabb] = useState('practice'); // 当前显示的标签
    const [practiceData, setPracticeData] = useState<any[]>([]); // 练习记录
    const [courseData, setCourseData] = useState<any[]>([]); // 课程记录
    const [practicePage, setPracticePage] = useState(1); // 当前练习记录分页
    const [coursePage, setCoursePage] = useState(1); // 当前课程记录分页
    const [loading, setLoading] = useState(false); // 加载状态
    // 获取练习记录
    const fetchUserPractice = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const response = await listMyPracticeByPage({
                current: page,
                pageSize: 5, // 每次加载5条
            });
            console.log('获取练习记录', response);

            setPracticeData(prevData => [...prevData, ...response.data.records]);
        } catch (error) {
            console.error('Error fetching practice data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 获取课程记录
    const fetchUserRecord = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const response = await courseBaseInfoController.listCourseRecord({
                current: page,
                pageSize: 5, // 每次加载5条
            });
            console.log('获取课程记录', response);

            setCourseData(prevData => [...prevData, ...response.data.records]);
        } catch (error) {
            console.error('Error fetching course record:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 格式化时间为日期格式
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    // 点击按钮显示课程计划内容
    const handleShowTeachPlan = (teachPlanJson: string) => {
        const teachPlan = JSON.parse(teachPlanJson);
        alert(`教学计划：${JSON.stringify(teachPlan, null, 2)}`);
    };


    // 监听滚动事件，加载更多数据
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
        if (bottom && !loading) {
            if (activeTabb === 'practice') {
                setPracticePage(prev => prev + 1);
                fetchUserPractice(practicePage + 1); // 加载下一页练习记录
            } else if (activeTabb === 'course') {
                setCoursePage(prev => prev + 1);
                fetchUserRecord(coursePage + 1); // 加载下一页课程记录
            }
        }
    };

    // 切换标签
    const handleTabChange = (tab: string) => {
        setActiveTabb(tab);

        // 每次切换标签时重置页面和记录
        if (tab === 'practice') {
            setPracticeData([]); // 清空练习记录

        } else if (tab === 'course') {
            setCourseData([]); // 清空课程记录
        }
    };

    useEffect(() => {
        if (activeTabb === 'practice') {
            fetchUserPractice(1); // 加载第一页练习记录
        } else if (activeTabb === 'course') {
            fetchUserRecord(1); // 加载第一页课程记录
        }
    }, [activeTabb]);



    //个人分析图
    const [chartData, setChartData] = useState<any>(null); // 存储返回的数据
    const [chartOption, setChartOption] = useState<any>(null); // 存储图表的配置
    const [resultMessage, setResultMessage] = useState<string>(''); // 存储分析结果
    // const [loading, setLoading] = useState<boolean>(true); // 控制加载状态

    // 获取精确度图表数据
    useEffect(() => {
        const fetchUserChat = async () => {
            try {
                const response = await getAccuracyChartById(); // 获取数据
                if (response?.data) {
                    const { data } = response;

                    // 处理返回的图表配置数据
                    const chartConfig = JSON.parse(data.genChat ?? '{}');
                    setChartOption(chartConfig); // 设置图表配置

                    // 设置分析结果
                    setResultMessage(data.genResult ?? '');

                    setLoading(false); // 数据加载完成，更新 loading 状态
                } else {
                    message.error('无法获取图表数据');
                    setLoading(false);
                }
            } catch (error) {
                message.error('获取图表失败: ' + error.message);
                setLoading(false);
            }
        };

        fetchUserChat(); // 调用获取数据的函数
    }, []); // 空依赖数组，表示组件加载时调用一次
    //练习or学习记录
    // const [activeTabb, setActiveTabb] = useState('practice'); // 默认选中 "练习记录" 标签

    const renderContent = () => {
        switch (activeTab) {
            case 'personalInfo':
                return (
                    <>
                        <div className="main-content" style={{ paddingLeft: '300px', marginTop: '100px' }}>
                            <h1>个人信息</h1>
                            <div className="avatar-section">
                                {/* <img src="data:image/png;base64, ${userInfo.userAvatar}" alt="用户头像" /> */}
                            </div>
                            <div className="user-details">
                                <div className="info-item">
                                    <span className="info-label required">账号</span>
                                    <div className="info-value">{userInfo.userAccount || '空'}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">昵称</span>
                                    <div className="info-value">{userInfo.nickname || '空'}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">年级</span>
                                    <div className="info-value">{userInfo.grade || '空'}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">学历</span>
                                    <div className="info-value">{userInfo.qualification || '空'}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">邮箱</span>
                                    <div className="info-value">{userInfo.email || '空'}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">用户类型</span>
                                    <div className="info-value">{userType || '空'}</div>
                                </div>
                                {/* <div className="info-item">
                                    <span className="info-label">角色</span>
                                    <div className="info-value">{userInfo.userRole || '空'}</div>
                                </div> */}
                            </div>
                        </div>
                    </>
                );
            case 'learningRecords':
                return (
                    <div>
                        <h1>学习记录</h1>
                        <div className="tabs">
                            <div
                                className={`tab ${activeTabb === 'practice' ? 'active' : ''}`}
                                onClick={() => handleTabChange('practice')}
                            >
                                练习记录
                            </div>
                            <div
                                className={`tab ${activeTabb === 'course' ? 'active' : ''}`}
                                onClick={() => handleTabChange('course')}
                            >
                                课程学习记录
                            </div>
                        </div>

                        {/* 根据 activeTab 渲染不同的记录列表 */}
                        {activeTabb === 'practice' && (
                            <ul className="record-list" onScroll={handleScroll}>
                                {practiceData.map((item, index) => (
                                    <li key={index} className="record-item">
                                        <div className="record-info">
                                            <div className="record-title">练习科目：{item.subjects}</div>
                                            <div className="record-date">创建时间：{item.createTime}</div>
                                            <div className="record-total-score">
                                                总分：{item.practicePoint} | 错误：{item.userError} | 正确：{item.userRight}
                                            </div>
                                        </div>
                                        <button onClick={() => alert(item.airesult)}>查看分析</button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {activeTabb === 'course' && (
                           <ul className="record-list" onScroll={handleScroll}>
                           {courseData.map((item, index) => {
                               // 解析 JSON 字符串
                               const teachPlan = item.courseTeachplan ? JSON.parse(item.courseTeachplan) : [];
                   
                               return (
                                   <li key={index} className="record-item">
                                       <div className="record-info">
                                           <div className="record-title">{item.courseName}</div>
                                           <div className="record-label">
                                               {/* 显示解析后的标签信息 */}
                                               {teachPlan.length > 0 ? (
                                                   <>
                                                       <div>标签：{teachPlan[0].label}</div>
                                                       <div>教学计划：{teachPlan[0].pname}</div>
                                                   </>
                                               ) : (
                                                   <div>教学计划暂无</div>
                                               )}
                                           </div>
                                           <div className="record-progress">
                                               已观看：{item.timelength} / 总时间：{item.totalTime}
                                           </div>
                                       </div>
                                       <div className="record-date">最后更新时间：{formatDate(item.updateTime)}</div>
                                       <button onClick={() => handleShowTeachPlan(item.courseTeachplan)}>
                                           预览教学计划
                                       </button>
                                   </li>
                               );
                           })}
                       </ul>
                        )}
                    </div>
                );
            case 'performanceStats':
                return (
                    <>
                        <div >
                            {loading ? (
                                <p>加载中...</p>
                            ) : (
                                <>
                                    {chartOption && (
                                        <div>

                                            <ReactECharts option={chartOption} />
                                        </div>
                                    )}

                                    {resultMessage && (
                                        <div style={{ marginTop: '100px' }}>
                                            <h3 style={{
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                color: '#333',
                                                marginBottom: '20px',
                                            }}>分析结果</h3>
                                            <p style={{
                                                fontSize: '16px',
                                                lineHeight: '1.6',
                                                color: '#555',
                                                textAlign: 'justify',
                                            }}>{resultMessage}</p>
                                        </div>

                                    )}
                                </>
                            )}
                        </div >
                    </>
                )
            case 'accountSecurity':
                return (
                    <>
                        <h1>个人账号</h1>
                        <div className="account-info">
                            <div>
                                <span className="icon">📱</span>
                                绑定手机号：153********
                            </div>
                            <button className="btn">更换手机号</button>
                        </div>
                        <div className="account-info">
                            <div>
                                <span className="icon">✉️</span>
                                绑定邮箱：210********@qq.com
                            </div>
                            <button className="btn">更换邮箱</button>
                        </div>
                        <div className="account-info">
                            <div>
                                <span className="icon">🔑</span>
                                修改密码
                                <small>通过身份验证可修改密码</small>
                            </div>
                            <button className="btn">修改密码</button>
                        </div>
                        <div className="account-info">
                            <div>
                                <span className="icon">💻</span>
                                登录方式：手机号登录
                            </div>
                            <button className="btn">切换为邮箱登录</button>
                        </div>

                    </>
                )
            default:
                return null
        }
    }

    return (
        <>
            <style>{`
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f0f2f5;
        }
        .header {
          background-color: #4166f5;
          color: white;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        .nav a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
        }
        .user-info {
          display: flex;
          align-items: center;
        }
        .user-info img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-left: 10px;
        }
        .container {
          display: flex;
          margin: 20px;
        }
       
        .sidebar h2 {
          margin-top: 0;
          font-size: 30px;
          font-weight: bold; 
        }
        .sidebar ul {
          list-style-type: none;
          padding: 0;
        }
        .sidebar li {
          margin-bottom: 10px;
        }
        .sidebar a {
          text-decoration: none;
          color: #333;
          display: flex;
          align-items: center;
          font-size: 16px;
        }
        .sidebar a:hover, .sidebar a.active {
          color: #4166f5;
        }
        .sidebar .icon {
          margin-right: 10px;
          width: 20px;
          height: 20px;
          background-color: #e6e6e6;
          display: inline-block;
        }
        .main-content {
          flex-grow: 1;
          background-color: #fff;
          padding: 20px;
          margin-left: 20px;
          border-radius: 5px;
        //   margin:0 auto;
        }
      `}</style>
            <div className="container">
                <aside className="sidebar">
                    <h2>个人中心</h2>
                    <ul>
                        <li><a onClick={() => setActiveTab('personalInfo')} className={activeTab === 'personalInfo' ? 'active' : ''}><span className="icon">📋</span>个人信息</a></li>
                        <li><a onClick={() => setActiveTab('accountSecurity')} className={activeTab === 'accountSecurity' ? 'active' : ''}><span className="icon">🔒</span>账号安全</a></li>
                        <li><a onClick={() => setActiveTab('performanceStats')} className={activeTab === 'performanceStats' ? 'active' : ''}><span className="icon">📊</span>成绩统计</a></li>
                        <li><a onClick={() => setActiveTab('learningRecords')} className={activeTab === 'learningRecords' ? 'active' : ''}><span className="icon">📝</span>学习记录</a></li>
                    </ul>
                </aside>
                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </>
    )
}