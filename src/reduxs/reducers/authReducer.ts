/** @format */

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		data: {
			accessToken: '',
			_id: '',
		},
	},
	reducers: {
		addAuth: (state, action) => {
			state.data = action.payload;
		},
		removeAuth: (state, _action) => {
			state.data = {
				accessToken: '',
				_id: '',
			};
		},
	},
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.data;
