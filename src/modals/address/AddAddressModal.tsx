import { Modal, Form, Input, Checkbox, Button, message, Select, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../../apis/handleAPI';

interface Props {
    onClose: () => void;
    onRefresh: () => void;
}

const AddAddressModal = ({ onClose, onRefresh }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const getProvinces = async () => {
            try {
                const res = await fetch('https://provinces.open-api.vn/api/?depth=1');
                const data = await res.json();
                setProvinces(data);
            } catch (error) {
                console.log(error);
            }
        };
        getProvinces();
    }, []);

    const handleProvinceChange = async (_: string, option: any) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        setDistricts([]);
        setWards([]);
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/${option.key}?depth=2`);
            const data = await res.json();
            setDistricts(data.districts);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDistrictChange = async (_: string, option: any) => {
        form.setFieldsValue({ ward: undefined });
        setWards([]);
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/d/${option.key}?depth=2`);
            const data = await res.json();
            setWards(data.wards);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddAddress = async (values: any) => {
        setIsLoading(true);
        try {
            await handleAPI({
                url: '/address',
                method: 'post',
                data: values,
            });
            message.success('Address added successfully');
            onRefresh();
            onClose();
        } catch (error) {
            message.error('Failed to add address');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Add New Address"
            open={true}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical" form={form} onFinish={handleAddAddress}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="province" label="Province" rules={[{ required: true, message: 'Please select province' }]}>
                            <Select
                                showSearch
                                placeholder="Select Province"
                                onChange={handleProvinceChange}
                                optionFilterProp="children"
                            >
                                {provinces.map((item) => (
                                    <Select.Option key={item.code} value={item.name}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="district" label="District" rules={[{ required: true, message: 'Please select district' }]}>
                            <Select showSearch placeholder="Select District" onChange={handleDistrictChange} optionFilterProp="children">
                                {districts.map((item) => (
                                    <Select.Option key={item.code} value={item.name}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="ward" label="Ward" rules={[{ required: true, message: 'Please select ward' }]}>
                            <Select showSearch placeholder="Select Ward" optionFilterProp="children">
                                {wards.map((item) => (
                                    <Select.Option key={item.code} value={item.name}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="street" label="Street" rules={[{ required: true, message: 'Please enter street' }]}>
                            <Input placeholder="e.g. 57 Vo Van Kiet" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="isDefault" valuePropName="checked">
                    <Checkbox>Set as default address</Checkbox>
                </Form.Item>
                <div className="text-right">
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={isLoading}>Add</Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddAddressModal;