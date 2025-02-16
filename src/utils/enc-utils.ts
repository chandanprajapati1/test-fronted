import CryptoJS from "crypto-js";

/**
 * Encrypts the given data using AES encryption.
 * @param data - The plaintext data to encrypt.
 * @param key - The encryption key.
 * @returns The encrypted data as a string.
 */
export function encryptString(data: string, key: string): string {
    try {
        // Convert the key to a WordArray
        const keyWordArray = CryptoJS.enc.Utf8.parse(process.env.FLAG_SERVICE + key + process.env.CLEAR_CACHE);

        // Generate a random IV (Initialization Vector)
        const iv = CryptoJS.lib.WordArray.random(16);

        // Pad the plaintext to be a multiple of the block size
        const padding = 16 - (data.length % 16);
        const padText = data + String.fromCharCode(padding).repeat(padding);

        // Encrypt the padded plaintext using AES in CFB mode
        const encrypted = CryptoJS.AES.encrypt(padText, keyWordArray, {
            iv: iv,
            mode: CryptoJS.mode.CFB,
            padding: CryptoJS.pad.NoPadding
        });

        // Concatenate IV and ciphertext
        const encryptedData = iv.concat(encrypted.ciphertext);

        // Base64 encode the encrypted data for safe transmission
        const encodedData = CryptoJS.enc.Base64.stringify(encryptedData);

        return encodedData;
    } catch (error) {
        return "";
    }

    
    
}

/**
 * Decrypts the given encrypted data using AES decryption.
 * @param encryptedData - The encrypted data to decrypt.
 * @param key - The encryption key.
 * @returns The decrypted plaintext data.
 */
export function decryptString(data: string, key: string): string {
    try {
        // Convert the key to a WordArray
        const keyWordArray = CryptoJS.enc.Utf8.parse(process.env.FLAG_SERVICE + key + process.env.CLEAR_CACHE);

        // Decode the Base64 encoded data
        const encryptedData = CryptoJS.enc.Base64.parse(data);

        // Extract the IV (first 16 bytes)
        const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4), 16);

        // Extract the encrypted text (remaining bytes)
        const ciphertext = CryptoJS.lib.WordArray.create(
            encryptedData.words.slice(4),
            encryptedData.sigBytes - 16
        );

        // Create a valid CipherParams object
        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: ciphertext
        });

        // Decrypt the ciphertext using AES in CFB mode
        const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWordArray, {
            iv: iv,
            mode: CryptoJS.mode.CFB,
            padding: CryptoJS.pad.NoPadding
        });

        // Convert decrypted WordArray to string
        const paddedText = decrypted.toString(CryptoJS.enc.Utf8);

        // Remove padding (last byte value indicates padding length)
        const padding = paddedText.charCodeAt(paddedText.length - 1);
        const plainText = paddedText.slice(0, -padding);

        return plainText;
    } catch (err) {
        return "";
    }
}
