// A service for client-side encryption using the browser's SubtleCrypto API.

class CryptoService {
  private salt = new TextEncoder().encode('maitri-salt-static-for-demo'); // In a real app, this should be unique per user.
  private iterations = 100000;

  // Derives a key from a password using PBKDF2.
  private async deriveKey(password: string): Promise<CryptoKey> {
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.salt,
        iterations: this.iterations,
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypts a string of text using a password.
  async encryptData(text: string, password: string): Promise<string> {
    const key = await this.deriveKey(password);
    const encodedText = new TextEncoder().encode(text);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedText
    );

    // Combine IV and encrypted data for storage, then base64 encode.
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    return this.uint8ArrayToBase64(combined);
  }

  // Decrypts a base64 encoded string using a password.
  async decryptData(base64Encrypted: string, password: string): Promise<string> {
    const key = await this.deriveKey(password);
    const combined = this.base64ToUint8Array(base64Encrypted);
    
    if (combined.length < 12) {
        throw new Error("Invalid encrypted data: too short to contain IV.");
    }
    
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  }

  private uint8ArrayToBase64(array: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, Array.from(array)));
  }
  
  private base64ToUint8Array(base64: string): Uint8Array {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }
}

export const cryptoService = new CryptoService();
