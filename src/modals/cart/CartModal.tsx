import { Modal, List, Image, Typography, Divider, InputNumber, message, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector, syncCart } from "../../reduxs/reducers/cartReducer";
import type { CartItem } from "../../models/CartModel";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";

const { Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
}

type MergedCartItem = CartItem & { itemIds: string[] };

const CartItemRow = ({ item, onRefresh }: { item: MergedCartItem; onRefresh: () => void }) => {
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

    const totalPrice = mergedCart.reduce((sum, item) => {
        return sum + Number(item.totalPrice);
    }, 0);

    const MAX_LIST_HEIGHT = 320;

    return (
        <Modal
            title="Gi? hàng"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            {cartItems.length === 0 ? (
                <Text>Gi? hàng tr?ng</Text>
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
                            renderItem={(item: MergedCartItem) => <CartItemRow item={item} onRefresh={refreshCart} />}
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
                            {totalPrice.toLocaleString('vi-VN')}₫
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CartModal;
