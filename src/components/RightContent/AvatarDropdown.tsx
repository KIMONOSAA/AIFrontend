import { ClockCircleOutlined, LogoutOutlined, RiseOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { message, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import { logout, userSign,getPoints } from '@/services/auth/userController';
import { format } from 'date-fns';

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
    display: 'flex',
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
      if (result.code === 0 && result.data=== true) {
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
        history.push('/order'); // 跳转到成为会员页面
      }else if (key === 'become-personal') { // 新增的菜单项处理
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
  );
};
