import {
  encrypt,
  decrypt,
  generateKeys,
  parseKeys,
} from '../../../utils/pgp.js'
import { selectFileAndRead, downloadText } from '../../../utils/files.js'
import { PasswordInput } from '../../../components/password-input.js'
import { InputSmartCover } from '../../../components/input-smart-cover.js'

const { useEffect, useState } = React

export const CryptographyPGP = ({ arrayBuffer, children }) => {
  const [passphrase, setPassphrase] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [revocationCertificate, setRevocationCertificate] = useState('')
  const [cryptoInfo, setCryptoInfo] = useState(null)
  const onGenerateKeys = async () => {
    const { privateKey, publicKey, revocationCertificate } = await generateKeys(
      { passphrase },
    )
    setPrivateKey(privateKey)
    setPublicKey(publicKey)
    setRevocationCertificate(revocationCertificate)
  }

  const onDownloadKeys = async () => {
    downloadText(privateKey + '\n\n' + publicKey, 'keys.txt')
  }

  const onEncrypt = async (onSuccess) => {
    if (arrayBuffer) {
      try {
        const encrypted = await encrypt({
          input: arrayBuffer,
          publicKeyArmored: publicKey,
          passphrase,
          // signingPrivateKeyArmored,
        })

        console.log('encrypted: ', encrypted)
        // setCryptoInfo(encrypted?.info)
        //onSuccess(selectedPackageMode.pack(encrypted));
        onSuccess(encrypted?.buffer)
      } catch (err) {
        console.error('Encryption failed: ', err)
        alert('Encryption failed')
      }
    }
  }

  const onDecrypt = async (onSuccess) => {
    if (arrayBuffer) {
      try {
        // const { salt, iv } = selectedPackageMode.unpack(arrayBuffer)
        const decrypted = await decrypt({
          input: arrayBuffer,
          passphrase,
          privateKeyArmored: privateKey,
          // verificationPublicKey,
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
    <div>
      <button
        onClick={async () => {
          const { privKey, pubKey } = parseKeys(await selectFileAndRead())
          setPrivateKey(privKey)
          setPublicKey(pubKey)
        }}
      >
        Upload keys
      </button>

      <div
        className='row m-0'
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PasswordInput
          onChange={(e) => setPassphrase(e.target.value)}
          value={passphrase}
          placeholder='Passphrase'
          id='input-pass'
          data-testid='pgp-input-passphrase'
          className='m-0'
        />
        <button data-testid='pgp-gen-keys-btn' onClick={onGenerateKeys}>
          Generate keys
        </button>
      </div>

      <div>
        <InputSmartCover
          onChange={setPrivateKey}
          value={privateKey}
          name='privateKey'
          actionCopy
          actionDownload
          actionUpload
        >
          <textarea
            onChange={(e) => setPrivateKey(e.target.value)}
            value={privateKey}
            id='privateKey'
            name='privateKey'
            placeholder='Private Key'
            cols='30'
            rows='3'
            data-testid='pgp-input-privkey'
            style={{ maxWidth: '100%' }}
          />
        </InputSmartCover>
      </div>

      <div>
        {' '}
        <InputSmartCover
          onChange={setPublicKey}
          value={publicKey}
          name='publicKey'
          actionCopy
          actionDownload
          actionUpload
        >
          <textarea
            onChange={(e) => setPublicKey(e.target.value)}
            value={publicKey}
            id='publicKey'
            name='publicKey'
            placeholder='Public Key'
            cols='30'
            rows='3'
            data-testid='pgp-input-pubkey'
            style={{ maxWidth: '100%' }}
          />
        </InputSmartCover>
      </div>

      {!!privateKey && !!publicKey && (
        <button data-testid='pgp-download-keys-btn' onClick={onDownloadKeys}>
          Download keys
        </button>
      )}

      {!!revocationCertificate && (
        <InputSmartCover
          value={revocationCertificate}
          name='revocCert'
          actionCopy
          actionDownload
        >
          <input
            data-testid='pgp-revoc-cert-input'
            name='revocCert'
            type='text'
            value={revocationCertificate}
            disabled
          />
        </InputSmartCover>
      )}

      {children({ onEncrypt, onDecrypt })}
    </div>
  )
}
