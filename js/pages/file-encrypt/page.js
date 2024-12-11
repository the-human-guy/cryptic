import { FileEditor } from './components/file-editor.js'
import { Cryptography } from './components/cryptography.js'
import {
  downloadFile,
  selectFile as selectFileFromFS,
} from '../../utils/files.js'

const { useState } = React

const FILE_MAX_SIZE = 1024 * 1024 * 50
const FILE_MAX_SIZE_LABEL = 'max. 50MB'

let newFileCounter = 0

export function FileEncryptPage() {
  const [filesList, setFilesList] = useState([])
  const [selectedFile, selectFile] = useState(null)
  const [usingEditor, setUsingEditor] = useState(false)
  const addFileToList = (file) => {
    setFilesList((cur) => [...cur, file])
    selectFile(file)
  }
  const removeFileFromList = (file) => {
    if (selectedFile === file) {
      selectFile(filesList[filesList.indexOf(file) - 1] || filesList[1] || null)
    }
    setFilesList((cur) => cur.filter((file1) => file1 !== file))
  }

  const onFileUpload = (files) => {
    const file = files?.[0] || files
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
        <div class='col-2'>
          {/* file input */}
          <div>
            <label
              style={{ display: 'none' }}
              htmlFor='dropzone-file'
              data-testid='dropzone-file-input-wrapper'
            >
              <span>Click to upload a file ({FILE_MAX_SIZE_LABEL})</span>
              <input
                id='dropzone-file'
                className='dropzone-file-input'
                type='file'
                data-testid='dropzone-file-input'
                onChange={(e) => {
                  onFileUpload(e.target.files)
                  setUsingEditor(false)
                  e.target.value = ''
                }}
              />
            </label>
            <button
              type='button'
              data-testid='upload-file-btn'
              onClick={async () => {
                const fileContents = await selectFileFromFS()
                onFileUpload(fileContents)
              }}
            >
              Choose File
            </button>
            <button
              type='button'
              data-testid='create-new-file-btn'
              onClick={async () => {
                const newFile = new File([''], `new-file-${++newFileCounter}`, {
                  type: 'text/plain',
                })
                addFileToList(newFile)
                setUsingEditor(true)
              }}
            >
              New File
            </button>
            {!!selectedFile && (
              <>
                <button
                  type='reset'
                  onClick={resetForm}
                  data-testid='reset-form-btn'
                >
                  Reset
                </button>
                <hr className='my-1' />
              </>
            )}
          </div>

          <div className='file-list' data-testid='file-list'>
            {filesList.map((file, i) => (
              <div
                className='file-list__item'
                data-testid={`file-list-item-${i}`}
              >
                <button
                  className={`file-list__filename ${file === selectedFile && 'file-list__filename--selected'}`}
                  tabIndex='0'
                  data-testid={`file-list-item-${i}-filename`}
                  onClick={() => selectFile(file)}
                >
                  {file.name}
                </button>
                <button
                  onClick={() => removeFileFromList(file)}
                  title='Remove'
                  data-testid={`file-list-item-${i}-remove`}
                >
                  ✖️
                </button>
                <button
                  onClick={() => downloadFile(file)}
                  title='Download'
                  data-testid={`file-list-item-${i}-save`}
                >
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
                  <span>File name:</span>{' '}
                  <span data-testid='file-info-filename'>
                    {selectedFile.name}
                  </span>
                </div>
                <div>
                  <span>Last modified date:</span>{' '}
                  <span data-testid='file-info-modified-date'>
                    {selectedFile.lastModifiedDate?.toString()}
                  </span>
                </div>
                <div>
                  <span>Size:</span>{' '}
                  <span data-testid='file-info-size'>{selectedFile.size}</span>
                </div>
                <div>
                  <span>Type:</span>{' '}
                  <span data-testid='file-info-type'>{selectedFile.type}</span>
                </div>
                <button
                  type='button'
                  onClick={() => setUsingEditor(!usingEditor)}
                  data-testid='file-info-btn-edit'
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

            <div class='col-5'>
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
