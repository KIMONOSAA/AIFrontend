import React, { useEffect, useState } from 'react';
import { Button, Layout, message, Modal } from 'antd';
import { orderController } from '@/services/order/index';
import { userMemberController } from '@/services/auth/index';
import './yemian.scss';
import { Flex, QRCode } from 'antd';
import { AlipayOutlined } from '@ant-design/icons';

const Master: React.FC = () => {
    const [members, setMembers] = useState([]);
    const [qrValue, setQrValue] = useState('');
    const [payNo, setPayNo] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('¥199');

    // useEffect(() => {
    //     // 检查 sessionStorage 中是否已经存在 'hasRefreshed' 标识
    //     if (!sessionStorage.getItem('hasRefreshed')) {
    //         sessionStorage.setItem('hasRefreshed', 'true'); // 设置标识
    //         window.location.reload(); // 刷新页面
    //     } else {
    //         // 如果已经刷新过，则不再执行刷新
    //         setHasRefreshed(true);
    //     }

    //     // 设置定时器，每30秒刷新一次页面（如果页面没有刷新过）
    //     const intervalId = setInterval(() => {
    //         if (!hasRefreshed) {
    //             sessionStorage.setItem('hasRefreshed', 'true'); // 设置标识
    //             window.location.reload(); // 刷新页面
    //         }
    //     }, 30000); // 每30秒检查一次

    //     // 清理定时器，避免组件卸载时仍然存在定时器
    //     return () => clearInterval(intervalId);
    // }, [hasRefreshed]); // 依赖 hasRefreshed

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
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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
                    showModal(); // 打开模态框
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


    return (
        <Layout style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="container">
                <div className="tabs">
                    <div className="tab active">会员</div>
                </div>
                <div className="subscription-options">
                    {members.map(member => (
                        <div key={member.id} className="option" onClick={() => handleClick(member.id, member.memberPrice, member.memberType)}>
                            <div>{member.memberType}</div>
                            <div className="price">¥{member.memberPrice}<span>/{member.expirationDate}</span></div>
                            <div className="original-price">¥249</div>
                            <div className="daily-price">无限使用</div>
                        </div>
                    ))}
                </div>
                <div className="payment-section">
                    <Flex gap="middle" wrap >
                        {!qrValue && (
                            <QRCode value={'https://ant.design'} status="active" size={250} />
                        )}
                        {qrValue && (
                            <img src={qrValue} width={250} height={250}>
                            </img>
                        )}
                        <Button type="primary" onClick={getResult}>
                            获取结果
                        </Button>
                        <Modal
                            title="支付结果"
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
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
                    </Flex>
                    <div className="payment-details">
                        <div>实付款：<span className="payment-price">{selectedPrice}</span></div>
                        <div>开通前请阅读并同意<a href="#">《会员服务协议》</a></div>
                        <div className="payment-methods">
                            支持：<AlipayOutlined style={{ fontSize: '24px', marginRight: '8px' }} />支付宝
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <span style={{ color: '#ffd700' }}>♦</span> 会员权益对比
                </div>
                <table className="benefits-table">
                    <thead>
                        <tr>
                            <th>功能权益</th>
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
            </div>
        </Layout>
    );
};

export default Master;
