import { useQuery } from 'react-query';
import { API_ENDPOINTS } from "@/config/api-endpoint";
import axiosApi from "@/utils/axios-api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { profileDetail } from "@/app/store/slices/profileDetailReducer";
import { getAuthCredentials } from "@/utils/auth-utils";

export const useMeQuery = (enabled: boolean = true) => {
    const dispatch = useDispatch();

    return useQuery<any, Error>(
        [API_ENDPOINTS.ME],
        () => {
            const { token } = getAuthCredentials();
            if (!token) {
                return Promise.reject(new Error('No token found'));
            }
            return userClient.me();
        },
        {
            enabled,
            retry: (failureCount, error) => {
                // Don't retry on authentication errors (403, 401)
                if (axios.isAxiosError(error)) {
                    return ![403, 401].includes(error.response?.status ?? 0);
                }
                // Retry up to 2 times for other errors
                return failureCount < 2;
            },
            staleTime: 3600000,
            cacheTime: 3600000,
            onSuccess: (response: any) => {
                const userData = response.data.data;
                dispatch(profileDetail(userData));
            },
            onError: (err: any) => {
                if (axios.isAxiosError(err)) {
                    console.error('Error fetching user data:', err);
                }
            },
        }
    );
};

// User API client
const userClient = {
    me: () => {
        return axiosApi.auth.get<any>(API_ENDPOINTS.ME);
    },
};