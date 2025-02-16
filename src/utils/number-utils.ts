export const formatNumber = (num:any, decimalPlaces = 2) => {
    const numValue = typeof num !== 'number' ? Number(num) : num;

    // Return formatted string or 0.00 if invalid
    return !isNaN(numValue)
        ? numValue.toLocaleString('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        })
        : '0.00';
};