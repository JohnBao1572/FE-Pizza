import { createSlice } from '@reduxjs/toolkit';
import type { CartItem } from '../../models/CartModel';


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        data: [] as CartItem[]
    },
    reducers: {
        syncCart: (state, action) => {
            state.data = Array.isArray(action.payload) ? action.payload : [];
        },
        addToCart: (state, action) => {
            const newItem = action.payload;
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (dựa vào ID sản phẩm)
            // Thêm ?. để tránh lỗi crash nếu newItem.prod chưa có dữ liệu
            const index = state.data.findIndex(
                (item) => item.prod?.id === newItem.prod?.id
            );

            if (index !== -1) {
                // 🔴 FIX: cộng dồn số lượng + giá
                state.data[index].qty += newItem.qty;
                state.data[index].totalPrice =
                    Number(state.data[index].totalPrice) +
                    Number(newItem.totalPrice);
            } else {
                // Nếu chưa tồn tại, thêm mới vào mảng
                state.data.push(newItem);
            }
        }
    },
});

export const cartReducer = cartSlice.reducer;
export const { syncCart, addToCart } = cartSlice.actions;
export const cartSelector = (state: any) =>
    state.cartReducer?.data || [];