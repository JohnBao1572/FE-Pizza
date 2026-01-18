// import { Modal, List, Image, Typography } from "antd";
// import { useSelector } from "react-redux";
// import { cartSelector } from "../../reduxs/reducers/cartReducer";
// import type { CartItem } from "../../models/CartModel";

// const { Text } = Typography;

// interface Props {
//     open: boolean;
//     onClose: () => void;
// }

// const CartModal = ({ open, onClose }: Props) => {
//     const cartItems = useSelector(cartSelector) || [];

//     return (
//         <Modal
//             title="Giỏ hàng"
//             open={open}
//             onCancel={onClose}
//             footer={null}
//         >
//             {cartItems.length === 0 ? (
//                 <Text>Giỏ hàng trống</Text>
//             ) : (
//                 <List
//                     itemLayout="horizontal"
//                     dataSource={cartItems}
//                     renderItem={(item: CartItem) => (
//                         <List.Item>
//                             <List.Item.Meta
//                                 avatar={
//                                     <Image
//                                         width={60}
//                                         src={Array.isArray(item.prod.image) ? item.prod.image[0] : item.prod.image}
//                                     />
//                                 }
//                                 title={item.prod.title}
//                                 description={
//                                     <>
//                                         <Text>Số lượng: {item.qty}</Text><br />
//                                         <Text strong>
//                                             {Number(item.totalPrice).toLocaleString('vi-VN')}₫
//                                         </Text>
//                                     </>
//                                 }
//                             />
//                         </List.Item>
//                     )}
//                 />
//             )}
//         </Modal>
//     );
// };

// export default CartModal;
