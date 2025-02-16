// store/store.js
'use client'
import { configureStore } from '@reduxjs/toolkit';
import onBoardingReducer from './slices/onBoardingSlice';
import projectDetailsSlice from './slices/projectDetailsSlice';
import projectOnboardingReducer from './slices/projectOnboardingSlice'
import vintageReducer from './slices/vintageManagementSlice'
import addCartSlice from './slices/addCartSlice';
import profileDetailReducer from "@/app/store/slices/profileDetailReducer";


export const store = configureStore({
    reducer: {
        onBoarding: onBoardingReducer,
        projectDetails: projectDetailsSlice,
        projectOnboarding: projectOnboardingReducer,
        vintage: vintageReducer,
        cartLength: addCartSlice,
        profileDetail: profileDetailReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;
