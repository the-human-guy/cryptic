import { generateRSAKeyPair, encryptStringRsa } from "../utils/rsa_encryption.js";

const { useState } = React;

export const RsaStringEncryptPage = () => {
  const [inputString, setInputString] = useState("");
  const [encryptedString, setEncryptedString] = useState("");
  const [rsaKeyPair, setRsaKeyPair] = useState({
    publicKey: "",
    privateKey: "",
  });


  const downloadPemFile = (content, fileName) => {
    const link = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const generateRSAKey = async () => {
    const keyPair = await generateRSAKeyPair();
    setRsaKeyPair(keyPair);
  };

  const downloadPemFiles = () => {
    if (rsaKeyPair.privateKey) {
      downloadPemFile(rsaKeyPair.privateKey, "rsa_private.pem");
    }
    if (rsaKeyPair.publicKey) {
      downloadPemFile(rsaKeyPair.publicKey, "rsa_public.pem");
    }
  };


  const changeFilePemPublic = (files) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024 * 50) {
      return alert("文件太大");
    }
    const reader = new FileReader();
    reader.onload = async function () {
      const publicKey = reader.result;
      setRsaKeyPair({
        ...rsaKeyPair,
        publicKey: publicKey,
      });
    };
    reader.readAsText(file);
  };

  const encryptKeyRsa = async () => {
    try{
      const encryptedKey = await encryptStringRsa(inputString, rsaKeyPair.publicKey);
      setEncryptedString(encryptedKey);
    }catch(err){
      alert('Encryption failed.')
    }
  };

  const onKeyInputChange = async (e) => {
    setInputString(e.target.value);
  };

  return (
    <>
      <div>
        <h1>RSA String Encrypt</h1>
        <div>
          <div>
            <label
              htmlFor="small-input"
            >
              Input string to encrypt
            </label>
            <input
              onChange={onKeyInputChange}
              type="text"
              id="small-input"
            />
           
          </div>
          <div>
            <button
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
            </button>
            <div>
              <label
                htmlFor="dropzone-file-pem-public"
              >
                Import Public Key Pem File
                <input
                  id="dropzone-file-pem-public"
                  type="file"
                  onChange={(e) => changeFilePemPublic(e.target.files)}
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
              {(rsaKeyPair.publicKey && inputString ) && (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={encryptKeyRsa}
                    >
                      Encrypt the string with RSA
                    </button>
                  </div>
                  {encryptedString && (
                    <div>
                    <span>Encrypted string (Base64): </span>{encryptedString}
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
