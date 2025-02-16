import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const headers = request.headers;
    
    // 1. Ensure the request is not targeting static chunk files with a POST method.
    if (url.pathname.startsWith('/_next/static/chunks')) {
        const contentLength = headers.get('content-length');
        if(request.method !== 'GET'){
            return NextResponse.json(
                { error: 'Method Not Allowed for Static Files' },
                { status: 405 }
            );
        }
        else if (contentLength && (isNaN(Number(contentLength)) || parseInt(contentLength, 10) <= 0)) {
            return NextResponse.json(
                { error: 'Invalid Content-Length Header' },
                { status: 400 }
            );
        }
    }
    const response = NextResponse.next();

    const connectCsp = `http://localhost:8080 http://localhost:8081 https://pm9qldeztk.execute-api.ap-south-1.amazonaws.com http://api.auth.staging.envr.earth https://maps.googleapis.com https://app.carbonregistry.com https://*.hscollectedforms.net https://*.hs-analytics.net https://*.hs-banner.com https://*.hs-scripts.com https://*.hubspot.com`;
    const styleCsp = `${connectCsp} https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com`;
    const scriptCsp = `${connectCsp} https://cdnjs.cloudflare.com`;
    const imageCsp = `${connectCsp} https://flagsapi.com https://d2610zgxadw35n.cloudfront.net https://maps.gstatic.com`;
    const fontCsp = `${connectCsp} https://cdnjs.cloudflare.com https://fonts.gstatic.com`;
    const frameCSP = `${connectCsp}`;
    // **Content Security Policy (CSP)**
    response.headers.set(
        'Content-Security-Policy', 
        `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${scriptCsp}; style-src 'self' 'unsafe-inline' data: ${styleCsp}; img-src 'self' data: ${imageCsp}; connect-src 'self' ${connectCsp}; font-src 'self' data: ${fontCsp}; frame-src 'self' ${frameCSP}; frame-ancestors 'self';`.replace(/\s+/g, " "), // Remove unnecessary whitespace
    );

    // **X-XSS-Protection**: Mitigates some cross-site scripting (XSS) attacks
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // **X-Content-Type-Options**: Prevents MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // **X-Frame-Options**: Prevents clickjacking attacks
    response.headers.set('X-Frame-Options', 'DENY');

    // **Strict-Transport-Security (HSTS)**: Enforces HTTPS
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // **Referrer-Policy**: Controls the amount of referrer information sent with requests
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // **Permissions-Policy**: Controls access to browser features
    response.headers.set(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=(), fullscreen=(self), payment=(), interest-cohort=()'
    );

    // **Cross-Origin Resource Policy (CORP)**: Limits cross-origin resource sharing
    // cross-origin || cross-origin
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    // **Cache-Control**: Prevents sensitive information from being cached
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    // **Access-Control-Allow-Origin**: Restricts which origins can access your resources
    // response.headers.set('Access-Control-Allow-Origin', '*');

    // **Access-Control-Allow-Methods**: Specifies allowed HTTP methods for CORS
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // **Access-Control-Allow-Headers**: Defines allowed headers for CORS
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // **Access-Control-Max-Age**: Specifies how long CORS preflight responses can be cached
    response.headers.set('Access-Control-Max-Age', '86400');

    // Preventing Federated Learning of Cohorts (FLoC)
    response.headers.set('Permissions-Policy', 'interest-cohort=()');

    return response;
}
