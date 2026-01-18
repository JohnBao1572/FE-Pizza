import { createSlice } from '@reduxjs/toolkit';
import type { CartItem } from '../../models/CartModel';


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        data: [] as CartItem[]
    },
    reducers: {
        syncCart: (state, action) => {
            state.data = action.payload;
        },
        addToCart: (state, action) => {
            const newItem = action.payload;
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (dựa vào ID sản phẩm)
            const index = state.data.findIndex((item) => item.prod.id === newItem.prod.id);

            if (index !== -1) {
                // Nếu đã tồn tại, cập nhật lại item đó (số lượng mới, giá mới từ backend trả về)
                state.data[index] = newItem;
            } else {
                // Nếu chưa tồn tại, thêm mới vào mảng
                state.data.push(newItem);
            }
        }
    },
});

export const cartReducer = cartSlice.reducer;
export const { syncCart, addToCart } = cartSlice.actions;
export const cartSelector = (state: any) => state.cartReducer.data;
