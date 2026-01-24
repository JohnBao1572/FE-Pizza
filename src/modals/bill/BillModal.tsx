import { Modal, Button, Radio, Space, Typography, Divider, message, Input, List, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handleAPI from '../../apis/handleAPI';
import type { AddressModel } from '../../models/AddressModel';


const { Text, Title } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
    selectedItems: any[]; // Merged cart items for display
    selectedIds: string[]; // Raw IDs for API
    totalPrice: number;
    onSuccess: () => void;
}

const BillModal = ({ open, onClose, selectedItems, selectedIds, totalPrice, onSuccess }: Props) => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState<AddressModel[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [discountCode, setDiscountCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            getAddresses();
        }
    }, [open]);

    const getAddresses = async () => {
        try {
            const res: any = await handleAPI({ url: '/address', method: 'get' });
            let addressList: AddressModel[] = [];

            if (res.data && Array.isArray(res.data)) {
                addressList = res.data;
            } else if (Array.isArray(res)) {
                addressList = res;
            }

            // Sort: Default address first
            addressList.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

            setAddresses(addressList);

            // Auto-select default address if available
            const defaultAddr = addressList.find(a => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            } else if (addressList.length > 0) {
                setSelectedAddressId(addressList[0].id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleApplyDiscount = async () => {
        if (!discountCode) return;
        try {
            const res: any = await handleAPI({ url: '/discount', method: 'get' });
            const discounts = res.data || res;
            const discount = Array.isArray(discounts) ? discounts.find((d: any) => d.code === discountCode) : null;

            if (!discount) {
                message.error('Mã giảm giá không hợp lệ');
                setDiscountValue(0);
                return;
            }

            if (discount.quantity <= 0) {
                message.error('Mã giảm giá đã hết lượt sử dụng');
                setDiscountValue(0);
                return;
            }

            if (totalPrice < Number(discount.minOrderValue)) {
                message.error(`Đơn hàng chưa đạt giá trị tối thiểu ${Number(discount.minOrderValue).toLocaleString('vi-VN')}₫`);
                setDiscountValue(0);
                return;
            }

            setDiscountValue(Number(discount.discountedPrice));
            message.success('Áp dụng mã giảm giá thành công');
        } catch (error) {
            console.log(error);
            message.error('Lỗi khi kiểm tra mã giảm giá');
        }
    };

    const handlePayment = async () => {
        if (!selectedAddressId) {
            message.error('Please select an address');
            return;
        }

        setIsLoading(true);
        try {
            const data = {
                cartItemIds: selectedIds,
                addressId: selectedAddressId,
                code: discountCode || undefined
            };

            await handleAPI({
                url: '/bills',
                method: 'post',
                data
            });

            message.success('Order placed successfully!');
            onSuccess();
            onClose();
            navigate('/');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to create order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Checkout"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>Cancel</Button>,
                <Button key="submit" type="primary" loading={isLoading} onClick={handlePayment}>
                    Confirm Payment
                </Button>,
            ]}
            width={700}
        >
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 10 }}>
                {/* 1. Selected Products */}
                <Title level={5}>Selected Products</Title>
                <List
                    dataSource={selectedItems}
                    renderItem={(item: any) => (
                        <List.Item>
                            <List.Item.Meta
                                title={`${item.prod?.title} (x${item.qty})`}
                                description={`${Number(item.totalPrice).toLocaleString('vi-VN')}₫`}
                            />
                        </List.Item>
                    )}
                />
                <div style={{ textAlign: 'right', marginTop: 10 }}>
                    <Text type="secondary">Tạm tính: {totalPrice.toLocaleString('vi-VN')}₫</Text>
                </div>

                <Divider />

                {/* 2. Address Selection */}
                <Title level={5}>Delivery Address</Title>
                {addresses.length > 0 ? (
                    <Radio.Group onChange={(e) => setSelectedAddressId(e.target.value)} value={selectedAddressId} style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {addresses.map(addr => (
                                <Radio key={addr.id} value={addr.id} style={{ border: '1px solid #eee', padding: 10, borderRadius: 8, width: '100%' }}>
                                    <Text strong>{addr.street}, {addr.ward}, {addr.district}, {addr.province}</Text>
                                    {addr.isDefault && <Tag color="green" style={{ marginLeft: 10 }}>Default</Tag>}
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                ) : (
                    <Text type="danger">No address found. Please add an address in your profile.</Text>
                )}

                <Divider />

                {/* 3. Discount Code */}
                <Title level={5}>Discount Code</Title>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <Input
                        placeholder="Enter voucher code (optional)"
                        value={discountCode}
                        onChange={(e) => {
                            setDiscountCode(e.target.value);
                            setDiscountValue(0);
                        }}
                    />
                    <Button type="primary" onClick={handleApplyDiscount}>Áp dụng</Button>
                </div>

                <div style={{ textAlign: 'right', borderTop: '1px solid #eee', paddingTop: 16 }}>
                    <Space direction="vertical" align="end">
                        <Space>
                            <Text>Giảm giá:</Text>
                            <Text type="success">-{discountValue.toLocaleString('vi-VN')}₫</Text>
                        </Space>
                        <Space>
                            <Text strong style={{ fontSize: 18 }}>Tổng thanh toán:</Text>
                            <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                                {(totalPrice - discountValue > 0 ? totalPrice - discountValue : 0).toLocaleString('vi-VN')}₫
                            </Text>
                        </Space>
                    </Space>
                </div>
            </div>
        </Modal>
    );
};

export default BillModal;