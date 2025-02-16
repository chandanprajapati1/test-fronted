// Detect XSS payloads in an object
export const isHtmlTagPresent = (objectData: Record<string, any>): boolean => {
    const xssPayloadRegex = /(<[^>]*>|javascript:|on\w+\s*=|&#\d+;|&#x[\da-fA-F]+;|\\x[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|eval\(|prompt\(|alert\(|document\.|window\.|location\.\w+|innerHTML|outerHTML|srcdoc|base64|data:|svg|iframe|style)/gi;

    // Check if any key-value contains XSS payload
    const containsXSS = Object.values(objectData).some((value) => {
        if (typeof value === 'string') {
            return xssPayloadRegex.test(value);
        } else if (typeof value === 'object' && value !== null) {
            return isHtmlTagPresent(value); // Recursive check for nested objects
        }
        return false;
    });

    return containsXSS;
};

// Sanitize an object to remove XSS payloads
export const sanitizationXSSPayload = (input: Record<string, any>): Record<string, any> => {
    const xssPayloadRegex = /(<[^>]*>|javascript:|on\w+\s*=|&#\d+;|&#x[\da-fA-F]+;|\\x[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|eval\(|prompt\(|alert\(|document\.|window\.|location\.\w+|innerHTML|outerHTML|srcdoc|base64|data:|svg|iframe|style)/gi;

    const sanitize = (value: any): any => {
        if (typeof value === 'string') {
            // Replace any XSS pattern found in the string
            return value.replace(xssPayloadRegex, '');
        } else if (typeof value === 'object' && value !== null) {
            // Recursively sanitize nested objects or arrays
            if (Array.isArray(value)) {
                return value.map(sanitize);
            } else {
                const sanitizedObj: Record<string, any> = {};
                Object.entries(value).forEach(([key, val]) => {
                    sanitizedObj[key] = sanitize(val);
                });
                return sanitizedObj;
            }
        }
        return value;
    };

    return sanitize(input);
};
