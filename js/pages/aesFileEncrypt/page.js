import { FileEditor } from './components/fileEditor.js';
import { Cryptography } from './components/cryptography.js';

const { useEffect, useState } = React

const FILE_MAX_SIZE = 1024 * 1024 * 50
const FILE_MAX_SIZE_LABEL = 'max. 50MB'

export function AesFileEncryptPage() {
  const [inputFile, setInputFile] = useState(null);
  const [usingEditor, setUsingEditor] = useState(false)

  const changeFile = (files) => {
    const file = files[0];
    if (!file) {
      return setInputFile(null);
    }
    if (file.size > FILE_MAX_SIZE) {
      return alert(FILE_MAX_SIZE_LABEL);
    }
    console.log(files);

    setInputFile(file);
    setTimeout(() => {
        // document.getElementById("file-input-form").reset();
    }, 50);
  };

  const resetForm = () => {
    document.getElementById("file-input-form").reset();
    setInputFile(null);
    setUsingEditor(false);
  }

  const openInEditor = () => setUsingEditor(true)

  const downloadFile = (blob, fileName) => {
    const tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    const url = window.URL.createObjectURL(blob);
    tempEl.href = url;
    tempEl.download = fileName;
    tempEl.click();
    window.URL.revokeObjectURL(url);
  };


  // action: 'save' | 'edit'
  const onFileDecrypt = (file, action) => {
    if (action === 'save') {
      downloadFile(file)
    }
    if (action === 'edit') {
      setInputFile(file)
      setUsingEditor(true)
    }
  }
  const onFileEncrypt = (file, action) => {
    if (action === 'save') {
      downloadFile(file)
    }
    if (action === 'edit') {
      setInputFile(file)
      setUsingEditor(true)
    }
  }

  return (
    <main style={{ paddingBottom: '7rem' }}>
      <div>
        <h1>AES256 File Encrypt</h1>

        {/* file input */}
        <form id="file-input-form" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <label htmlFor="dropzone-file">
              <span>Click to upload a file ({FILE_MAX_SIZE_LABEL})</span>
              <input
                id="dropzone-file"
                type="file"
                onChange={(e) => {changeFile(e.target.files); setUsingEditor(false); }}
              />
          </label>
          {!!inputFile && <button type="reset" onClick={resetForm}>Reset</button>}
        </form>
      </div>

      {!!inputFile && (
        <div class="row">
          <div class="col">
            <fieldset>
              <legend>File Info</legend>
              <div>
                <span>File name:</span>{" "}
                {inputFile.name}
              </div>
              <div>
                <span>Last modified date:</span>{" "}
                {inputFile.lastModifiedDate.toString()}
              </div>
              <div>
                <span>Size:</span> {inputFile.size}
              </div>
              <div>
                <span>Type:</span> {inputFile.type}
              </div>
              <button type="button" onClick={() => openInEditor()}>Open in editor</button>
            </fieldset>
          </div>
          <div class="col" style={{ minWidth: 0 }}>
            <Cryptography
              file={inputFile}
              onFileEncrypt={onFileEncrypt}
              onFileDecrypt={onFileDecrypt}
            />
          </div>
        </div>
      )}

      {!!usingEditor && (
        <div class="card info">
          <p>Editor</p>
          <FileEditor file={inputFile} onSave={(editedFile) => setInputFile(editedFile)} />
        </div>
      )}

    </main>

  );
}

