export const validateFile = (file: File, MAX_FILE_SIZE_MB: number, ALLOWED_EXTENSIONS: string[]): { isValid: boolean; error?: string } => {
    // Check file size
    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            isValid: false,
            error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        };
    }

    // Check file extension using the same ALLOWED_EXTENSIONS constant
    const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(fileExt.toLowerCase())) {
        return {
            isValid: false,
            error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
        };
    }

    return { isValid: true };
};