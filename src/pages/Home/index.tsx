
import { Avatar, Breadcrumb, Button, Card, Spin, Flex, Layout, List, Menu, MenuProps, message, Result } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useModel } from '@@/exports';
import { Input } from 'antd';
import { Skeleton } from 'antd';
import Sider from 'antd/es/layout/Sider';
import VirtualList from 'rc-virtual-list';
import { addAiMessageSession, listAiMessageSessionByPage, deleteAiMessageSession } from '@/services/content/aiMessageSessionController';
import { addAiMasterData1, listAiMasterDataByPage } from '@/services/content/aiMasterDataController';
import TextArea from 'antd/es/input/TextArea';
import { CaretRightOutlined, CopyOutlined, DeleteOutlined, PlusOutlined, PoweroffOutlined, SmileOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';


// import './custom-scrollbar.css'; // 引入上面的CSS样式
const ContainerHeight = 0;
const Home: React.FC = () => {

  const [isFirst, setIsFirst] = useState<boolean>(false)
  const [sessionPageNumber, setSessionPageNumber] = useState<number>(1)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [localeDataId, setLocaleDataId] = useState<number>()
  const [firstSessionId, setFirstSessionId] = useState<number>()
  const [inputData, setInputData] = useState<string>()
  const [testData, setTestData] = useState<string>()
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {}
  const [initPage, setInitPage] = useState<API.AIMessageSessionQueryRequest | API.AIMasterDataQueryRequest>({
    current: 1,
    pageSize: 16,
    sortField: "create_time",
    aiMessageId: 0,
  })
  // const [sessionListTitle, setSessionListTitle] = useState('')
  // const sessionListTitle = ''
  const initData = {
    id: 0,
    aiTitle: '',
    aiBody: '',
    aiResult: '',
    aiMessageSessionId: 0,
    userTitle: '',
    userBody: '',
    userId: 0,
    createTime: '',
    updateTime: '',
    isDelete: 0
  }


  // console.log('initialState', initData.userTitle);

  const [isSession, setIsSession] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [sessionList, setSessionList] = useState<API.AIMessageSession[]>([])
  const [sessionMessageList, setSessionMessageList] = useState<API.AIMasterData[]>([])
  const [loadingSession, setLoadingSession] = useState<boolean>(false);
  const [loadingMasterData, setLoadingMasterData] = useState<boolean>(false);
  const [loadingSessionMessage, setLoadingSessionMessage] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(false);
  const [inputText, setInputText] = useState<string>()

  const [title, setTitle] = useState('');

  // const handleAdd = () => {
  //   const initSession: API.AIMessageSessionAddRequest = {
  //     title: title, // 使用用户输入的标题
  //   };
  //   console.log(initSession);
  //   // 这里可以添加其他逻辑，比如发送请求等
  // };


  // console.log('999',sessionMessageList[0].userTitle);
  const loadItem = async () => {
    setLoadingSession(true)
    try {
      const result = await listAiMessageSessionByPage(initPage)

      if (result.code === 0 && result.data?.records) {
        setSessionList([...result.data.records])
        setFirstSessionId(result.data.records[0].id)
        message.success("获取成功")
      } else {
        message.error("暂无数据")
      }
      setLoadingSession(false)
    } catch (error) {
      setLoadingSession(false)
      // message.error("请求地址不存在")
    }


  }
  const handleContext = async (id: number | undefined, current?: number) => {


    setLocaleDataId(id)
    setFirstSessionId(id)
    // 首先，设置initPage的aiMessageId，如果需要的话，也设置current  
    let updatedInitPage = { ...initPage, aiMessageId: id };
    if (current) {
      updatedInitPage = { ...updatedInitPage, current: current };
    }
    setInitPage(updatedInitPage);

    setLoadingSessionMessage(true)
    try {
      const result = await listAiMasterDataByPage(updatedInitPage);
      if (result.code === 0 && result.data?.records) {
        setSessionMessageList([...sessionMessageList, ...result.data.records])
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        message.success("获取成功")
      } else {
        message.error("暂无数据")
      }
      setLoadingSessionMessage(false)
    } catch (error) {
      setLoadingSessionMessage(false)
      // message.error("请求地址不存在")
    }
  }

  // aiMessageSessionId?: number;
  //   aiTitle?: string;
  //   aiBody?: string;
  //   aiResult?: string;
  //   userTitle?: string;
  //   userBody?: string;

  const handleSendMessage = async () => {
    const params: API.AIMasterDataAddRequest = {
      aiMessageSessionId: firstSessionId,
      aiTitle: '',
      aiBody: '',
      aiResult: '',
      userTitle: inputData,
      userBody: '',

    }
    setLoadingMasterData(true)
    setLoading(true)
    try {
      const result = await addAiMasterData1(params);
      console.log('111',result);
      
      if (result.code === 0 && result.data && result.data.aiResult.length !== 0) {
        setSessionMessageList([...sessionMessageList, result.data]);
        setTestData(result.data);
        // setSessionListTitle(result.data.userTitle)
        message.success("获取成功");
        // console.log(result.data.aiResult.length === 0);

      } else if (result.code === 0 && result.data?.records && result.data.aiResult.length === 0) {
        message.error("获取失败：返回的数据为空");
      } else if (result.data && result.data.aiResult.length === 0) {
        message.error("获取失败：返回的数据为空");
      } else {
        message.error("获取失败");
      }
    } catch (error) {
      // message.error("请求地址不存在")
      setLoadingMasterData(false)
    }
    finally {
      // 完成后恢复按钮状态
      setLoading(false)
      setInputData('');
      setLoadingMasterData(false)
      // console.log('2333', sessionMessageList);

    }

  }
  const formDateTime = (isoString: string) => {
    const date = new Date(isoString);

    // 验证日期是否有效  
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // 使用getFullYear, getMonth (注意月份是从0开始的，所以要+1), getDate方法来获取年月日  
    // 然后将它们组合成一个字符串  
    const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}-${('0' + (date.getHours())).slice(-2)}`;

    return formattedDate;
  }


  const [loading, setLoading] = useState<boolean>(false);


  const handleAddSession = async () => {

    const initSession: API.AIMessageSessionAddRequest = {
      title: title, // 使用用户输入的标题
    };
    setTitle('')
    console.log();

    console.log(sessionList);
    // 这里可以添加其他逻辑，比如发送请求等
    try {
      const result = await addAiMessageSession(initSession)
      // console.log('65656', result);

      if (result.code === 0) {
        let updatedInitPage = { ...initPage };
        updatedInitPage = { ...updatedInitPage, current: sessionPageNumber + 1, pageSize: 1 };
        setInitPage(updatedInitPage);
        setSessionPageNumber((prev) => prev + 1)
        setInitPage({ ...initPage, current: sessionPageNumber, pageSize: 1 })
        const resultSession = await listAiMessageSessionByPage(updatedInitPage)
        console.log(1111,resultSession);

        if (resultSession.code === 0 && resultSession.data && resultSession.data.records) {
          setSessionList([...sessionList, ...resultSession.data.records])
          setSessionMessageList(() => []);
          setPageNumber(() => 1)
          if (resultSession.data.records.length > 0) {  
            setFirstSessionId(() => resultSession.data.records[0].id);  
          } else {  
            // 如果没有记录，可以选择设置一个默认值或不做任何操作  
            // 例如，设置一个空值或 null  
            setFirstSessionId(() => undefined); // 或者其他合适的默认值  
          }  
          setIsSession(true)
          message.success("获取成功")
        } else {
          message.error("暂无数据")
        }
      } else {
        message.error("添加会话失败")
      }
    } catch (error) {
      // message.error("请求地址不存在")
    } finally {
      // 完成后恢复按钮状态
      setLoading(false)
      // console.log(sessionList);

    }
  }
  const handleOnclick = (id: number) => {
    setSessionMessageList(() => []);
    setFirstSessionId(id)
    setPageNumber(() => 1);
    setInitPage({ ...initPage, ['current']: 1 })
    // console.log('1111',sessionList);
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputData(e.target.value)
    // setTitle(e.target.value)

  };
  // const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
  //   // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
  //   if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
  //     setPageNumber((prevPageNumber) => prevPageNumber + 1); // 先更新 pageNumber  
  //   }
  // };
  useEffect(() => {
    loadItem()
  }, [])
  useEffect(() => {
    if (firstSessionId) {
      handleContext(firstSessionId, pageNumber)
    }
  }, [pageNumber, firstSessionId])
  const [isFocused, setIsFocused] = useState(false);

  // 聚焦时，设置外层 div 的边框颜色
  const handleFocus = () => {
    setIsFocused(true);
  };

  // 失去焦点时，恢复外层 div 的边框颜色
  const handleBlur = () => {
    setIsFocused(false);
  };
  const listRef = useRef<HTMLDivElement>(null);

  // const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [sessionMessageList]);

  // 复制到剪贴板的函数
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success("内容已复制到剪贴板！");
      })
      .catch(() => {
        message.error("复制失败，请重试。");
      });
  };
  const handleDelete = async (id: string) => {
    console.log('删除会话 ID:', id);
    try {
      const response = await deleteAiMessageSession({ id: id });
      message.success('会话已删除！');
      // 可以在这里添加其他逻辑，比如更新会话列表状态等
    } catch (error) {
      message.error('删除会话时出错:', error);
      // 可以在这里处理错误，例如显示错误提示
    }
  };
  return (
    <div
      style={{
        height: '0',
        overflowY: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <Layout
        style={{ backgroundColor: '#ffffff', zIndex: 1000 }}
      >
        <Sider
          width={256}
          style={{
            position: 'fixed',
            zIndex: 1000,
            top: 50,
            paddingTop: 20,
            backgroundColor: '#f9f9f9',
          }}
          theme="light"
        >
          <div>
            <Input
              placeholder="请输入会话标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // 更新输入值
              style={{ marginBottom: '10px' }}
            />
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddSession}
              style={{ width: '100%', fontWeight: 600, fontSize: '18px' }}
            >
              添加会话
            </Button>
          </div>

          <Menu
            mode="inline"
            theme="light"
            style={{
              width: '100%',
              padding: '2px 10px',
              height: '813px',
              overflow: 'auto',
              backgroundColor: '#f7f7f7', // 背景色调整
              scrollbarWidth: 'thin', // 调整滚动条的宽度
              scrollbarColor: '#ccc #f0f0f0', // 自定义滚动条颜色
            }}
          >
            {/* 映射会话列表 */}
            {sessionList?.map((item, index) => (
              <Menu.Item
                key={item.id}
                onClick={() => handleOnclick(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  height: 'auto',
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{
                  item.title || '标题'}
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止点击事件冒泡
                      handleDelete(item.id); // 调用删除函数
                    }}
                    style={{ position: 'absolute', fontSize: '12px', right: '0px' }}
                  >
                  </Button>


                </div>
                <p style={{ color: '#999', fontSize: '12px' }}>
                  {formDateTime(item.createTime || '')}
                </p>

              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        <Layout>
          <List>
            {sessionMessageList && (
              <div ref={listRef}
                style={{
                  height: 'calc(100% - 184px)',
                  width: 'calc(100% - 297px)',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  top: '50px',
                  left: '297px',
                  position: 'fixed',
                  zIndex: 1000,
                  display: 'flex',
                  justifyContent: 'center', // 水平居中  
                  alignItems: 'center', // 垂直居中  
                  flexDirection: 'column', // 垂直堆叠  
                  backgroundColor: '#ffffff',
                  scrollbarColor: '#ccc #f0f0f0', // 自定义滚动条颜色
                }}
              >
                {sessionMessageList.length === 0 && (
                  <h1 style={{ fontSize: '40px', fontWeight: 'bold' }}>你好，有什么可以帮忙的？
                    {/* <SmileOutlined /> */}
                  </h1>

                )}

                <VirtualList
                  data={sessionMessageList}
                  itemHeight={50}
                  itemKey="email"
                >
                  {(item: API.AIMasterData, index) => {
                    const isLastItem = index === sessionMessageList.length - 1;
                    return (
                      <div>
                        <List.Item
                          key={item.id}
                          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                          <Card style={{ backgroundColor: 'transparent', border: 'none' }}>

                            <List.Item.Meta
                              avatar={<Avatar src={`data:image/png;base64, ${initialState?.currentUser?.userAvatar}`} />}
                              title={item.userTitle}
                              style={{
                                marginBottom: '50px', marginTop: '30px',
                              }}
                            />
                            <Card
                              style={{
                                marginTop: 30, height: 'auto', width: 1000, marginBottom: 50, marginLeft: 50,
                                backgroundColor: '#f4f4f4',
                                color: '#000000', // 用户问题的文字颜色
                                borderRadius: '10px',
                                padding: '10px',
                                flex: '1', // 自适应宽度
                              }}
                            >
                              <List.Item.Meta
                                avatar={<Avatar src='./ai.png' />}
                                title={item.aiTitle}
                                style={{ position: 'absolute', left: '-55px', top: 0 }}
                              />
                              <ReactMarkdown>{item.aiResult.length !== 0 ? item.aiResult : "抱歉，每天免费5次，现在次数已用完"}</ReactMarkdown>
                              {item.aiResult.length !== 0 ? <Button
                                type="text"
                                onClick={() => copyToClipboard(item.aiResult)} // 调用复制函数
                                style={{
                                  // marginTop: '10px' 
                                  position: 'absolute',
                                  top: 0,
                                  right: '0',
                                }} // 添加按钮的顶部间距
                              >
                                <CopyOutlined />
                                复制文本
                              </Button>
                                : ''
                              }

                            </Card>
                            {loadingMasterData && isLastItem && (
                              <Card loading style={{ marginTop: 30, height: 'auto', width: 1000, marginBottom: 50 }}>
                                <List.Item.Meta
                                  avatar={<Avatar src={`data:image/png;base64, ${initialState?.currentUser?.userAvatar}`} />}
                                  title={item.userTitle}
                                  style={{ marginBottom: '50px', marginTop: '30px' }}
                                />
                                <ReactMarkdown></ReactMarkdown>
                              </Card>
                            )}
                          </Card>
                        </List.Item>
                      </div>
                    );
                  }}
                </VirtualList>
              </div>
            )}
            <Flex gap="small" align="center" wrap>
              <div
                style={{
                  border: isFocused ? '2px solid #2e6ee7' : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  boxShadow: isFocused ? '0 0 2px rgba(46, 110, 231, 0.5)' : 'none',
                  transition: 'border 0.2s, box-shadow 0.2s',
                  padding: '16px',
                  bottom: 0,
                  right: 0,
                  width: 'calc(100% - 297px)',
                  backgroundColor: '#fff',
                  zIndex: 1000,
                  position: 'fixed',
                }}
              >
                <TextArea
                  showCount
                  maxLength={2000}
                  onChange={onChange}
                  value={inputData}
                  placeholder="输入内容..."
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{
                    height: '50px',
                    width: '100%',
                    marginBottom: 50,
                    resize: 'none',
                    outline: 'none',
                    border: 'none',
                    boxShadow: '0 0 4px rgba(0, 0, 0, 0)',
                  }}
                />
                <Button
                  type="primary"
                  shape="round"
                  loading={loading}
                  onClick={handleSendMessage}
                  icon={!loading ? <CaretRightOutlined /> : null}
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '11px',
                    zIndex: 100,
                    background: 'linear-gradient(90deg, #2e6ee7, #8c8ef7)',
                    cursor: 'pointer',
                    transition: 'background 0.3s, box-shadow 0.3s, transform 0.3s',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </Flex>
          </List>
        </Layout>
      </Layout>
    </div>

  )
};
export default Home;





















