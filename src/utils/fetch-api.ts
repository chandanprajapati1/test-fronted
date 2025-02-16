import { getAuthCredentials, removeAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';

const BASE_URL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

type FetchOptions = RequestInit & {
    headers?: Record<string, string>;
};

const customFetch = async (endpoint: string, options: FetchOptions = {}) => {
    const { token } = getAuthCredentials();

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const config: FetchOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (response.status === 403) {
            // Log out the user
            removeAuthCredentials();

            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = Routes.SignIn;
            }

            throw new Error('Unauthorized access');
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const fetchApi = {
    get: (endpoint: string, options: FetchOptions = {}) =>
        customFetch(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body: any, options: FetchOptions = {}) =>
        customFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint: string, body: any, options: FetchOptions = {}) =>
        customFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint: string, options: FetchOptions = {}) =>
        customFetch(endpoint, { ...options, method: 'DELETE' }),
};

export default fetchApi;