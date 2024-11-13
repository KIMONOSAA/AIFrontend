import React, { useCallback, useEffect, useState } from 'react'
import { getLoginUser } from '@/services/auth/userController'
import { getAccuracyChartById, listMyPracticeByPage } from '@/services/chart/chartController';
import { courseBaseInfoController } from '@/services/course/index';
import { message, Spin } from 'antd';
import './Personal.scss'
import ReactECharts from 'echarts-for-react'; // 引入 ECharts 组件
import { List, Modal, Button } from 'antd';
import VirtualList from 'rc-virtual-list';
// 定义容器高度
const ContainerHeight = 596;

interface TeachPlan {
    id: number;
    label: string;
    pname: string;
    totalTime: string;
    description: string;
    timelength: string;
}

interface CourseRecord {
    courseId: number;
    courseName: string;
    courseTeachplan: string; // JSON 字符串
    updateTime: number;
}

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

    const [practicePage, setPracticePage] = useState(1); // 当前练习记录分页
    const [coursePage, setCoursePage] = useState(1); // 当前课程记录分页
    // 获取练习记录
    const [practiceData, setPracticeData] = useState<any[]>([]); // 练习记录数据
    const [loading, setLoading] = useState(false); // 加载状态
    const [activeTabb, setActiveTabb] = useState('practice'); // 当前标签
    const [aiResult, setAiResult] = useState<string>(''); // 当前分析结果

    const fetchUserPractice = useCallback(async (page: number) => {
        message.success('练习记录...');
        try {
            setLoading(true);
            // 假设这里是从接口请求数据
            const response = await listMyPracticeByPage({
                current: page,
                pageSize: 5, // 每次加载5条记录
            });
            console.log('获取练习记录', response);
            setPracticeData(prevData => [...prevData, ...response.data.records]);
        } catch (error) {
            console.error('Error fetching practice data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // const handleTabChange = (tab: string) => {
    //   setActiveTabb(tab);
    //   if (tab === 'practice') {
    //     setPracticeData([]); // 清空练习记录
    //   } else if (tab === 'course') {
    //     // 课程数据清空逻辑
    //   }
    // };

    const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === innerHeight) {
            fetchUserPractice(practiceData.length / 5 + 1); // 下一页
        }
    };

    // useEffect(() => {
    //   if (activeTabb === 'practice') {
    //     fetchUserPractice(1); // 加载第一页练习记录
    //   } else if (activeTabb === 'course') {
    //     // 加载课程记录
    //   }
    // }, [activeTabb]);

    const showAiResult = (result: string) => {
        setAiResult(result);
        setIsModalOpenresult(true);
    };
    //课程记录
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //练习记录
    const [isModalOpenresult, setIsModalOpenresult] = useState(false);

    const handleOkResult = () => {
        setIsModalOpenresult(false);
    };

    const handleCancelResult = () => {
        setIsModalOpenresult(false);
    };
    // 获取课程记录
    const [courseData, setCourseData] = useState<CourseRecord[]>([]);
    const [selectedTeachPlan, setSelectedTeachPlan] = useState<TeachPlan[]>([]);

    // 格式化时间为日期格式
    const formatDate = (timestamp: number) => {
        // console.log('格式化时间', timestamp);

        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600); // 获取小时
        const minutes = Math.floor((seconds % 3600) / 60); // 获取分钟
        const remainingSeconds = Math.round(seconds % 60); // 获取秒

        // 格式化成 HH:mm:ss 格式
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 获取课程记录并实现分页加载
    const fetchUserRecord = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const response = await courseBaseInfoController.listCourseRecord({
                current: page,
                pageSize: 5, // 每次加载5条
            });
            console.log('获取课程记录', response);
            setCourseData((prevData) => [...prevData, ...response.data.records]);
        } catch (error) {
            console.error('Error fetching course record:', error);
        } finally {
            setLoading(false);
        }
    }, []);



    // 点击按钮显示教学计划内容
    const handleShowTeachPlan = (teachPlanJson: string) => {
        const teachPlan = JSON.parse(teachPlanJson) as TeachPlan[];
        setSelectedTeachPlan(teachPlan);
        setIsModalOpen(true); // 打开模态框
    };

    // 模态框关闭操作
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // 处理滚动事件加载更多数据
    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight && !loading) {
            fetchUserRecord(courseData.length / 5 + 1); // 每次加载更多5条
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

    // 监听滚动事件，加载更多数据
    // const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    //     const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    //     if (bottom && !loading) {
    //         if (activeTabb === 'practice') {
    //             setPracticePage(prev => prev + 1);
    //             fetchUserPractice(practicePage + 1); // 加载下一页练习记录
    //         } else if (activeTabb === 'course') {
    //             setCoursePage(prev => prev + 1);
    //             fetchUserRecord(coursePage + 1); // 加载下一页课程记录
    //         }
    //     }
    // };


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
                                <img src={`data:image/png;base64, ${userInfo.userAvatar}`} alt="用户头像" />
                            </div>
                            <div className="user-details">
                                <div className="info-item">
                                    <span className="info-label">账号</span>
                                    <div className="info-value">{userInfo.userAccount || '空'}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">昵称</span>
                                    <div className="info-value">{userInfo.userName || '空'}</div>
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
                        {/* 滚动加载列表 */}
                        {activeTabb === 'practice' && (
                            <VirtualList
                                data={practiceData}

                                // style={{
                                //     height: '596px', // 设置容器的高度
                                //     overflow: 'auto', // 启用滚动
                                //     padding: '0 16px', // 内边距，避免内容贴边
                                //     border: '1px solid rgba(140, 140, 140, 0.35)', // 浅灰色边框
                                //     borderRadius: '4px', // 可选：给边框添加圆角效果
                                // }}
                                height={596} // 设置 VirtualList 的显示区域高度，显示5条记录
                                itemHeight={84} // 每条记录的高度
                                itemKey="id"
                                onScroll={handleScroll}
                            >
                                {(item: any) => (
                                    <List.Item key={item.id} style={{ listStyleType: 'none' }}>
                                        <div className="record-item">
                                            <div className="record-info">
                                                <div className="record-title">练习科目：{item.subjects}</div>
                                                <div className="record-date">创建时间：{formatDate(new Date(item.createTime))}</div>
                                                <div className="record-total-score">
                                                    总分：{item.practicePoint} | 错误：{item.userError} | 正确：{item.userRight}
                                                </div>
                                            </div>
                                            <Button type="primary" onClick={() => showAiResult(item.airesult)}>
                                                查看分析
                                            </Button>
                                        </div>
                                    </List.Item>
                                )}
                            </VirtualList>
                        )}

                        {/* 分析结果 Modal */}
                        <Modal title="分析结果" open={isModalOpenresult} onOk={handleOkResult} onCancel={handleCancelResult}>
                            <p>{aiResult}</p>
                        </Modal>


                        {/* 课程记录列表 */}
                        {activeTabb === 'course' && (
                            <div>
                                <List>
                                    <VirtualList
                                        data={courseData}
                                        height={ContainerHeight}
                                        itemHeight={73} // 每项高度
                                        itemKey="courseId"
                                        onScroll={onScroll}
                                    >
                                        {(item: CourseRecord) => {
                                            // 解析 JSON 字符串
                                            const teachPlan = item.courseTeachplan ? JSON.parse(item.courseTeachplan) : [];
                                            return (
                                                <List.Item key={item.courseId}>
                                                    <List.Item.Meta
                                                        title={<a href="#">{item.courseName}</a>}
                                                        description={`最后更新时间：${formatDate(item.updatetime)}`}
                                                    // description={`最后更新时间：${formatDate(item.updatetime)}`}
                                                    />
                                                    <div>
                                                        {/* 标签和教学计划展示 */}
                                                        {teachPlan.length > 0 ? (

                                                            <Button
                                                                style={{ marginRight: '50px' }}
                                                                onClick={() => handleShowTeachPlan(item.courseTeachplan)} type="primary">
                                                                预览教学计划
                                                            </Button>

                                                        ) : (
                                                            <div>教学计划暂无</div>
                                                        )}
                                                    </div>
                                                </List.Item>
                                            );
                                        }}
                                    </VirtualList>
                                    {loading && <Spin />}
                                </List>
                            </div>
                        )}

                        {/* 教学计划模态框 */}
                        <Modal
                            title="教学计划详情"
                            visible={isModalOpen}
                            onCancel={handleModalClose}
                            footer={null}
                            width={600}
                        >
                            <List
                                dataSource={selectedTeachPlan}
                                renderItem={(plan) => (
                                    <List.Item key={plan.id}>
                                        <List.Item.Meta
                                            title={<span>教学计划名称：{plan.pname}</span>}
                                            description={
                                                <>
                                                    <div>知识点：{plan.label}</div>
                                                    <div>
                                                        已观看：{formatTime(plan.timelength)} 总时间：{formatTime(plan.totalTime)}
                                                    </div>

                                                    <div>描述：{plan.description}</div>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Modal>

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
        .containerp {
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
            <div className="containerp">
                <aside className="sidebar">
                    <h2>个人中心</h2>
                    <ul>
                        <li><a onClick={() => setActiveTab('personalInfo')} className={activeTab === 'personalInfo' ? 'active' : ''}><span className="icon">📋</span>个人信息</a></li>
                        {/* <li><a onClick={() => setActiveTab('accountSecurity')} className={activeTab === 'accountSecurity' ? 'active' : ''}><span className="icon">🔒</span>账号安全</a></li> */}
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