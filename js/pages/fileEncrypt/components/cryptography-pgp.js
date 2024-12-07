import {
  encrypt,
  decrypt,
  generateKeys,
} from "../../../utils/pgp.js";
import { selectFileAndRead } from '../../../utils/files.js'
import { PasswordInput } from '../../../components/passwordInput.js';

const { useEffect, useState } = React

export const CryptographyPGP = ({
  arrayBuffer,
  children,
}) => {
  const [passphrase, setPassphrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [revocationCertificate, setRevocationCertificate] = useState("");
  const [cryptoInfo, setCryptoInfo] = useState(null);
  const onGenerateKeys = async () => {
    const { privateKey, publicKey, revocationCertificate } = await generateKeys({ passphrase })
    setPrivateKey(privateKey)
    setPublicKey(publicKey)
    setRevocationCertificate(revocationCertificate)
  }

  const onEncrypt = async (onSuccess) => {
    if (arrayBuffer) {
      try {
        const encrypted = await encrypt({
          input: arrayBuffer,
          publicKeyArmored: publicKey,
          passphrase,
          // signingPrivateKeyArmored,
        });

        console.log('encrypted: ', encrypted)
        // setCryptoInfo(encrypted?.info)
        //onSuccess(selectedPackageMode.pack(encrypted));
        onSuccess(encrypted?.buffer);
      } catch(err) {
        console.error('Encryption failed: ', err)
        alert('Encryption failed')
      }
    }
  };

  const onDecrypt = async (onSuccess) => {
    if (arrayBuffer) {
      try {
        // const { salt, iv } = selectedPackageMode.unpack(arrayBuffer)
        const decrypted = await decrypt({
          input: arrayBuffer,
          passphrase,
          privateKeyArmored: privateKey,
          // verificationPublicKey,
        });
        console.log(decrypted);
        onSuccess(decrypted)
      } catch(err) {
        console.error('Decryption failed: ', err)
        alert('Decryption failed')
      }
    }
  };

  // const onUploadKeys = () => 

  return (
    <div>
      <button onClick={onGenerateKeys}>Generate keys</button>
      <button
        onClick={async () => {
          const keysFile = await selectFileAndRead()
          // uploaded keys
          // todo make download keys button first
          // DL as 2 files
          // DL as 1 file
        }}
      >
        Upload keys
      </button>
      
      <div>
        <textarea
          onChange={(e) => setPrivateKey(e.target.value)}
          value={privateKey}
          id="privateKey"
          name="privateKey"
          placeholder="Private Key"
          cols="30"
          rows="10"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <div>
        <textarea
          onChange={(e) => setPublicKey(e.target.value)}
          value={publicKey}
          id="publicKey"
          name="publicKey"
          placeholder="Public Key"
          cols="30"
          rows="10"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <PasswordInput
        onChange={(e) => setPassphrase(e.target.value)}
        value={passphrase}
        placeholder="Passphrase"
        id="input-pass"
      />

      {!!revocationCertificate && (
        <input type="text" value={revocationCertificate} disabled />
      )}

      {children({ onEncrypt, onDecrypt })}
    </div>
  )
}
