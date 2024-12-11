import * as gcm from '../../../utils/aes-gcm.js'
import * as cbc from '../../../utils/aes-cbc.js'

import { PasswordInput } from '../../../components/password-input.js'
const { useState } = React

const getPackageMode = (utils) => ({
  prepend: {
    label: 'Prepend salt & IV',
    description: `salt (${utils.SALT_BYTE_SIZE} bytes) + iv (${utils.IV_BYTE_SIZE} bytes) + cipherText`,
    pack: ({ cipherText, iv, salt }) => {
      const encryptedContentArr = new Uint8Array(cipherText)
      let buff = new Uint8Array(
        salt.byteLength + iv.byteLength + encryptedContentArr.byteLength,
      )
      buff.set(salt, 0)
      buff.set(iv, salt.byteLength)
      buff.set(encryptedContentArr, salt.byteLength + iv.byteLength)

      return buff.buffer
    },
    unpack: (arrayBuffer) => {
      const encryptedDataBuff = new Uint8Array(arrayBuffer)
      const salt = encryptedDataBuff.slice(0, utils.SALT_BYTE_SIZE)
      const iv = encryptedDataBuff.slice(
        utils.SALT_BYTE_SIZE,
        utils.SALT_BYTE_SIZE + utils.IV_BYTE_SIZE,
      )
      return { salt, iv }
    },
  },
})

// mode = 'cbc' | 'gcm'
export const CryptographyAES = ({ mode = 'gcm', arrayBuffer, children }) => {
  const utils = mode === 'gcm' ? gcm : cbc
  const [passphrase, setPassphrase] = useState('')
  const [cryptoInfo, setCryptoInfo] = useState(null)
  const [selectedPackageMode, selectPackageMode] = useState(
    getPackageMode(utils)?.prepend,
  )
  const [isKeyExtractable, selectKeyExtractability] = useState(false)

  const encryptAes256 = async (onSuccess) => {
    if (arrayBuffer && passphrase) {
      try {
        const encrypted = await utils.encrypt({
          input: arrayBuffer,
          password: passphrase,
          extractableKey: isKeyExtractable,
        })

        setCryptoInfo(encrypted?.info)
        onSuccess(selectedPackageMode.pack(encrypted))
      } catch (err) {
        console.error('Encryption failed: ', err)
        alert('Encryption failed')
      }
    }
  }

  const decryptAes256 = async (onSuccess) => {
    if (arrayBuffer && passphrase) {
      try {
        const { salt, iv } = selectedPackageMode.unpack(arrayBuffer)
        const decrypted = await utils.decrypt({
          input: arrayBuffer,
          password: passphrase,
          iv,
          salt,
        })
        console.log(decrypted)
        onSuccess(decrypted)
      } catch (err) {
        console.error('Decryption failed: ', err)
        alert('Decryption failed')
      }
    }
  }

  return (
    <>
      <div>
        <label htmlFor='input-pass'>Input passphrase (ex. 123456)</label>
        <PasswordInput
          onChange={(e) => setPassphrase(e.target.value)}
          id='input-pass'
        />
      </div>

      <legend>Cryptography</legend>

      <select
        onChange={(e) => selectKeyExtractability(e.target.value)}
        value={isKeyExtractable}
      >
        <option value={false}>
          Non-extractable AES key (safe, encrypt-only)
        </option>
        <option value={true}>
          Extractable AES key (unsafe, encrypt+decrypt)
        </option>
      </select>

      {!!cryptoInfo && (
        <details class='card'>
          <summary>Details</summary>
          <div style={{ overflow: 'auto', whiteSpace: 'break-spaces' }}>
            <fieldset>
              {Object.entries(cryptoInfo).map(([propName, propValue]) => (
                <>
                  <label for={'cryptoInfo_' + propName}>{propName}</label>
                  <input
                    type='text'
                    id={'cryptoInfo_' + propName}
                    value={propValue}
                    disabled
                  />
                </>
              ))}
            </fieldset>
          </div>
        </details>
      )}
      {children({ onEncrypt: encryptAes256, onDecrypt: decryptAes256 })}
    </>
  )
}
