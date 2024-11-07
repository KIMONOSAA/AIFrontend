import { Footer } from '@/components';

import { checkVerificationEmail, getLoginUser, getPublishEvent, register } from '@/services/auth/userController';
import {
  AlipayCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  PlusOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Button, Flex, GetProp, Space, Tabs, Upload, UploadFile, UploadProps, message, Input } from 'antd';
import { createStyles } from 'antd-style';
import React, { ChangeEvent, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'umi';
import Settings from '../../../../config/defaultSettings';

//555
// import {ProFormTextPassword} from "@ant-design/pro-form"



type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  // const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isUserRegister, setIsUserRegister] = useState<boolean>(false);
  const [isUserEventEmail, setIsUserEventEmail] = useState<boolean>(false);
  const [isUserVerification, setIsUserVerification] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [userEmail, setUserEmail] = useState<string>('')
  const [tempUserId, setTempUserId] = useState<number | null>(null)
  const [type, setType] = useState<string>('account');
  const [inputChange, setInputChange] = useState<string>()
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();


  // const [fileList, setFileList] = useState([]);
  // const [isUserEventEmail, setIsUserEventEmail] = useState(false);
  // const [fileList, setFileList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [email, setEmail] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [fileList, setFileList] = useState([]);
  // const [formdata, setFormdata] = useState(new FormData());
  // const history = history(); // 获取历史对象
  const [isAgreementChecked, setIsAgreementChecked] = useState(false); // 新增状态

  const handleChange = ({ fileList }) => {
    setFileList(fileList);

    // if (fileList[0]?.originFileObj) {
    //   newFormData.append('file', fileList[0].originFileObj);
    // }
    // setFormdata(newFormData); // 更新 formdata
  };

  const handleGetCaptcha = async () => {
    const formdata = new FormData();
    // 更新 formdata
    formdata.append('email', email);
    formdata.append('userAccount', userAccount);
    formdata.append('userPassword', userPassword);
    formdata.append('confirmPassword', confirmPassword);
    if (fileList[0]?.originFileObj) {
      formdata.append('file', fileList[0].originFileObj);
    }
    // console.log('FormData:', [...formdata]);

    // 调用 register 接口
    const registerResult = await register(formdata);
    setUserId(null);
    if (registerResult.code === 0) {
      const newUserId = registerResult.data;
      setUserId(newUserId); // 更新状态

      setIsUserEventEmail(true);
      await getPublishEvent({ id: newUserId, email: email }); // 使用 newUserId
      // console.log("用户 ID:", Number(newUserId)); // 使用 newUserId
      // console.log("用户 email:", email);
      //   id?: number;
      // email?: string;
      message.success("获取成功");

    } else {
      message.error(registerResult.message || "注册失败");
    }
  };

  // 提交注册
  const handleSubmit = async (values) => {
    if (!values.autoLogin) {
      message.error('请先勾选“点击同意协议”才能登录！');
      return;
    }
    if (!captchaCode || !userId) {
      message.error("请先输入验证码并获取用户 ID");
      return;
    }
    // console.log("tij用户 ID:", userId);
    // console.log("tij用户 email:", email);
    // console.log("tij用户 captchaCode:", captchaCode);


    const verificationResult = await checkVerificationEmail({
      code: captchaCode,
      userId: userId,
      email: email,
    });

    if (verificationResult.code === 0) {
      message.success("注册成功");
      history.push('/user/login'); // 注册成功后跳转到登录页面
    } else {
      message.error("验证码错误或已过期");
    }
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </button>
  );
  // const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{ searchConfig: { submitText: '注册' }
          // ,
          // submitButtonProps: {
          //   disabled: !isAgreementChecked, // 只有勾选后才能提交
          // },
        }}
          
          logo={<img alt="logo" src="/logo2.svg" />}
          title="AI GPT"
          subTitle="打造专属于你的 AI GPT"
          onFinish={handleSubmit}
        >
          <Upload
            name="userAvatar"
            listType="picture-circle"
            fileList={fileList}
            onChange={handleChange}
            style={{ margin: 50 }}
          >
            {fileList.length >= 1 ? null : <Button>上传头像</Button>}
          </Upload>

          <ProFormText
            name="userAccount"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder="请输入用户名"
            rules={[{ required: true, message: '用户名是必填项！' }]}
            onChange={(e) => setUserAccount(e.target.value)} // 存储用户名
          />
          <ProFormText
            name="email"
            fieldProps={{ size: 'large', prefix: <MailOutlined /> }}
            placeholder="请输入电子邮件"
            rules={[{ required: true, message: '邮箱是必填项！' }]}
            onChange={(e) => setEmail(e.target.value)} // 存储邮箱
          />
          <ProFormText.Password
            name="userPassword"
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            placeholder="密码: 必须大于12位以上包含字母数字"
            rules={[{ required: true, message: '密码是必填项！' }]}
            onChange={(e) => setUserPassword(e.target.value)} // 存储密码
          />
          <ProFormText.Password
            name="confirmPassword"
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            placeholder="密码: 必须大于12位以上包含字母数字"
            rules={[{ required: true, message: '密码是必填项！' }]}
            onChange={(e) => setConfirmPassword(e.target.value)} // 存储确认密码
          />

          <ProFormCaptcha
            fieldProps={{ size: 'large', prefix: <CheckCircleOutlined />}}
            captchaProps={{ size: 'large' }}
            placeholder="请输入验证码"
            name="captcha"
            // rules={[{ required: true, message: '邮箱账号是必填项！' }]}
            onGetCaptcha={handleGetCaptcha} // 获取验证码时调用
            rules={[{ required: true, message: '验证码是必填项！' }]}
            onChange={(e) => setCaptchaCode(e.target.value)} // 存储密码
          />
           <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox 
            noStyle 
            name="autoLogin" 
            // onChange={(e) => setIsAgreementChecked(e.target.checked)} // 记录协议勾选状态
          >
            点击同意协议
          </ProFormCheckbox>

            <Link
              style={{
                float: 'right',
                marginRight: '20px',
              }}
              to={'/user/login'}
            >
              登录
            </Link>
            
          </div>
        </LoginForm>

      </div>
      <Footer />
    </div>
  );
};
export default Login;
