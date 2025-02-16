
'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profileDetails: null,
};

const profileDetailsSlice = createSlice({
    name: 'profileDetails',
    initialState,
    reducers: {
        profileDetail: (state, action) => {
            state.profileDetails = action.payload;
        },
    },
});

export const { profileDetail } = profileDetailsSlice.actions;
export default profileDetailsSlice.reducer;

