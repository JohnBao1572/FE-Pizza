import { useEffect, useState } from 'react';
import { Button, message, Space, Table, Tag, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import handleAPI from '../../../apis/handleAPI';
import type { BillModel } from '../../../models/BillModel';

const BillTable = () => {
    const [bills, setBills] = useState<BillModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getBills = async () => {
        setIsLoading(true);
        try {
            const res: any = await handleAPI({
                url: '/bills',
                method: 'get',
            });

            if (res.data) {
                setBills(res.data);
            } else if (Array.isArray(res)) {
                setBills(res);
            }
        } catch (error) {
            message.error('Cannot get bills');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getBills();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await handleAPI({
                url: `/bills/${id}`,
                method: 'delete',
            });
            message.success('Bill deleted');
            getBills();
        } catch (error) {
            message.error('Failed to delete bill');
            console.error(error);
        }
    };

    const columns: ColumnsType<BillModel> = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => <span title={id}>{id.substring(0, 8).toUpperCase()}...</span>,
        },
        {
            title: 'Customer',
            dataIndex: 'addedBy',
            key: 'addedBy',
            render: (user: any) => user?.email || 'Guest',
        },
        {
            title: 'Products',
            dataIndex: 'cart',
            key: 'cart',
            render: (cart: any[]) => (
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {cart?.map((item: any) => (
                        <li key={item.id} style={{ listStyleType: 'circle' }}>
                            {item.prod?.title || 'Product'} <span style={{ color: '#888' }}>(x{item.qty})</span>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Total Price',
            dataIndex: 'TotalPrices',
            key: 'TotalPrices',
            render: (price: number | string) =>
                <span style={{ fontWeight: 'bold' }}>
                    {Number(price).toLocaleString('vi-VN')}₫
                </span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                switch (status?.toLowerCase()) {
                    case 'pending': color = 'orange'; break;
                    case 'confirm': color = 'blue'; break;
                    case 'shipping': color = 'cyan'; break;
                    case 'delivered': color = 'green'; break;
                    case 'cancelled': color = 'red'; break;
                    default: color = 'default';
                }
                return <Tag color={color}>{status?.toUpperCase() || 'UNKNOWN'}</Tag>;
            },
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: BillModel) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            ghost
                            onClick={() => message.info('Tính năng đang phát triển')}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete this bill?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button icon={<DeleteOutlined />} danger ghost />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                loading={isLoading}
                dataSource={bills}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 7 }}
            />
        </div>
    );
};

export default BillTable;