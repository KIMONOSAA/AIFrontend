export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' },
    { path: '/user/register', name: "注册", component: './User/Logout' }],
  },
  { path: '/', redirect: '/master' },
  { path: '/master', name: '首页', icon: 'HomeOutlined', component: './master' },
  { path: '/course/:courseId', component: './course' },
  { path: '/home', name: '对话问答', icon: 'CodepenCircleFilled', component: './Home' },
  { path: '/VideoAIManager', name: '视频管理平台', icon: 'SettingFilled', component: './VideoAIManager' },
  { path: '/order',  component: './order' },
  { path: '/practice/:teacherId', icon: 'RiseOutlined', component: './practice' },
  { path: '/Personal', component: './Personal' },
   {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },

];
