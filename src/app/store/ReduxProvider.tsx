'use client'
import React, {useState} from 'react'
import {Provider} from 'react-redux'
import store from './store'
import {enableMapSet} from 'immer';
import {QueryClient, QueryClientProvider} from "react-query";
import {CustomToastContainer} from "@/components/ui/customToast";

enableMapSet();

const ReduxProvider = ({children}: any) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                {children}
            </Provider>
            <CustomToastContainer />
        </QueryClientProvider>
    )
}

export default ReduxProvider;