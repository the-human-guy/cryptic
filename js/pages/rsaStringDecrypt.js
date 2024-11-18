import { generateRSAKeyPair, encryptStringRsa, decryptStringRsa } from "../utils/rsa_encryption.js";
import { isBase64 } from "../utils/rgx_test.js";

const { useEffect, useState } = React

export const RsaStringDecryptPage = () => {
  const [intputString, setIntputString] = useState("");
  const [decryptedString, setDecryptedString] = useState("");
  const [rsaKeyPair, setRsaKeyPair] = useState({
    publicKey: "",
    privateKey: "",
  });



  const changeFilePemPrivate = (files) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024 * 50) {
      return alert("文件太大");
    }
    const reader = new FileReader();
    reader.onload = async function () {
      const privateKey = reader.result;
      setRsaKeyPair({
        ...rsaKeyPair,
        privateKey: privateKey,
      });
    };
    reader.readAsText(file);
  };



  const decryptKeyRsa = async () => {
    try{
      const decryptedKey = await decryptStringRsa(intputString, rsaKeyPair.privateKey);
    
      setDecryptedString(decryptedKey);
    }catch(err){
      alert('Decryption failed.')
    }
    
    // const decryptedKey = await decryptStringRsa(encryptedKey, rsaKeyPair.privateKey);
    // console.log('decrypt: ',decryptedKey)
  };

  const onKeyInputChange = async (e) => {
    setIntputString(e.target.value);
  };

  return (
    <>
      <div>
      <h1>RSA String Decrypt</h1>
        <div>
          <div>
            <label
              htmlFor="small-input"
            >
              Input Rsa Encrypted String (Base64) (ex.
                KbQhUn9U2mm96q4ZARf7k8gF7+Ir/HGn/Xa1EFkPvtGDJvyvxqi/SkF+jYUZk1Nb/5QZWl6MXjQhws242K3KGh7j4G2LC6/wv7lkHU4vm5DmYv5HnDKGrDQFzYioYL6/x3M2RSySDqCnTZ73bCR2MHhPL5Js5rxP2LkcDnuG8oePF3cd09PeFlyDBNjl/iY57Xx/7pWWi6T0MbQCQdMDeoFELQZIXaVTWLzHuJO6P8zrtCmLORarmdBtsnq7e1YaSWQJoPBjuGtcpzQYKiUjbwvDYBW69/9/u70V7G+F4m1cL2ESfu8+wsLIQgW3B6eRgo0RvPbvM+BiZxSl5LZWVQ==)
            </label>
            <input
              onChange={onKeyInputChange}
              type="text"
              id="small-input"
            />
            {intputString && !isBase64(intputString) && (
              <div>Key must be valid Base64 string</div>
            )}
          </div>

          {/* <div>
            <label
              htmlFor="small-input"
            >
              Input Encrypted AES256 key  (ex.
                SVtCR+N481hggkOrn63NQdrhcTI5BTrTKIxmGRXKgz6TxmmfcL/wI5BXYVmSd7h25bl6ZqGss6PekgEmkjwgtRFZAQldHOyVLQgM3jaqR9ytTG2667Qm/YabLkYcHEF6c126WxWrZ9j+IUCOOL7L5MZKjZ2oMIAhfULMie0q+DsyNfzoiUcZVQm6/dsj2QVb9JEchG3bd1ndAjzFKe1A+jmaWoD7r6JUrKtt4v1YmpbZZYazcIgndtPX935BoAFcovqBe3w/1k7MD8eUAe56I3GRd2AD5iKdnSPOrT7msKjUzRrJwd2DfLJI7W9ilKDq0REYUwVJNzuapVnWhJQalw==)
            </label>
            <input
              onChange={onKeyInputChange}
              type="text"
              id="small-input"
            />
            {aesKey && !is256BitHex(aesKey) && (
              <div>Key must be 256bit hex</div>
            )}
          </div> */}
          <div>
            {/* <button
              type="button"
              onClick={generateRSAKey}
            >
              Generate RSA Key
            </button>
            <button
              type="button"
              onClick={downloadPemFiles}
            >
              Download Pem Files
            </button> */}
            <div>
              <label
                htmlFor="dropzone-file-pem-private"
              >
                Import Private Key Pem File
                <input
                  id="dropzone-file-pem-private"
                  type="file"
                  onChange={(e) => changeFilePemPrivate(e.target.files)}
                />
              </label>
            </div>
          </div>
          {rsaKeyPair && (rsaKeyPair.privateKey || rsaKeyPair.publicKey) && (
            <>
              <div>
                <span>Encryption algorithm:</span>{" "}
                RSA-OAEP
              </div>
              <div>
                <span>Modulus length:</span> 2048
              </div>
              <div>
                <span>Hash:</span> SHA-256
              </div>
              <div>
                {rsaKeyPair.privateKey && (
                  <div>
                    <textarea
                      disabled
                      value={rsaKeyPair.privateKey}
                      id="message"
                      rows="6"
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                )}
                {rsaKeyPair.publicKey && (
                  <div>
                    <textarea
                      disabled
                      value={rsaKeyPair.publicKey}
                      id="message"
                      rows="6"
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                )}
              </div>
              {(rsaKeyPair.privateKey && intputString && isBase64(intputString)) && (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={decryptKeyRsa}
                    >
                      Decrypt the input key with RSA
                    </button>
                  </div>
                  {decryptedString && (
                    <div>
                    <span>Decrypted string: </span>{decryptedString}
                  </div>
                  )}
                  
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
