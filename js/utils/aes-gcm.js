// based on: https://github.com/bradyjoslin/webcrypto-example/blob/master/script.js
export const SALT_BYTE_SIZE = 16;
export const IV_BYTE_SIZE = 12

const buff_to_base64 = (buff) => btoa(
  new Uint8Array(buff).reduce(
    (data, byte) => data + String.fromCharCode(byte), ''
  )
);

const base64_to_buf = (b64) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(null));

const getPasswordKey = (password) =>
  window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

const deriveKey = (passwordKey, salt, keyUsage, extractableKey) =>
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    extractableKey,
    keyUsage
  );

/*
  secretData: ArrayBuffer,
  password: plaintext,
*/
export async function encrypt({ input: secretData, password, extractableKey = false }) {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(SALT_BYTE_SIZE)); // 128-bit salt
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_BYTE_SIZE));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, extractableKey ? ["encrypt", "decrypt"] : ["encrypt"], extractableKey);


    // cipherText is ArrayBuffer
    const cipherText = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        tagLength: 128,
      },
      aesKey,
      secretData
    );

    const cipherTextWithoutAuthTag = cipherText.slice(0, cipherText.byteLength - 16);
    const authTag = cipherText.slice(cipherText.byteLength - 16);
    let aesKeyExtracted = 'non-extractable key'
    if (extractableKey) {
      aesKeyExtracted = await window.crypto.subtle.exportKey("jwk", aesKey)
      aesKeyExtracted = JSON.stringify(aesKeyExtracted)
    }
    window.aeskey = aesKey 
    return {
      info: {
        aesKeyExtracted,
        cipherText_base64: buff_to_base64(cipherText),
        cipherTextWithoutAuthTag: buff_to_base64(cipherTextWithoutAuthTag),
        authTag: buff_to_base64(authTag),//new Uint8Array(authTag),
        salt_base64: buff_to_base64(salt.buffer),
        iv_base64: buff_to_base64(iv.buffer),
      },
      cipherText,
      iv,
      salt,
    };


  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
}


export async function decrypt({ input: encryptedData, password, salt, iv }) {
  try {
    const encryptedDataBuff = encryptedData;
    const data = encryptedDataBuff.slice(SALT_BYTE_SIZE + IV_BYTE_SIZE);
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
        tagLength: 128,
      },
      aesKey,
      data
    );
    return decryptedContent;
  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
}
