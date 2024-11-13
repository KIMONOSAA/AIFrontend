import { ClockCircleOutlined, LogoutOutlined, RiseOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { message, Modal, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import { logout, userSign, getPoints } from '@/services/auth/userController';
import { format } from 'date-fns';
//会员
import { Button, Layout } from 'antd';
import { orderController } from '@/services/order/index';
import { userMemberController } from '@/services/auth/index';
import { Flex, QRCode } from 'antd';
import { AlipayOutlined } from '@ant-design/icons';
import './yemian.scss';
export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

// 用户名显示组件
export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.userAccount}</span>;
};

// 自定义样式
const useStyles = createStyles(({ token }) => ({
  action: {
    // display: 'flex',
    height: '48px',
    marginLeft: 'auto',
    overflow: 'hidden',
    alignItems: 'center',
    padding: '0 8px',
    cursor: 'pointer',
    borderRadius: token.borderRadius,
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
}));

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const { styles } = useStyles();
  const { initialState, setInitialState } = useModel('@@initialState');
  //jifen
  //会员
  const [members, setMembers] = useState([]);
  const [qrValue, setQrValue] = useState('');
  const [payNo, setPayNo] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('¥199');
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await userMemberController.listUserMemberByPage({
          current: 1,
          pageSize: 10,
        });
        if (response.code === 0) {
          const memberRecords = response.data.records.map(member => ({
            id: member.id,
            memberType: member.memberType,
            memberPrice: member.memberPrice,
            expirationDate: member.expirationDate,
            memberDescribes: JSON.parse(member.memberDescribes),
          }));
          setMembers(memberRecords);
        }
      } catch (error) {
        console.error('获取会员信息失败:', error);
      }
    };

    fetchMembers();
  }, []);

  const handleClick = async (id: any, price: any, type: any) => {
    try {
      const response = await orderController.generatePayCode({
        orderType: '600001',
        orderDescrip: type,
        totalPrice: Number(price), // 使用传入的价格
        orderDetail: JSON.stringify([{
          shopId: "605001",
          shopType: "开通会员",
          shopName: "会员",
          shopPrice: price, // 使用传入的价格
          shopDetail: {
            收费视频: "解锁",
            AI问答: "无限"
          }
        }]),
        outBusinessId: id, // 使用传入的ID
        orderName: type, // 使用传入的类型
      });
      // await orderController.requestPay({
      //     payNo: String(response.data.payNo)
      // })

      setPayNo(response.data.payNo)
      const payCode = response.data.qrcode; // 根据实际返回结构修改
      setQrValue(payCode);
      setSelectedPrice(`¥${price}`); // 使用传入的价格
    } catch (error) {
      console.error('生成支付代码失败:', error);
    }

  };

  // 定义 PayRecordDto 类型
  interface PayRecordDto {
    payNo?: number;
    orderId?: number;
    totalPrice?: number;
    createTime?: string;
    qrcode?: string;
    outPayNo?: string;
    id?: number;
    outPayChannel?: string;
    paySuccessTime?: string;
    userId?: number;
    orderName?: string;
    status?: string;
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payInfo, setPayInfo] = useState<PayRecordDto | undefined>(undefined); // 用于存储支付信息
  const [twoIsModalOpen, setTwoIsModalOpen] = useState(false);
  const [twoPayInfo, setTwoPayInfo] = useState(null);
  const twoshowModal = () => {
    setTwoIsModalOpen(true);
  };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };
  const twoHandleOk = () => {
    // 确认按钮的逻辑
    setTwoIsModalOpen(false);
  };

  const twoHandleCancel = () => {
    // 取消按钮的逻辑
    setTwoIsModalOpen(false);
  };


  const getResult = async () => {
    try {
      const response = await orderController.payresult({
        payNo: String(payNo), // 确保 payNo 是字符串
      });

      // 检查响应是否包含 status
      if (!response.status || response.status.length === 0) {
        message.error('没有支付请求');
        return;
      }

      // 假设取第一个状态
      const statusCode = response.status; // 取第一个状态的code

      // 根据状态代码返回不同结果
      switch (statusCode) {
        case "601001":
          message.info('未支付');
          break;
        case "601002":
          setPayInfo(response); // 将支付信息保存到状态中
          twoshowModal(); // 打开模态框
          break;
        case "601003":
          message.warning('已退款');
          break;
        default:
          message.error('未知状态');
      }
    } catch (error) {
      message.error('请求出错: ');
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false); // 关闭 modal
  };

  const [points, setPoints] = useState<number | null>(null);

  // 获取积分
  const fetchPoints = async () => {
    try {
      const res = await getPoints();
      if (res.code === 0) {
        setPoints(res.data); // 假设 res.data 是积分值
      } else {
        message.error("获取积分失败");
      }
    } catch (error) {
      message.error("操作失败");
    }
  };

  // 退出登录
  const loginOut = async () => {
    const { search, pathname } = window.location;
    const res = await logout();
    if (res.code === 0) {
      message.success("注销成功")
      window.localStorage.removeItem("referToken")
      window.localStorage.removeItem("token")
      // window.location.reload();
    } else {
      message.error("注销失败")
    }
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }

  };

  // 签到功能
  const getUserSign = async () => {
    const date = new Date();
    const formattedDate = format(date, 'yyyy-MM-dd');

    try {
      const result = await userSign({ date: formattedDate });
      if (result.code === 0 && result.data === true) {
        // message.success("签到失败");
        message.error("请勿重复签到");
      } else {
        // message.error("签到成功");
        message.success("签到成功");
      }
    } catch (error) {
      message.error("操作失败");
    }
  };
  // 会员对话框显示状态
  const [modalVisible, setModalVisible] = useState(false);

  // 打开会员对话框
  const openMemberModal = () => {
    // setModalVisible(true);
    setIsModalOpen(true);
  };

  // 关闭会员对话框
  const closeMemberModal = () => {
    setModalVisible(false);
  };
  // 菜单点击事件处理
  const onMenuClick = useCallback(
    //  const re =  await userController.getPoints()
    //  const jifeng = re.data
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
      } else if (key === 'sign') {
        getUserSign();
      } else if (key === 'jifen') {
        // re.data
      } else if (key === 'become-member') { // 新增的菜单项处理
        // history.push('/order'); // 跳转到成为会员页面
        openMemberModal(); // 点击“成为会员”时打开对话框
      } else if (key === 'become-personal') { // 新增的菜单项处理
        history.push('/Personal'); // 跳转到成为会员页面
      }
    },
    [setInitialState],
  );

  // 加载状态
  const loading = (
    <span className={styles.action}>
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    </span>
  );

  // 确保初始状态已加载
  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  // 确保当前用户已加载
  if (!currentUser || !currentUser.userAccount) {
    return loading;
  }

  // 菜单项
  const menuItems = [
    ...(menu ? [
      {
        key: 'center',
        icon: <UserOutlined />,
        label: '个人中心',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '个人设置',
      },
      { type: 'divider' as const },
    ] : []),
    {
      key: 'sign',
      icon: <ClockCircleOutlined />,
      label: '签到',
    },
    {
      key: 'become-personal', // 新增的菜单项
      icon: <SettingOutlined />, // 可以替换为适合的图标
      label: '个人中心',
    },
    {
      key: 'become-member', // 新增的菜单项
      icon: <SettingOutlined />, // 可以替换为适合的图标
      label: '成为会员',
    },

    {
      key: 'jifen',
      icon: <RiseOutlined />,
      label: `积分: ${points !== null ? points : '加载中...'}`, // 显示积分,
    },

    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];
  // 获取积分
  // useEffect(() => {
  //   fetchPoints();
  // }, [points]);

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
        onMouseEnter={fetchPoints} // 鼠标悬停时触发 fetchPoints
      >
        {children}
      </HeaderDropdown>
      {/* 会员对话框 */}
      <Modal
        title="成为会员"
        visible={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={1200}
      >
        <div
          style={{
            padding: '30px',
            background: 'linear-gradient(to bottom, #efedf8 0%, #fffffd 100%)',
            borderTop: '3px solid #6c6dd9', // 上边框颜色
            borderBottom: '3px solid #6c6dd9', // 下边框颜色，您可以根据需要添加
            borderLeft: '3px solid transparent', // 左边框透明
            borderRight: '3px solid transparent', // 右边框透明
            borderImage: 'linear-gradient(to bottom, #6c6dd9, #ffffff) 1', // 左右边框渐变色
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 下边框阴影效果
            borderRadius: '20px', // 圆角边框
            overflow: 'hidden', // 确保圆角效果生效
          }}
        >
          <div className="subscription-options">
            {members.map(member => (
              <div
                // style={{ background: 'linear-gradient(to bottom, #f7d873 0%, #fce5b1 100%)'}}
                style={{ background: 'linear-gradient(to bottom, #fef5e4 0%, #fce5b1 100%)' }}

                key={member.id} className="option" onClick={() => handleClick(member.id, member.memberPrice, member.memberType)}>
                <div style={{ color: '#7c5e38', fontSize: '16px', fontFamily: '方正粗黑宋简体' }}>{member.memberType}</div>
                <div
                  className="price"
                  style={{ color: '#7c5e38', fontWeight: 'bold' }}
                >¥{member.memberPrice}

                  <span
                    style={{ color: '#545454a6', fontSize: '16px' }}
                  >/{member.expirationDate}</span></div>
                <div className="original-price">¥249</div>
                <div className="daily-price">无限使用</div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: 'linear-gradient(to bottom, #f0eef9 0%, #f8f8fa 100%)',
              borderRadius: '30px', // 圆角边框
            }}>
            <div className="payment-section">
              <Flex gap="middle" wrap >
                {!qrValue && (
                  // <QRCode value={'https://ant.design'} status="active" size={250} />
                  <QRCode value={'https://ant.design'} status="loading" size={250} />
                )}
                {qrValue && (
                  <img src={qrValue} width={250} height={250}>
                  </img>
                )}
                <div className="payment-methods"
                //  style={{marginLeft:'60px'}}
                >
                  支持：<AlipayOutlined style={{ fontSize: '20px', marginRight: '8px' }} />支付宝
                </div>
              </Flex>

              <div className="payment-details">
                <div style={{ fontSize: '14px', textAlign: 'center' }}>实付款：<span className="payment-price">{selectedPrice}</span></div>
                <div
                  style={{ fontSize: '14px', textAlign: 'center' }}
                >扫码即视为同意<a href="#">《会员服务协议》</a></div>
                <Button type="primary" onClick={getResult} style={{ marginTop: '16px', width: '100%' }}>
                  获取结果
                </Button>


                <Modal
                  title="支付结果"
                  open={twoIsModalOpen}  // 修改为 twoIsModalOpen
                  onOk={twoHandleOk}  // 修改为 twoHandleOk
                  onCancel={twoHandleCancel}  // 修改为 twoHandleCancel
                >
                  {payInfo && ( // 仅在有支付信息时渲染内容
                    <>
                      <p>支付编号: {payInfo.payNo}</p>
                      <p>第三方单号: {payInfo.outPayNo}</p>
                      <p>支付平台: {payInfo.outPayChannel}</p>
                      <p>订单名称: {payInfo.orderName}</p>
                      <p>订单 ID: {payInfo.orderId}</p>
                      <p>总价格: ¥{payInfo.totalPrice}</p>
                      <p>创建时间: {payInfo.createTime}</p>
                      <p>支付状态: 已支付</p>
                      <p>支付成功时间: {payInfo.paySuccessTime || '未支付'}</p>
                    </>
                  )}
                </Modal>
              </div>
            </div>
          </div>
        </div>




        <div style={{ display: 'flex', alignItems: 'center', padding: '20px', textAlign: 'center',marginTop:'20px' }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, #7c5e38 0%, transparent 0%, #7c5e38 100%)',
            marginRight: '10px'
          }}></div>
          <span style={{ color: '#ffd700' }}>♦</span>
          <span style={{ color: '#7c5e38', fontSize: '16px', fontFamily: '方正粗黑宋简体' }}>会员权益对比</span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to left, #7c5e38 0%, transparent 0%, #7c5e38 100%)',
            marginLeft: '10px'
          }}></div>
        </div>


        <table className="benefits-table">
          <thead>
            <tr>
              <th style={{ backgroundColor: '#e8eaff' }}>功能权益</th>
              <th>非会员</th>
              <th className="member">会员</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              Object.entries(member.memberDescribes['会员权益']).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>无</td>
                  <td className="member">{value}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>

      </Modal >
    </>

  );
};
