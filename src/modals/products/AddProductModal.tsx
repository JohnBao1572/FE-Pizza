import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import handleAPI from '../../apis/handleAPI';

interface Props {
    open: boolean;
    onClose: () => void;
    onAddNew: () => void;
}

const AddProductModal = ({ open, onClose, onAddNew }: Props) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            getCategories();
        }
    }, [open]);

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
            console.log('RAW VALUES FROM FORM:', values);

            // const payload = {
            //     ...values,
            //     image: [values.image],
            //     catId: values.catId
            // };
            // console.log('Payload: ', payload);
            setIsLoading(true);
            await handleAPI({
                url: '/products/create',
                method: 'post',
                data: values,
            });
            message.success('Add product success');
            form.resetFields();
            onAddNew();
            onClose();
        } catch (error: any) {
            message.error('Add product failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Add New Product"
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
                    name="catId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                >
                    <Select placeholder="Select category">
                        {categories.map((cat) => (
                            <Select.Option key={cat.id} value={String(cat.id)}>
                                {cat.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* <Form.Item
                    name="catId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                >
                    <Select
                        placeholder="Select category"
                        optionFilterProp="label"
                        options={categories.map((cat) => ({
                            label: cat.title,
                            value: cat.id,
                        }))}
                    />
                </Form.Item> */}

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter price' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Price" />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Quantity" />
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

export default AddProductModal;