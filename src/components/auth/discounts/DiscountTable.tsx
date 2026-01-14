import { useEffect, useState } from 'react';
import { Button, Image, message, Space, Switch, Table, Tag, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import handleAPI from '../../../apis/handleAPI';
import type { Discount } from '../../../models/DiscountModel';
import AddDiscountModal from '../../../modals/discounts/AddDiscountModal';
import UpdateDiscountModal from '../../../modals/discounts/UpdateDiscountModal';


const DiscountTable = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

    const getDiscounts = async () => {
        setIsLoading(true);
        try {
            const res: any = await handleAPI({
                url: '/discount',
                method: 'get',
            });

            // nếu backend trả { success, data }
            if (res?.data) {
                setDiscounts(res.data);
            } else if (res) {
                setDiscounts(res);
            }
        } catch (error) {
            message.error('Can not get discounts');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDiscounts();
    }, []);

    const toggleDiscountStatus = async (record: Discount) => {
        try {
            await handleAPI({
                url: `/discount/${record.id}`,
                method: 'delete',
            });

            message.success(record.isDeleted ? 'Discount restored' : 'Discount inactivated');
            getDiscounts();
        } catch (error) {
            message.error('Update discount status failed');
            console.log(error);
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (images: string[]) => (
                <Image
                    src={images?.[0]}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (val: string) => <Tag color="blue">{val}</Tag>,
        },
        {
            title: 'Discounted Price',
            dataIndex: 'discountedPrice',
            key: 'discountedPrice',
        },
        {
            title: 'Min Order',
            dataIndex: 'minOrderValue',
            key: 'minOrderValue',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Start At',
            dataIndex: 'startAt',
            key: 'startAt',
            render: (val: string) => new Date(val).toLocaleDateString(),
        },
        {
            title: 'End At',
            dataIndex: 'endAt',
            key: 'endAt',
            render: (val: string) => new Date(val).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (isDeleted: boolean) =>
                isDeleted ? (
                    <Tag color="red">Inactive</Tag>
                ) : (
                    <Tag color="green">Active</Tag>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Discount) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            ghost
                            onClick={() => {
                                setSelectedDiscount(record);
                                setIsUpdateModalOpen(true);
                            }}
                        />
                    </Tooltip>

                    <Tooltip title={record.isDeleted ? 'Restore' : 'Inactivate'}>
                        <Switch
                            checked={!record.isDeleted}
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                            onChange={() => toggleDiscountStatus(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Discount
                </Button>
            </div>

            <Table
                loading={isLoading}
                dataSource={discounts}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <AddDiscountModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddNew={getDiscounts}
            />

            <UpdateDiscountModal
                open={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedDiscount(null);
                }}
                onUpdate={getDiscounts}
                discount={selectedDiscount}
            />
        </div>
    );
};

export default DiscountTable;
