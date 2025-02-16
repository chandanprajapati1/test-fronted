import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TabType} from "@/types";


interface ProjectOnboardingState {
    detailStepper: number;
    enrichmentStepper: number;
    managementStepper: number;

    currentStatus: string;
    currentTab: TabType;
    projectTypeId: string;
    projectDetail:object;

    allowedTabs: TabType[];


}

const initialState: ProjectOnboardingState = {
    currentTab: 'details',
    detailStepper: 0,
    enrichmentStepper: 0,
    managementStepper: 0,
    currentStatus: '0',
    projectTypeId: '',
    allowedTabs: ['details'],
    projectDetail: {}
};

const projectOnboardingSlice = createSlice({
    name: 'projectOnboarding',
    initialState,
    reducers: {
        currentTabHandler: (state, action) => {
            if (state.allowedTabs.includes(action.payload)) {
                state.currentTab = action.payload;
            }
        },
        currentProjectDetail: (state, action) => {
            state.projectDetail = action.payload;
        },
        currentStatusHandler: (state, action) => {
            state.currentStatus = action.payload;
        },
        currentTypeHandler: (state, action) => {
            state.projectTypeId = action.payload;
        },
        incrementDetailStepper: (state) => {
            state.detailStepper += 1
        },
        decrementDetailStepper: (state) => {
            state.detailStepper -= 1
        },
        initialEnrichmentStepper: (state, action) => {
            state.enrichmentStepper = action.payload;
        },
        setDetailStepper: (state, action) => {
            state.detailStepper = action.payload;
        },
        incrementEnrichmentStepper: (state) => {
            state.enrichmentStepper += 1
        },
        decrementEnrichmentStepper: (state) => {
            state.enrichmentStepper -= 1
        },
        updateAllowedTabs: (state, action: PayloadAction<{
            isDetailsComplete?: boolean;
            isSpecificationsComplete?: boolean;
            isEnrichmentComplete?: boolean;
        }>) => {
            const { isDetailsComplete, isSpecificationsComplete, isEnrichmentComplete } = action.payload;
            const newAllowedTabs: TabType[] = ['details'];

            if (isDetailsComplete) {
                newAllowedTabs.push('specifications');
            }

            if (isSpecificationsComplete) {
                newAllowedTabs.push('enrichment');
            }

            if (isEnrichmentComplete) {
                newAllowedTabs.push('management');
            }

            state.allowedTabs = newAllowedTabs;
            console.log(newAllowedTabs);
        },
    },
});

export const {
    currentTabHandler,
    initialEnrichmentStepper,
    incrementDetailStepper,
    decrementDetailStepper,
    setDetailStepper,
    incrementEnrichmentStepper,
    decrementEnrichmentStepper,
    currentStatusHandler,
    currentTypeHandler,
    updateAllowedTabs,
    currentProjectDetail
} = projectOnboardingSlice.actions;
export default projectOnboardingSlice.reducer;

