import { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
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

    const columns: ColumnsType<BillModel> = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => <span title={id}>{id.substring(0, 8).toUpperCase()}...</span>,
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

export default MyOrders;