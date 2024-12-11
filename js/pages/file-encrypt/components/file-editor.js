import { readFile } from '../../../utils/files.js'
import { FileEditorImagePreview } from './file-editor-img-preview.js'
const { useEffect, useState } = React
/*
todo: add more editor options:
- https://github.com/JiHong88/SunEditor
- https://github.com/samclarke/SCEditor
- https://github.com/xdan/jodit
- https://github.com/bevacqua/woofmark
*/

const PREVIEW_MODE = {
  HTML: 'html',
  IMG: 'img',
}

const EDIT_MODE = {
  TEXT: 'text',
}

const FILE_AUTOEDIT_SIZE = 1024 * 1024 * 1 // 1MB

export const FileEditor = ({ onSave, file: originalFile }) => {
  const [fileContent, setFileContent] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const resetToOriginalFile = async () => {
    // console.log('resetToOriginalFile: ', originalFile)
    if (!originalFile) return setFileContent(null)

    const fileContent = await readFile(originalFile)
    setFileContent(fileContent)
  }

  useEffect(() => {
    resetToOriginalFile()

    if (originalFile.size <= FILE_AUTOEDIT_SIZE) {
      if (originalFile.type?.startsWith?.('image/')) {
        setPreviewMode(PREVIEW_MODE.IMG)
        setEditMode(false)
      } else if (originalFile.type == 'text/html') {
        setEditMode(EDIT_MODE.TEXT)
        setPreviewMode(PREVIEW_MODE.HTML)
      } else if (
        originalFile.type?.startsWith('text/') ||
        originalFile.type?.startsWith('application/')
      ) {
        setEditMode(EDIT_MODE.TEXT)
        setPreviewMode(false)
      }
    } else {
      setEditMode(false)
      setPreviewMode(false)
    }
  }, [originalFile])

  const saveFile = () => {
    const newFile = new File(
      [new Blob([fileContent])],
      `new-${originalFile.name}`,
      { type: originalFile.type },
    )
    onSave(newFile)
  }

  const wrapWithPre = () =>
    setFileContent(`<pre>
${fileContent}
</pre>
`)

  return (
    <div>
      <button
        type='button'
        onClick={saveFile}
        data-testid='file-editor-btn-save'
      >
        Save changes
      </button>
      <button
        type='button'
        onClick={wrapWithPre}
        data-testid='file-editor-btn-pre'
      >
        {'<pre>'}
      </button>
      <button
        type='reset'
        onClick={resetToOriginalFile}
        data-testid='file-editor-btn-reset'
      >
        Reset
      </button>

      <select
        onChange={(e) => setEditMode(e.target.value)}
        value={editMode}
        data-testid='file-editor-edit-mode-selector'
      >
        <option value={false}>Edit as</option>
        {Object.entries(EDIT_MODE).map(([mode, value]) => (
          <option value={value}>{mode}</option>
        ))}
      </select>

      <select
        onChange={(e) => setPreviewMode(e.target.value)}
        value={previewMode}
        data-testid='file-editor-preview-mode-selector'
      >
        <option value={false}>Preview</option>
        {Object.entries(PREVIEW_MODE).map(([mode, value]) => (
          <option value={value}>{mode}</option>
        ))}
      </select>

      <div class='row'>
        {editMode === EDIT_MODE.TEXT && (
          <div class='col'>
            <textarea
              onChange={(e) => setFileContent(e.target.value)}
              data-testid={`file-editor-mode-${EDIT_MODE.TEXT}-input`}
              cols='30'
              rows='33'
              value={fileContent}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {previewMode === PREVIEW_MODE.HTML && (
          <div
            class='col editor-preview-container'
            data-testid={`file-editor-mode-${PREVIEW_MODE.HTML}-preview`}
          >
            <iframe sandbox='' srcdoc={fileContent}></iframe>
          </div>
        )}

        {previewMode === PREVIEW_MODE.IMG && (
          <div
            class='col editor-preview-container'
            data-testid={`file-editor-mode-${PREVIEW_MODE.IMG}-preview`}
          >
            <FileEditorImagePreview file={originalFile} />
          </div>
        )}
      </div>
    </div>
  )
}
