import { FileEditor } from './components/fileEditor.js';
import { Cryptography } from './components/cryptography.js';

const { useEffect, useState } = React

const FILE_MAX_SIZE = 1024 * 1024 * 50
const FILE_MAX_SIZE_LABEL = 'max. 50MB'

export function AesFileEncryptPage() {
  const [filesList, setFilesList] = useState([]);
  const [selectedFile, selectFile] = useState(null);
  const [usingEditor, setUsingEditor] = useState(false)
  const addFileToList = (file) => {
    setFilesList(cur => [...cur, file])
    selectFile(file)
  }
  const removeFileFromList = file => {
    setFilesList(cur => cur.filter(file1 => file1 !== file))
    if (selectedFile === file) {
      selectFile(null)
    }
  }

  const onFileUpload = (files) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > FILE_MAX_SIZE) {
      return alert(FILE_MAX_SIZE_LABEL);
    }
    console.log(files);

    addFileToList(file);
    setTimeout(() => {
      document.getElementById("file-input-form").reset();
    }, 50);
  };

  const resetForm = () => {
    document.getElementById("file-input-form").reset();
    selectFile(null);
    setFilesList([])
    setUsingEditor(false);
  }

  const openInEditor = () => setUsingEditor(true)

  const downloadFile = (file) => {
    const tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    const url = window.URL.createObjectURL(file);
    tempEl.href = url;
    tempEl.download = file.name;
    tempEl.click();
    window.URL.revokeObjectURL(url);
  };

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
                className="dropzone-file-input"
                type="file"
                onChange={(e) => {onFileUpload(e.target.files); setUsingEditor(false); }}
              />
          </label>
          {!!selectedFile && <button type="reset" onClick={resetForm}>Reset</button>}
        </form>
      </div>

      <div className="file-list">
        {filesList.map((file, i) => (
          <div className="file-list__item">
            <button onClick={() => removeFileFromList(file)} title="Remove">✖️</button>
            <button onClick={() => downloadFile(file)} title="Download">💾</button>
            <button className="file-list__filename" tabIndex="0" onClick={() => selectFile(file)}>{file.name}</button>
          </div>
        ))}
      </div>

      {!!selectedFile && (
        <div class="row">
          <div class="col">
            <div className="card info">
              <p>File Info</p>
              <div>
                <span>File name:</span>{" "}
                {selectedFile.name}
              </div>
              <div>
                <span>Last modified date:</span>{" "}
                {selectedFile.lastModifiedDate.toString()}
              </div>
              <div>
                <span>Size:</span> {selectedFile.size}
              </div>
              <div>
                <span>Type:</span> {selectedFile.type}
              </div>
              <button type="button" onClick={() => openInEditor()}>Edit</button>
            </div>
          </div>
          <div class="col" style={{ minWidth: 0 }}>
            <Cryptography
              file={selectedFile}
              onFileEncrypt={addFileToList}
              onFileDecrypt={addFileToList}
            />
          </div>
        </div>
      )}

      {!!usingEditor && selectedFile && (
        <div class="card info">
          <p>Editor</p>
          <FileEditor file={selectedFile} onSave={(editedFile) => addFileToList(editedFile)} />
        </div>
      )}

    </main>

  );
}

