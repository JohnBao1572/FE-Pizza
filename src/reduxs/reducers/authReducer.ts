/** @format */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null as null | {
        accessToken: string;
        _id: string;
    }
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		addAuth: (state, action) => {
			state.data = action.payload;
		},
		removeAuth: (state) => {
			state.data = null;
		},
	},
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.data;
