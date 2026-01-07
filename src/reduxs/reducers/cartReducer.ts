import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        data: []
    },
    reducers: {
        syncProducts: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const cartReducer = cartSlice.reducer;
export const { syncProducts } = cartSlice.actions;
export const cartSelector = (state: any) => state.cartReducer.data;
