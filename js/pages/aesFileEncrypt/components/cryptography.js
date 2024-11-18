import { CryptographyCBC } from './cryptography-cbc.js';
import { CryptographyGCM } from './cryptography-gcm.js';
const { useEffect, useState } = React

const CRYPTO_ALGO = {
  GCM: {
    code: 'aes256-gcm',
    label: 'AES256-GCM',
  },
  CBC: {
    code: 'aes256-cbc',
    label: 'AES256-CBC',
  },
}

export const Cryptography = (props) => {
  const {
    file,
    onFileEncrypt: onFileEncryptProp,
    onFileDecrypt: onFileDecryptProp,
  } = props
  const [selectedAlgo, selectAlgo] = useState(CRYPTO_ALGO.GCM.code);
  const [fileArrayBuffer, setFileArrayBuffer] = useState(null)

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = async function () {
      setFileArrayBuffer(reader.result)
    };
    reader.readAsArrayBuffer(file);
  }, [file])

  const onFileEncrypt = (buffer, ...args) => {
    const newFile = new File([new Blob([buffer], { type: 'text/plain' })], `encrypted-${file.name}`);
    onFileEncryptProp(newFile, ...args)
  }

  const onFileDecrypt = (buffer, ...args) => {
    const newFile = new File([new Blob([buffer], { type: 'text/plain' })], `decrypted-${file.name}`);
    onFileEncryptProp(newFile, ...args)
  }

  let CryptoComponent = '';
  if (selectedAlgo === CRYPTO_ALGO.GCM.code) {
    CryptoComponent = CryptographyGCM
  } else if (selectedAlgo === CRYPTO_ALGO.CBC.code) {
    CryptoComponent = CryptographyCBC
  }

  return (
    <fieldset style={{ minWidth: 0 }}>
      <legend>Cryptography</legend>

      <select onChange={e => selectAlgo(e.target.value)} value={selectedAlgo}>
        <option value={CRYPTO_ALGO.GCM.code}>{CRYPTO_ALGO.GCM.label}</option>
        <option value={CRYPTO_ALGO.CBC.code}>{CRYPTO_ALGO.CBC.label}</option>
      </select>

      {!!fileArrayBuffer && (
        <CryptoComponent arrayBuffer={fileArrayBuffer}>
          {({ onEncrypt, onDecrypt }) => (
            <div>
              <button
                type="button"
                onClick={() => onEncrypt((newFile) => onFileEncrypt(newFile, 'save'))}
              >
                Encrypt & Save
              </button>
              <button
                type="button"
                onClick={() => onEncrypt((newFile) => onFileEncrypt(newFile, 'edit'))}
              >
                Encrypt & Edit
              </button>
              <button
                type="button"
                onClick={() => onDecrypt((newFile) => onFileDecrypt(newFile, 'save'))}
              >
                Decrypt & Save
              </button>
              <button
                type="button"
                onClick={() => onDecrypt((newFile) => onFileDecrypt(newFile, 'edit'))}
              >
                Decrypt & Edit
              </button>
            </div>
          )}
        </CryptoComponent>
      )}
    </fieldset>
  )
}
