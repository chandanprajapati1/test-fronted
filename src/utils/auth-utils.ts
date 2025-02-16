import Cookie from 'js-cookie';
import {parse} from 'cookie';
import { AUTH_CRED, TOKEN } from "@/utils/constants";

export function setAuthCredentials(token: string, refreshToken: string) {
    Cookie.set(AUTH_CRED, JSON.stringify({ token, refreshToken }),{ 
        // domain: 'example.com', // Restrict to example.com
        sameSite: 'Strict',    // Prevent cross-origin access
        // secure: true,          // Send only over HTTPS
        // expires: 7,            // Set expiration (optional)
     });
}

export function getAuthCredentials(context?: any): {
    token: string | null;
} {
    let authCred;
    if (context) {
        authCred = parseSSRCookie(context)[AUTH_CRED];
    } else {
        authCred = Cookie.get(AUTH_CRED);
    }
    //console.log(authCred);
    if (authCred) {
        return JSON.parse(authCred);
    }
    return { token: null };
}



export function parseSSRCookie(context: any) {
    return parse(context.req.headers.cookie ?? '');
}


export function isAuthenticated(_cookies: any) {
    return (
        !!_cookies[TOKEN]
    );
}

export function removeAuthCredentials() {
    Cookie.remove(AUTH_CRED);
}


