// src/store/slices/vintageManagementSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VintageManagementState {
    activeScreen: 'initial' | 'vintageAvailable' | 'vintageNotAvailable' | 'vintageNotAvailableVintageSelection' | 'priceSelection';
    activeTab: 'initial' | 'SellAll' | 'SellAsPerVintage' | 'SellAsPerSlabs';
    selectedStatus: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: VintageManagementState = {
    activeScreen: 'initial',
    activeTab: 'initial',
    selectedStatus: true,
    isLoading: false,
    error: null,
};

const vintageManagementSlice = createSlice({
    name: 'vintageManagement',
    initialState,
    reducers: {
        setActiveScreen(state, action: PayloadAction<VintageManagementState['activeScreen']>) {
            state.activeScreen = action.payload;
        },
        setActiveTab(state, action: PayloadAction<VintageManagementState['activeTab']>) {
            state.activeTab = action.payload;
        },
        setSelectedStatus(state, action: PayloadAction<boolean>) {
            state.selectedStatus = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const {
    setActiveScreen,
    setActiveTab,
    setSelectedStatus,
    setLoading,
    setError,
} = vintageManagementSlice.actions;

export default vintageManagementSlice.reducer;