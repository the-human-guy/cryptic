import { FileEditor } from './components/file-editor.js'
import { Cryptography } from './components/cryptography.js'
import { downloadFile } from '../../utils/files.js'

const { useState } = React

const FILE_MAX_SIZE = 1024 * 1024 * 50
const FILE_MAX_SIZE_LABEL = 'max. 50MB'

export function FileEncryptPage() {
  const [filesList, setFilesList] = useState([])
  const [selectedFile, selectFile] = useState(null)
  const [usingEditor, setUsingEditor] = useState(false)
  const addFileToList = (file) => {
    setFilesList((cur) => [...cur, file])
    selectFile(file)
  }
  const removeFileFromList = (file) => {
    setFilesList((cur) => cur.filter((file1) => file1 !== file))
    if (selectedFile === file) {
      selectFile(null)
    }
  }

  const onFileUpload = (files) => {
    const file = files[0]
    if (!file) {
      return
    }
    if (file.size > FILE_MAX_SIZE) {
      return alert(FILE_MAX_SIZE_LABEL)
    }
    console.log(files)

    addFileToList(file)
  }

  const resetForm = () => {
    selectFile(null)
    setFilesList([])
    setUsingEditor(false)
  }

  return (
    <main style={{ paddingBottom: '7rem' }}>
      <div class='row'>
        <div class='col col-2'>
          {/* file input */}
          <div>
            <label htmlFor='dropzone-file'>
              <span>Click to upload a file ({FILE_MAX_SIZE_LABEL})</span>
              <input
                id='dropzone-file'
                className='dropzone-file-input'
                type='file'
                onChange={(e) => {
                  onFileUpload(e.target.files)
                  setUsingEditor(false)
                  e.target.value = ''
                }}
              />
            </label>
            {!!selectedFile && (
              <>
                <button type='reset' onClick={resetForm}>
                  Reset
                </button>
                <hr className='my-1' />
              </>
            )}
          </div>

          <div className='file-list'>
            {filesList.map((file, i) => (
              <div className='file-list__item'>
                <button
                  className={`file-list__filename ${file === selectedFile && 'file-list__filename--selected'}`}
                  tabIndex='0'
                  onClick={() => selectFile(file)}
                >
                  {file.name}
                </button>
                <button onClick={() => removeFileFromList(file)} title='Remove'>
                  ✖️
                </button>
                <button onClick={() => downloadFile(file)} title='Download'>
                  💾
                </button>
              </div>
            ))}
          </div>
        </div>

        {!!selectedFile && (
          <>
            <div class='col'>
              <div className='card info'>
                <p>File Info</p>
                <div>
                  <span>File name:</span> {selectedFile.name}
                </div>
                <div>
                  <span>Last modified date:</span>{' '}
                  {selectedFile.lastModifiedDate?.toString()}
                </div>
                <div>
                  <span>Size:</span> {selectedFile.size}
                </div>
                <div>
                  <span>Type:</span> {selectedFile.type}
                </div>
                <button
                  type='button'
                  onClick={() => setUsingEditor(!usingEditor)}
                >
                  Edit
                </button>
              </div>

              {!!usingEditor && (
                <div class='card info'>
                  <p>Editor</p>
                  <FileEditor
                    file={selectedFile}
                    onSave={(editedFile) => addFileToList(editedFile)}
                  />
                </div>
              )}
            </div>

            <div class='col col-5' style={{ minWidth: 0 }}>
              <Cryptography
                file={selectedFile}
                onFileEncrypt={addFileToList}
                onFileDecrypt={addFileToList}
              />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
