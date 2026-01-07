import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import handleAPI from '../../apis/handleAPI';
import type { Category } from '../../models/CategoryModel';

interface Props {
    onClose: () => void;
    onRefresh: () => void;
}

const AddCategoryModal = ({ onClose, onRefresh }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        parentId: '',
    });

    useEffect(() => {
        getParentCategories();
    }, []);

    const getParentCategories = async () => {
        try {
            const res: any = await handleAPI({
                url: '/categories/getAll',
                method: 'get',
            });
            if (res) setCategories(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleSave = async () => {
        if (!formData.title) {
            alert('Vui lòng nhập tiêu đề (Title)');
            return;
        }

        setIsLoading(true);
        try {
            // Xử lý payload: nếu parentId rỗng thì không gửi hoặc gửi null tùy backend
            // Dựa trên DTO, parentId là optional.
            const payload: any = {
                title: formData.title,
                description: formData.description,
            };

            if (formData.parentId) {
                payload.parentId = formData.parentId;
            }

            await handleAPI({
                url: '/categories/create', // Giả định đường dẫn API dựa trên getAll
                method: 'post',
                data: payload,
            });

            alert('Tạo Category thành công!');
            onRefresh(); // Load lại bảng dữ liệu
            onClose();   // Đóng modal
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Có lỗi xảy ra khi tạo mới');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold text-gray-800">Thêm mới Category</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tiêu đề..."
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mô tả..."
                            rows={3}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={formData.parentId}
                            onChange={(e) => handleChange('parentId', e.target.value)}
                        >
                            <option value="">-- Chọn danh mục cha --</option>
                            {categories.map((item) => (
                                <option key={item.id} value={item.id}>{item.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-2 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {isLoading ? 'Đang lưu...' : 'Lưu lại'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryModal;