import { Tabs, Typography, Card, Button } from 'antd';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { HomeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Address from '../../../components/user/Address';
import MyOrders from '../../../components/user/MyOrders';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('edit');

    const profileTabs = [
        {
            key: 'address',
            label: 'Address',
            icon: <FaUser size={16} />,
        },
        {
            key: 'orders',
            label: 'My Orders',
            icon: <FaShoppingCart size={16} />,
        },
    ];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f4f6f8',
                padding: '60px 20px',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div style={{ display: 'flex', minHeight: '600px' }}>
                    {/* Sidebar */}
                    {/* <div
                        style={{
                            width: '220px',
                            background: '#fafafa',
                            borderRight: '1px solid #eaeaea',
                            padding: '24px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Tabs
                            style={{ flex: 1 }}
                            tabPosition="left"
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={profileTabs.map(tab => ({
                                key: tab.key,
                                label: (
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </span>
                                ),
                            }))}
                        />
                        <Button
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            block
                        >
                            Home
                        </Button>
                    </div> */}
                    {/* Sidebar */}
                    <div
                        style={{
                            width: '220px',
                            background: '#fafafa',
                            borderRight: '1px solid #eaeaea',
                            padding: '24px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Tabs */}
                        <div style={{ flex: 1 }}>
                            <Tabs
                                tabPosition="left"
                                activeKey={activeTab}
                                onChange={setActiveTab}
                                items={profileTabs.map(tab => ({
                                    key: tab.key,
                                    label: (
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                        </span>
                                    ),
                                }))}
                            />
                        </div>

                        {/* Home button - sidebar footer */}
                        <div
                            style={{
                                paddingTop: '12px',
                                borderTop: '1px solid #eaeaea',
                            }}
                        >
                            <Button
                                icon={<HomeOutlined />}
                                onClick={() => navigate('/')}
                                style={{
                                    width: '100%',
                                    height: '36px',
                                    borderRadius: '6px',
                                    fontWeight: 500,
                                }}
                            >
                                Home
                            </Button>
                        </div>
                    </div>


                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                            padding: '32px 40px',
                            background: '#fff',
                        }}
                    >
                        {activeTab === 'address' && (
                            <>
                                <Typography.Title level={3}>
                                    My Address
                                </Typography.Title>
                                <Address />
                            </>
                        )}

                        {activeTab === 'orders' && (
                            <>
                                <Typography.Title level={3}>
                                    My Orders
                                </Typography.Title>
                                <MyOrders />
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;
