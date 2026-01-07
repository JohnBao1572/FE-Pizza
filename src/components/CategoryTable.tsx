import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import handleAPI from '../apis/handleAPI';
import type { Category } from '../models/CategoryModel';
import AddCategoryModal from '../modals/category/AddCategoryModal';
import UpdateCategoryModal from '../modals/category/UpdateCategoryModal';

const CategoryTable = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        setIsLoading(true);
        try {
            const res: any = await handleAPI({
                url: '/categories/getAll',
                method: 'get',
            });
            // axiosClient interceptor đã trả về res.data.data (mảng categories)
            // console.log(res);
            if (res) {
                setCategories(res);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await handleAPI({
                    url: `/categories/delete/${categoryToDelete.id}`,
                    method: 'delete',
                });
                setCategoryToDelete(null);
                getCategories();
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (isLoading) return <div className="text-center p-4">Loading...</div>;


    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Parent Category</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                            <th scope="col" className="px-6 py-3">Added By</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</td>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4">
                                    {item.parent && typeof item.parent === 'object'
                                        ? item.parent.title
                                        : typeof item.parent === 'string'
                                            ? categories.find((c) => c.id === item.parent)?.title
                                            : ''}
                                </td>
                                <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{item.addedBy?.email}</td>
                                <td className="px-6 py-4">
                                    {item.isDeleted ? (
                                        <span className="text-red-500 font-medium">Inactive</span>
                                    ) : (
                                        <span className="text-green-500 font-medium">Active</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-4">
                                        {/* Edit */}
                                        <button
                                            onClick={() => setSelectedCategory(item)}
                                            className="text-blue-600 hover:text-blue-800 transition"
                                            title="Sửa"
                                        >
                                            <FaEdit size={18} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => !item.isDeleted && setCategoryToDelete(item)}
                                            disabled={item.isDeleted}
                                            title={item.isDeleted ? 'Đã bị xóa' : 'Xóa'}
                                            className={`
                                                    transition
                                                    ${item.isDeleted
                                                    ? 'text-gray-300 cursor-not-allowed opacity-50'
                                                    : 'text-red-600 hover:text-red-800'}
                                             `}
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AddCategoryModal
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={getCategories}
                />
            )}

            {selectedCategory && (
                <UpdateCategoryModal
                    category={selectedCategory}
                    onClose={() => setSelectedCategory(undefined)}
                    onRefresh={getCategories}
                />
            )}

            {categoryToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Do you want to delete this category</h3>
                        <p className="mb-6 text-gray-600">Are you sure about that <span className="font-semibold">{categoryToDelete.title}</span> không?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setCategoryToDelete(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Không
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryTable;