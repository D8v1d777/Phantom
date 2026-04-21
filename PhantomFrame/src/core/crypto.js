// src/core/crypto.js

const CryptoModule = (() => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function deriveKey(password, salt) {
        const baseKey = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            baseKey,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    }

    async function encrypt(data, password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const key = await deriveKey(password, salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );

        return {
            salt,
            iv,
            data: new Uint8Array(encrypted)
        };
    }

    async function decrypt(encryptedData, password, salt, iv) {
        const key = await deriveKey(password, salt);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encryptedData
        );

        return new Uint8Array(decrypted);
    }

    return {
        encrypt,
        decrypt
    };
})();