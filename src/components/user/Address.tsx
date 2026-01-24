import { useEffect, useState } from 'react';
import { Button, message, Space, Table, Tag, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import handleAPI from '../../apis/handleAPI';
import AddAddressModal from '../../modals/address/AddAddressModal';
import UpdateAddressModal from '../../modals/address/UpdateAddressModal';
import type { AddressModel } from '../../models/AddressModel';

const Address = () => {
    const [addresses, setAddresses] = useState<AddressModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(null);

    const getAddresses = async () => {
        setIsLoading(true);
        try {
            const res: any = await handleAPI({
                url: '/address',
                method: 'get',
            });

            // Based on the provided JSON structure: { success: true, data: [...] }
            if (res && res.data) {
                setAddresses(res.data);
            } else if (Array.isArray(res)) {
                setAddresses(res);
            }
        } catch (error) {
            message.error('Can not get addresses');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAddresses();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await handleAPI({
                url: `/address/${id}`,
                method: 'delete',
            });
            message.success('Address deleted');
            getAddresses();
        } catch (error) {
            message.error('Failed to delete address');
            console.error(error);
        }
    };

    const columns: ColumnsType<AddressModel> = [
        {
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
        },
        {
            title: 'Ward',
            dataIndex: 'ward',
            key: 'ward',
        },
        {
            title: 'District',
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: 'Province',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: 'Default',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render: (isDefault: boolean) =>
                isDefault ? <Tag color="green">Default</Tag> : <Tag color="default">No</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AddressModel) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            ghost
                            onClick={() => setSelectedAddress(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete this address?"
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                    Add Address
                </Button>
            </div>

            <Table
                loading={isLoading}
                dataSource={addresses}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />

            {isAddModalOpen && (
                <AddAddressModal
                    onClose={() => setIsAddModalOpen(false)}
                    onRefresh={getAddresses}
                />
            )}

            {selectedAddress && (
                <UpdateAddressModal
                    address={selectedAddress}
                    onClose={() => setSelectedAddress(null)}
                    onRefresh={getAddresses}
                />
            )}
        </div>
    );
};

export default Address;