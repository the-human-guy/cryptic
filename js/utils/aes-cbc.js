// based on: https://github.com/bradyjoslin/webcrypto-example/blob/master/script.js
export const SALT_BYTE_SIZE = 16;
export const IV_BYTE_SIZE = 16

const getPasswordKey = (password) =>
  window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

const deriveKey = (passwordKey, salt, keyUsage) =>
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-CBC", length: 256 },
    false,
    keyUsage
  );

/*
  secretData: ArrayBuffer,
  password: plaintext,
*/
export async function encrypt({ input: secretData, password }) {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(SALT_BYTE_SIZE)); // 128-bit salt
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_BYTE_SIZE));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);

    // cipherText is ArrayBuffer
    const cipherText = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv,
      },
      aesKey,
      secretData
    );

    // todo: return obj w/ iv, authTag, salt and cipherText
    // todo: using ui selectors let the user control how they'd like their stuff packaged.
    // crypto.subtle.encrypt already appends authTag at the end of the ciphertext (last 16 bytes)
    // as seen in the code below.

    // extract the cipherTextWithoutAuthTag and authTag
    // const cipherTextWithoutAuthTag = encryptedContent.slice(0, encryptedContent.byteLength - 16);
    // const authTag = encryptedContent.slice(encryptedContent.byteLength - 16);
   
    return {
      // cipherText: new Uint8Array(ciphertext),
      // cipherTextWithoutAuthTag,
      // authTag: new Uint8Array(authTag),
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
    const encryptedDataBuff = new Uint8Array(encryptedData);
    const data = encryptedDataBuff.slice(SALT_BYTE_SIZE + IV_BYTE_SIZE);
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv,
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
