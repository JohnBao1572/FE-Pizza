import { Modal, List, Image, Typography, Divider, InputNumber, message, Button, Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector, syncCart } from "../../reduxs/reducers/cartReducer";
import type { CartItem } from "../../models/CartModel";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import BillModal from "../bill/BillModal";

const { Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
}

type MergedCartItem = CartItem & { itemIds: string[] };

const CartItemRow = ({ item, onRefresh, isSelected, onSelect }: {
    item: MergedCartItem;
    onRefresh: () => void;
    isSelected: boolean;
    onSelect: (ids: string[], checked: boolean) => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [quantity, setQuantity] = useState(item.qty);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        setQuantity(item.qty);
    }, [item.qty]);

    const handleUpdateQuantity = () => {
        if (quantity === item.qty || isConfirming) return;

        setIsConfirming(true);
        Modal.confirm({
            title: "Xác nhận",
            content: `Bạn có muốn thay đổi số lượng thành ${quantity}?`,
            onOk: async () => {
                try {
                    const promises = [];

                    // Update the main item
                    promises.push(handleAPI({
                        url: `/carts/${item.id}`,
                        method: "patch",
                        data: { qty: quantity },
                    }));

                    // Delete other items if they exist (cleanup merged items)
                    if (item.itemIds && item.itemIds.length > 1) {
                        const idsToDelete = item.itemIds.filter(id => id !== item.id);
                        idsToDelete.forEach(id => {
                            promises.push(handleAPI({
                                url: `/carts/${id}`,
                                method: "delete",
                            }));
                        });
                    }

                    await Promise.all(promises);
                    message.success("Cập nhật số lượng thành công");
                    onRefresh();
                } catch (error) {
                    message.error("Cập nhật thất bại");
                    setQuantity(item.qty);
                } finally {
                    setIsConfirming(false);
                }
            },
            onCancel: () => {
                setQuantity(item.qty);
                setIsConfirming(false);
            },
        });
    };

    const handleDelete = () => {
        if (isConfirming) return;
        setIsConfirming(true);
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const promises = item.itemIds.map((id) =>
                        handleAPI({
                            url: `/carts/${id}`,
                            method: "delete",
                        })
                    );
                    await Promise.all(promises);
                    message.success("Đã xóa sản phẩm");
                    onRefresh();
                } catch (error) {
                    message.error("Xóa thất bại");
                } finally {
                    setIsConfirming(false);
                }
            },
            onCancel: () => {
                setIsConfirming(false);
            },
        });
    };

    return (
        <List.Item
            extra={
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Checkbox checked={isSelected} onChange={(e) => onSelect(item.itemIds, e.target.checked)} />
                </div>
            }
            actions={[
                <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                />
            ]}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                if (quantity !== item.qty) {
                    handleUpdateQuantity();
                }
            }}
        >
            <List.Item.Meta
                avatar={
                    <Image
                        width={60}
                        src={
                            Array.isArray(item.prod?.image)
                                ? item.prod.image[0]
                                : item.prod?.image
                        }
                    />
                }
                title={item.prod?.title}
                description={
                    isHovered ? (
                        <div className="flex items-center gap-3 mt-2">
                            <span className="font-medium">Số lượng:</span>
                            <InputNumber
                                min={1}
                                value={quantity}
                                onChange={(val) => setQuantity(val || 1)}
                                onPressEnter={handleUpdateQuantity}
                            />
                        </div>
                    ) : (
                        <>
                            <Text>Số lượng: {item.qty}</Text>
                            <br />
                            <Text strong>
                                Giá: {Number(item.totalPrice).toLocaleString("vi-VN")}₫
                            </Text>
                        </>
                    )
                }
            />
        </List.Item>
    );
};

const CartModal = ({ open, onClose }: Props) => {
    const cartItems = useSelector(cartSelector) as CartItem[] || [];
    const dispatch = useDispatch();
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);

    const refreshCart = async () => {
        try {
            const res: any = await handleAPI({
                url: "/carts",
                method: "get",
            });
            const cartList = res.data?.data || res.data || res;
            dispatch(syncCart(Array.isArray(cartList) ? cartList : []));
        } catch (error) {
            console.log("Không thể load cart");
        }
    };

    const mergedCart = Object.values(
        cartItems.reduce((acc: Record<string, MergedCartItem>, item) => {
            const prodId = item.prod?.id;
            if (!prodId) return acc;

            if (!acc[prodId]) {
                acc[prodId] = { ...item, itemIds: [item.id] };
            } else {
                acc[prodId].qty += item.qty;
                acc[prodId].totalPrice =
                    Number(acc[prodId].totalPrice) +
                    Number(item.totalPrice);
                acc[prodId].itemIds.push(item.id);
            }

            return acc;
        }, {} as Record<string, MergedCartItem>)
    );

    // Calculate total based on SELECTED items
    const totalSelectedPrice = mergedCart.reduce((sum, item) => {
        // Check if any of this item's IDs are in the selected list
        const isSelected = item.itemIds.some(id => selectedItemIds.includes(id));
        return isSelected ? sum + Number(item.totalPrice) : sum;
    }, 0);

    const MAX_LIST_HEIGHT = 320;

    const handleSelect = (ids: string[], checked: boolean) => {
        if (checked) {
            setSelectedItemIds(prev => [...prev, ...ids]);
        } else {
            setSelectedItemIds(prev => prev.filter(id => !ids.includes(id)));
        }
    };

    const handleCheckout = () => {
        if (selectedItemIds.length === 0) {
            message.warning("Vui lòng chọn sản phẩm để thanh toán");
            return;
        }
        // Close cart modal logic is handled by parent usually, but here we open BillModal on top
        setIsBillModalOpen(true);
    };

    return (
        <Modal
            title="Gi? hàng"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {cartItems.length === 0 ? (
                <Text>Giỏ hàng trong</Text>
            ) : (
                <>
                    <div
                        style={{
                            maxHeight: MAX_LIST_HEIGHT,
                            overflowY: "auto",
                            paddingRight: 8,
                        }}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={mergedCart}
                            renderItem={(item: MergedCartItem) => (
                                <CartItemRow
                                    item={item}
                                    onRefresh={refreshCart}
                                    isSelected={item.itemIds.every(id => selectedItemIds.includes(id))}
                                    onSelect={handleSelect}
                                />
                            )}
                        />
                    </div>

                    {/* Line Black */}
                    <Divider style={{ borderColor: "#000" }} />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 8,
                        }}
                    >
                        <Text strong>Tổng cộng</Text>
                        <Text strong style={{ fontSize: 16 }}>
                            {totalSelectedPrice.toLocaleString('vi-VN')}₫
                        </Text>
                    </div>

                    <Button
                        type="primary"
                        block
                        style={{ marginTop: 16 }}
                        onClick={handleCheckout}
                        disabled={selectedItemIds.length === 0}
                    >
                        Thanh toán ({selectedItemIds.length} sản phẩm)
                    </Button>
                </>
            )}

            {isBillModalOpen && (
                <BillModal
                    open={isBillModalOpen}
                    onClose={() => setIsBillModalOpen(false)}
                    selectedItems={mergedCart.filter(item => item.itemIds.some(id => selectedItemIds.includes(id)))}
                    selectedIds={selectedItemIds}
                    totalPrice={totalSelectedPrice}
                    onSuccess={() => {
                        refreshCart();
                        setSelectedItemIds([]);
                        onClose(); // Close cart as well
                    }}
                />
            )}
        </Modal>
    );
};

export default CartModal;
