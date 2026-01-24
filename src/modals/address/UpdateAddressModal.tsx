import { Modal, Form, Input, Checkbox, Button, message, Select, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import type { AddressModel } from '../../models/AddressModel';


interface Props {
    address: AddressModel;
    onClose: () => void;
    onRefresh: () => void;
}

const UpdateAddressModal = ({ address, onClose, onRefresh }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const initData = async () => {
            try {
                // 1. Fetch Provinces
                const resP = await fetch('https://provinces.open-api.vn/api/?depth=1');
                const dataP = await resP.json();
                setProvinces(dataP);

                // 2. Find current province code to fetch districts
                const currentProvince = dataP.find((p: any) => p.name === address.province);
                if (currentProvince) {
                    const resD = await fetch(`https://provinces.open-api.vn/api/p/${currentProvince.code}?depth=2`);
                    const dataD = await resD.json();
                    setDistricts(dataD.districts);

                    // 3. Find current district code to fetch wards
                    const currentDistrict = dataD.districts.find((d: any) => d.name === address.district);
                    if (currentDistrict) {
                        const resW = await fetch(`https://provinces.open-api.vn/api/d/${currentDistrict.code}?depth=2`);
                        const dataW = await resW.json();
                        setWards(dataW.wards);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        initData();
        form.setFieldsValue(address);
    }, [address, form]);

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

    const handleUpdateAddress = async (values: any) => {
        setIsLoading(true);
        try {
            await handleAPI({
                url: `/address/${address.id}`,
                method: 'put',
                data: values,
            });
            message.success('Address updated successfully');
            onRefresh();
            onClose();
        } catch (error) {
            message.error('Failed to update address');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Update Address"
            open={true}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical" form={form} onFinish={handleUpdateAddress}>
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
                        <Form.Item name="street" label="Street" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="isDefault" valuePropName="checked">
                    <Checkbox>Set as default address</Checkbox>
                </Form.Item>
                <div className="text-right">
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={isLoading}>Update</Button>
                </div>
            </Form>
        </Modal>
    );
};

export default UpdateAddressModal;