import axios, { AxiosInstance } from 'axios';
import { getAuthCredentials, removeAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { customToast } from "@/components/ui/customToast";

export const getBaseUrl = (service: string) => {
    const isDevelopment = process.env.NEXT_PUBLIC_APP_ENV === 'development';
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    console.log("getBaseUrlgetBaseUrlgetBaseUrl", service);
    let baseUrl = service == "icr" ? `${process.env.NEXT_PUBLIC_REST_API_ICR_ENDPOINT}/auth` : `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/${service}`;
    if (isDevelopment || isLocalhost) {
        switch (service) {
            case 'project':
                baseUrl = `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/${service}`;
                break;
            case 'icr':
                baseUrl = `${process.env.NEXT_PUBLIC_REST_API_ICR_ENDPOINT}/auth`;
                break;
            default:
                //auth service
                //baseUrl = `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/${service}`;
                baseUrl = `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/${service}`;
                break;
        }
    }

    console.log(`Current environment: ${isDevelopment}`);
    console.log(`Is localhost: ${isLocalhost}`);
    console.log(`Base URL for ${service}: ${baseUrl}`);

    return baseUrl;
};

const createAxiosInstance = (service: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: getBaseUrl(service),
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            const { token } = getAuthCredentials();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Enhanced error logging
            /*console.log('Full error object:', error);
            console.log('Error response:', error.response);
            console.log('Error status:', error.response?.status);
            console.log('Error data:', error.response?.data);*/

            if (error.response) {
                switch (error.response.status) {
                    case 403:
                    case 401:
                        console.log('403 Forbidden error detected:', {
                            status: error.response.status,
                            data: error.response.data,
                            headers: error.response.headers,
                            config: error.config
                        });
                        customToast.error('Access denied. Please log in again.');
                        removeAuthCredentials();
                        if (typeof window !== 'undefined') {
                            window.location.href = Routes.SignIn;
                        }
                        break;
                    case 404:
                        customToast.error(error.response.error || 'Access denied.');
                        if (typeof window !== 'undefined') {
                            window.location.href = Routes.NOT_FOUND_ERROR;
                        }
                        break;
                    default:
                        customToast.error(error.response.data.message || 'An error occurred. Please try again.');
                        break;
                }
            } else if (error.request) {
                console.log('No response error:', error.request);
                customToast.error('No response received from server. Please try again later.');
            } else {
                console.log('Error setup:', error.message);
                customToast.error('An error occurred. Please try again later.');
            }

            if (error.message.includes('Network Error')) {
                console.log('CORS or network error detected:', error.message);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const axiosApi = {
    auth: createAxiosInstance('auth'),
    project: createAxiosInstance('project'),
    icr: createAxiosInstance('icr'),
    // Add more services as needed
};

export default axiosApi;