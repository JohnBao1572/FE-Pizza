import { useEffect, useState } from 'react';
import { Button, message, Space, Switch, Table, Tag, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Category } from '../../../models/CategoryModel';
import AddCategoryModal from '../../../modals/category/AddCategoryModal';
import UpdateCategoryModal from '../../../modals/category/UpdateCategoryModal';
import handleAPI from '../../../apis/handleAPI';

const CategoryTable = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const getCategories = async () => {
        setIsLoading(true);
        try {
            const res: any = await handleAPI({
                url: '/categories/getAll',
                method: 'get',
            });

            if (res) {
                setCategories(res);
            }
        } catch (error) {
            message.error('Can not get categories');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    // ✅ Toggle soft delete
    const toggleCategoryStatus = async (record: Category) => {
        try {
            await handleAPI({
                url: `/categories/delete/${record.id}`,
                method: 'delete',
                data: {
                    isDeleted: !record.isDeleted,
                },
            });

            message.success(record.isDeleted ? 'Category active' : 'Category inactivated');
            getCategories();
        } catch (error) {
            message.error('Update category status failed');
            console.error(error);
        }
    };

    const columns: ColumnsType<Category> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Parent Category',
            dataIndex: 'parent',
            key: 'parent',
            render: (parent: any) => {
                if (!parent) return '—';

                if (typeof parent === 'object') return parent.title;

                if (typeof parent === 'string') {
                    const found = categories.find((c) => c.id === parent);
                    return found?.title || '—';
                }

                return '—';
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val: string) => new Date(val).toLocaleDateString(),
        },
        {
            title: 'Added By',
            dataIndex: 'addedBy',
            key: 'addedBy',
            render: (user: any) => user?.email || '—',
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
            render: (_: any, record: Category) => (
                <Space>
                    {/* Edit */}
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            ghost
                            onClick={() => {
                                setSelectedCategory(record);
                                // setIsUpdateModalOpen(true);
                            }}
                        />
                    </Tooltip>

                    {/* Active / Inactive */}
                    <Tooltip title={record.isDeleted ? 'Restore' : 'Inactivate'}>
                        <Switch
                            checked={!record.isDeleted}
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                            onChange={() => toggleCategoryStatus(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Add button */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                    Add Category
                </Button>
            </div>

            {/* Table */}
            <Table
                loading={isLoading}
                dataSource={categories}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            {/* Add Modal */}
            {isAddModalOpen && (
                <AddCategoryModal
                    onClose={() => setIsAddModalOpen(false)}
                    onRefresh={getCategories}
                />
            )}

            {/* Update Modal */}
            {selectedCategory && (
                <UpdateCategoryModal
                    category={selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                    onRefresh={getCategories}
                />
            )}
        </div>
    );
};

export default CategoryTable;
