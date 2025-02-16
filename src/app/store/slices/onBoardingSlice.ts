
'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showOnBoarding: false,
};

const onBoardingSlice = createSlice({
    name: 'onBoarding',
    initialState,
    reducers: {
        show: (state) => {
            state.showOnBoarding = true;
        },
        hide: (state) => {
            state.showOnBoarding = false;
        },
    },
});

export const { show, hide } = onBoardingSlice.actions;
export default onBoardingSlice.reducer;

