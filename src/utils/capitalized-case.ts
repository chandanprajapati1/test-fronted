function toCapitalizedCase(text: string): string {
    return text
        .toLowerCase() // Convert the entire text to lowercase first
        .split(' ')    // Split the text into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');    // Join the words back into a single string
}

export default toCapitalizedCase;