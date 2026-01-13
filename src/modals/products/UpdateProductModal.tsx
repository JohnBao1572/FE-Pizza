import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import handleAPI from '../../apis/handleAPI';
import type { Product } from '../../models/ProductModel';

interface Props {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    product: Product | null;
}

const UpdateProductModal = ({ open, onClose, onUpdate, product }: Props) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            getCategories();
        }
    }, [open]);

    useEffect(() => {
        if (product && open) {
            form.setFieldsValue({
                title: product.title,
                price: product.price,
                image: product.image,
                description: product.description,
                cat: product.cat?.id, 
            });
        }
    }, [product, open, form]);

    const getCategories = async () => {
        try {
            const res: any = await handleAPI({ url: '/categories/getAll', method: 'get' });
            if (res) setCategories(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setIsLoading(true);
            const payload = {
                title: values.title ?? product?.title,
                price: values.price ?? product?.price,
                image: values.image ?? product?.image,
                description: values.description ?? product?.description,
                cat: values.cat ?? product?.cat?.id,
            };
            console.log('Payload: ', payload);
            await handleAPI({
                url: `/products/up/${product?.id}`,
                method: 'patch',
                data: payload,
            });
            message.success('Update product success');
            onUpdate();
            onClose();
        } catch (error) {
            message.error('Update product failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Update Product"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={isLoading}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter title' }]}
                >
                    <Input placeholder="Product title" />
                </Form.Item>

                <Form.Item
                    name="cat"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                >
                    <Select placeholder="Select category">
                        {categories.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter price' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Price" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Image URL"
                    rules={[{ required: true, message: 'Please enter image URL' }]}
                >
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProductModal;