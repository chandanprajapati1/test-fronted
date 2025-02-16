
'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    projectDetails: null,
};

const projectDetailsSlice = createSlice({
    name: 'projectDetails',
    initialState,
    reducers: {
        appendData: (state, action) => {
            state.projectDetails = action.payload;
        },


    },
});

export const { appendData } = projectDetailsSlice.actions;
export default projectDetailsSlice.reducer;

