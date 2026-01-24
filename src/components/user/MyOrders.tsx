import { useEffect, useState } from 'react';
import { Table, Tag, message, Button, Popconfirm, Space, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import handleAPI from '../../apis/handleAPI';
import type { BillModel } from '../../models/BillModel';

const MyOrders = () => {
    const [bills, setBills] = useState<BillModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getBills = async () => {
        setIsLoading(true);
        try {
            const res: any = await handleAPI({
                url: '/bills',
                method: 'get',
            });

            // Xử lý dữ liệu trả về tùy theo cấu trúc response
            if (res.data) {
                setBills(res.data);
            } else if (Array.isArray(res)) {
                setBills(res);
            }
        } catch (error) {
            message.error('Cannot get orders');
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
            message.success('Đã xóa đơn hàng');
            getBills();
        } catch (error) {
            message.error('Không thể xóa đơn hàng');
            console.error(error);
        }
    };

    const columns: ColumnsType<BillModel> = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            width: '15%',
            key: 'id',
            render: (id: string) => <span title={id}>{id.substring(0, 8).toUpperCase()}...</span>,
        },
        {
            title: 'Products',
            dataIndex: 'cart',
            width: '35%',
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
            width: '15%',
            key: 'TotalPrices',
            render: (price: number | string) =>
                <span style={{ fontWeight: 'bold' }}>
                    {Number(price).toLocaleString('vi-VN')}₫
                </span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
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
            width: '15%',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Actions',
            width: '10%',
            key: 'actions',
            render: (_: any, record: BillModel) => (
                <Space>
                    <Tooltip title="Xóa đơn hàng">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button icon={<DeleteOutlined />} danger ghost />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ width: '100%' }}>
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

export default MyOrders;