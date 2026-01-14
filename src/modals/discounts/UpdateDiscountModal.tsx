import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, message, DatePicker } from 'antd';
import handleAPI from '../../apis/handleAPI';
import type { Discount } from '../../models/DiscountModel';
import dayjs from 'dayjs';

interface Props {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    discount: Discount | null;
}

const UpdateDiscountModal = ({ open, onClose, onUpdate, discount }: Props) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (discount && open) {
            form.setFieldsValue({
                title: discount.title,
                code: discount.code,
                image: discount.image?.[0],
                discountedPrice: discount.discountedPrice,
                minOrderValue: discount.minOrderValue,
                quantity: discount.quantity,
                startAt: dayjs(discount.startAt),
                endAt: dayjs(discount.endAt),
                description: discount.description,
            });
        }
    }, [discount, open, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setIsLoading(true);

            const payload = {
                title: values.title ?? discount?.title,
                code: values.code ?? discount?.code,
                image: values.image ? [values.image] : discount?.image,
                discountedPrice:
                    values.discountedPrice !== undefined
                        ? Number(values.discountedPrice)
                        : Number(discount?.discountedPrice),

                minOrderValue:
                    values.minOrderValue !== undefined
                        ? Number(values.minOrderValue)
                        : Number(discount?.minOrderValue),

                quantity:
                    values.quantity !== undefined
                        ? Number(values.quantity)
                        : Number(discount?.quantity),
                startAt: values.startAt ? values.startAt.toISOString() : discount?.startAt,
                endAt: values.endAt ? values.endAt.toISOString() : discount?.endAt,
                description: values.description ?? discount?.description,
            };

            await handleAPI({
                url: `/discount/${discount?.id}`,
                method: 'patch',
                data: payload,
            });

            message.success('Update discount success');
            onUpdate();
            onClose();
        } catch (error) {
            message.error('Update discount failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Update Discount"
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

export default UpdateDiscountModal;
