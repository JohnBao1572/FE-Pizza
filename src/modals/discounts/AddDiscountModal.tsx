import { useState } from 'react';
import { Form, Input, InputNumber, Modal, message, DatePicker } from 'antd';
import handleAPI from '../../apis/handleAPI';

interface Props {
    open: boolean;
    onClose: () => void;
    onAddNew: () => void;
}

const AddDiscountModal = ({ open, onClose, onAddNew }: Props) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setIsLoading(true);

            const payload = {
                title: values.title,
                description: values.description,
                code: values.code,
                image: [values.image],
                startAt: values.startAt.toISOString(),
                endAt: values.endAt.toISOString(),
                discountedPrice: Number(values.discountedPrice),
                minOrderValue: Number(values.minOrderValue),
                quantity: Number(values.quantity),
            };

            await handleAPI({
                url: '/discount',
                method: 'post',
                data: payload,
            });

            message.success('Add discount success');
            form.resetFields();
            onAddNew();
            onClose();
        } catch (error) {
            message.error('Add discount failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Add New Discount"
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
                    <Input placeholder="Discount title" />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Code"
                    rules={[{ required: true, message: 'Please enter code' }]}
                >
                    <Input placeholder="DISCOUNT2026" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Image URL"
                    rules={[{ required: true, message: 'Please enter image URL' }]}
                >
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item
                    name="discountedPrice"
                    label="Discounted Price"
                    rules={[{ required: true, message: 'Please enter discounted price' }]}
                >
                    <Input placeholder="50.000" />
                </Form.Item>

                <Form.Item
                    name="minOrderValue"
                    label="Min Order Value"
                    rules={[{ required: true, message: 'Please enter min order value' }]}
                >
                    <Input placeholder="200.000" />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="10" />
                </Form.Item>

                <Form.Item
                    name="startAt"
                    label="Start At"
                    rules={[{ required: true, message: 'Please select start date' }]}
                >
                    <DatePicker style={{ width: '100%' }} showTime />
                </Form.Item>

                <Form.Item
                    name="endAt"
                    label="End At"
                    rules={[{ required: true, message: 'Please select end date' }]}
                >
                    <DatePicker style={{ width: '100%' }} showTime />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddDiscountModal;
