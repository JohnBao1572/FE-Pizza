import { useEffect, useState } from 'react';
import { Button, message, Space, Table, Tag, Tooltip, Modal, Form, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import handleAPI from '../../../apis/handleAPI';
import type { BillModel } from '../../../models/BillModel';

const BillTable = () => {
    const [bills, setBills] = useState<BillModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBill, setEditingBill] = useState<BillModel | null>(null);
    const [form] = Form.useForm();

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

    const handleUpdateStatus = async (values: any) => {
        try {
            await handleAPI({
                url: `/bills/${editingBill?.id}`,
                method: 'patch',
                data: values,
            });
            message.success('Bill status updated');
            setIsModalOpen(false);
            getBills();
        } catch (error) {
            message.error('Failed to update bill status');
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
                    case 'delivery': color = 'cyan'; break;
                    case 'delivered': color = 'green'; break;
                    case 'completed': color = 'green'; break;
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
                            onClick={() => {
                                setEditingBill(record);
                                form.setFieldsValue({ status: record.status });
                                setIsModalOpen(true);
                            }}
                        />
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
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Update Bill Status"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="delivery">Delivery</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BillTable;