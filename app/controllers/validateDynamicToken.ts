import { createHmac, timingSafeEqual } from 'crypto';

function decryptMessageWithHash(message: string, salt: string) {
    const hmacGenerator = createHmac('sha256', salt);
    hmacGenerator.update(message);
    return hmacGenerator.digest('hex');
  }
  
export function validateDynamicToken(dynamicToken: string) {
    try {
      const encryptedValues = dynamicToken.split('.');
      const nonce = encryptedValues[7];
      const encryptedMessage = encryptedValues[3];
      const encryptedTimestamp = encryptedValues[6].split('').filter((_, i) => i % 6 === 0).join('');
  
      const decryptedMessage = decryptMessageWithHash(nonce + process.env.NEXT_PUBLIC_TOKEN_MESSAGE + process.env.NEXT_PUBLIC_TOKEN_SALT, process.env.NEXT_PUBLIC_TOKEN_SALT as string);
      const timestamp = parseInt(encryptedTimestamp, 10);
  
      const expiryTime = Math.floor(Date.now() / 1000) - 20;
  
      // Check if the token's timestamp is within the allowed time range
      if (timestamp < expiryTime) {
        throw new Error("Token has expired");
      }
  
      // Securely compare the computed signature with the client's signature
      if (!timingSafeEqual(Buffer.from(encryptedMessage), Buffer.from(decryptedMessage))) {
        throw new Error("Invalid signature");
      }
  
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
}