import {
  encrypt,
  decrypt,
  SALT_BYTE_SIZE,
  IV_BYTE_SIZE,
} from "../../../utils/aes-gcm.js";
import { PasswordInput } from '../../../components/passwordInput.js';
const { useEffect, useState } = React

const PACKAGE_MODE = {
  prepend: {
    label: 'Prepend salt & IV',
    description: `salt (${SALT_BYTE_SIZE} bytes) + iv (${IV_BYTE_SIZE} bytes) + cipherText`,
    pack: ({ cipherText, iv, salt }) => {
      const encryptedContentArr = new Uint8Array(cipherText);
      let buff = new Uint8Array(
        salt.byteLength + iv.byteLength + encryptedContentArr.byteLength
      );
      buff.set(salt, 0);
      buff.set(iv, salt.byteLength);
      buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
      return buff.buffer;
    },
    unpack: (arrayBuffer) => {
      const encryptedDataBuff = new Uint8Array(arrayBuffer);
      const salt = encryptedDataBuff.slice(0, SALT_BYTE_SIZE);
      const iv = encryptedDataBuff.slice(SALT_BYTE_SIZE, SALT_BYTE_SIZE + IV_BYTE_SIZE);
      return { salt, iv }
    }
  }
}

export const CryptographyGCM = ({
  arrayBuffer,
  children,
}) => {
  const [passphrase, setPassphrase] = useState("");
  const [cryptoInfo, setCryptoInfo] = useState({});
  const [selectedPackageMode, setSelectedPackageMode] = useState(PACKAGE_MODE.prepend);
  const [isKeyExtractable, selectKeyExtractability] = useState(false);

  const encryptAes256 = async (onSuccess) => {
    if (arrayBuffer && passphrase) {
      try {
        const encrypted = await encrypt({
          input: arrayBuffer,
          password: passphrase,
          extractableKey: isKeyExtractable,
        });

        setCryptoInfo(encrypted?.info)
        onSuccess(selectedPackageMode.pack(encrypted));
      } catch(err) {
        console.error('Encryption failed: ', err)
        alert('Encryption failed')
      }
    }
  };

  const decryptAes256 = async (onSuccess) => {
    if (arrayBuffer && passphrase) {
      try {
        const { salt, iv } = selectedPackageMode.unpack(arrayBuffer)
        const decrypted = await decrypt({
          input: arrayBuffer,
          password: passphrase,
          iv,
          salt
        });
        console.log(decrypted);
        onSuccess(decrypted)
      } catch(err) {
        console.error('Decryption failed: ', err)
        alert('Decryption failed')
      }
    }
  };

  return (
    <>
      <div>
        <label htmlFor="input-pass">
          Input passphrase (ex. 123456)
        </label>
        <PasswordInput
          onChange={(e) => setPassphrase(e.target.value)}
          id="input-pass"
        />
      </div>

      <legend>Cryptography</legend>

      <select onChange={e => selectKeyExtractability(e.target.value)} value={isKeyExtractable}>
        <option value={false}>Non-extractable AES key (safe, encrypt-only)</option>
        <option value={true}>Extractable AES key (unsafe, encrypt+decrypt)</option>
      </select>

      {!!cryptoInfo && (
        <>
          <details class="card">
            <summary>Details</summary>
            <div style={{ overflow: 'auto', whiteSpace: 'break-spaces' }}>
              {!!cryptoInfo && JSON.stringify(cryptoInfo, null, 2)}
            </div>
          </details>

          {children({ onEncrypt: encryptAes256, onDecrypt: decryptAes256 })}
        </>
      )}
    </>
  )
}
