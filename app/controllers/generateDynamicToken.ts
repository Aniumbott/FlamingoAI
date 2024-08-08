import crypto from "crypto";

function generateRandomValue(message:string, salt:string, nonce:string) {
    const combined = nonce + message + salt;
    const hmac = crypto.createHmac("sha256", salt);
    hmac.update(combined);
    const digest = hmac.digest("hex");
    return digest;
  }
  
function generateRandomText(unixValue: number) {
    const unixString = unixValue.toString();
    let randomText = "";
  
    for (let i = 0; i < unixString.length; i++) {
      randomText += unixString[i];
      for (let j = 0; j < 5; j++) {
        randomText += Math.floor(Math.random() * 10).toString();
      }
    }
  
    return randomText;
  }
  
export function generateDynamicToken() {
    const salt = process.env.NEXT_PUBLIC_TOKEN_SALT || "";
    const message = process.env.NEXT_PUBLIC_TOKEN_MESSAGE || "";
  
    const unixTime = Math.floor(Date.now() / 1000);
    const randomTextValue6 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      Math.random().toString(36).substring(2)
    );
    const signature = generateRandomValue(message, salt, randomTextValue6);
    const timestamp = generateRandomText(unixTime);
  
    const randomTextValue1 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      randomTextValue6
    );
    const randomTextValue2 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      randomTextValue6
    );
    const randomTextValue3 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      randomTextValue6
    );
    const randomTextValue4 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      randomTextValue6
    );
    const randomTextValue5 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      randomTextValue6
    );
    const randomTextValue7 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      randomTextValue6
    );
    const randomTextValue8 = generateRandomValue(
      Math.random().toString(36).substring(2),
      salt,
      randomTextValue6
    );
  
    return `${randomTextValue1}.${randomTextValue2}.${randomTextValue3}.${signature}.${randomTextValue4}.${randomTextValue5}.${timestamp}.${randomTextValue6}.${randomTextValue7}.${randomTextValue8}`;
  }
  