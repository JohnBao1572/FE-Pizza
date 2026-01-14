import { useEffect, useState } from 'react';
import { Button, Image, message, Space, Switch, Table, Tag, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import AddProductModal from '../../../modals/products/AddProductModal';
import UpdateProductModal from '../../../modals/products/UpdateProductModal';
import type { Product } from '../../../models/ProductModel';
import handleAPI from '../../../apis/handleAPI';

const ProductTable = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const getProducts = async () => {
        setIsLoading(true);
        try {
            const res: any = await handleAPI({ url: '/products/getAll', method: 'get' });
            if (res) {
                setProducts(res);
            }
        } catch (error) {
            message.error('Can not get products');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const toggleProductStatus = async (record: Product) => {
        try {
            await handleAPI({
                url: `/products/re/${record.id}`,
                method: 'delete',
                data: {
                    isDeleted: !record.isDeleted,
                },
            });

            message.success(record.isDeleted ? 'Product restored' : 'Product inactivated');
            getProducts();
        } catch (error) {
            message.error('Update product status failed');
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: 80,
            render: (url: string) => (
                <Image
                    src={url}
                    width={50}
                    height={50}
                    preview={false}
                    style={{ objectFit: 'cover', borderRadius: 4, display: 'block' }}
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (val: number) => `$${val}`,
        },
        {
            title: 'Category',
            dataIndex: 'cat',
            key: 'cat',
            width: 160,
            render: (item: any) => (
                <Tag style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item?.title || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            width: 120,
            render: (isDeleted: boolean) =>
                isDeleted ? <Tag color="red">Inactive</Tag> : <Tag color="green">Active</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 140,
            render: (_: any, record: Product) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            ghost
                            onClick={() => {
                                setSelectedProduct(record);
                                setIsUpdateModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={record.isDeleted ? 'Restore' : 'Inactivate'}>
                        <Switch
                            checked={!record.isDeleted}
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                            onChange={() => toggleProductStatus(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ width: '100%', overflowX: 'hidden' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                    Add Product
                </Button>
            </div>

            <Table
                loading={isLoading}
                dataSource={products}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                tableLayout="fixed"
            />

            <AddProductModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddNew={getProducts}
            />

            <UpdateProductModal
                open={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedProduct(null);
                }}
                onUpdate={getProducts}
                product={selectedProduct}
            />
        </div>
    );
};

export default ProductTable;
