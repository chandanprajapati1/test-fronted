
'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cart_value: 0,
};

const addCartSlice = createSlice({
    name: 'projectDetails',
    initialState,
    reducers: {
        addcart: (state, action) => {
            state.cart_value = action.payload;
        },
        increasecart: (state) => {
            state.cart_value += 1;
        },


    },
});


export const { addcart, increasecart } = addCartSlice.actions;
export default addCartSlice.reducer;

