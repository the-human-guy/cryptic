import { FileEditorImagePreview } from './fileEditor-img-preview.js'
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

export const FileEditor = ({ onSave, file: originalFile }) => {
  const [fileContent, setFileContent] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
 
  const resetToOriginalFile = () => {
    console.log('resetToOriginalFile: ', originalFile)
    if (!originalFile)
      return setFileContent(null)

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setFileContent(fileContent)
    };
    reader.readAsText(originalFile);
  }

  useEffect(() => {
    resetToOriginalFile()
  }, [originalFile])

  const saveFile = () => {
    const newFile = new File([new Blob([fileContent])], `new-${originalFile.name}`, { type: originalFile.type })
    onSave(newFile)
  }

  const wrapWithPre = () => setFileContent(`<pre>
${fileContent}
</pre>
`)

  return (
    <div>
      <button type="button" onClick={saveFile}>Save changes</button>
      <button type="button" onClick={wrapWithPre}>{'<pre>'}</button>
      <button type="reset" onClick={resetToOriginalFile}>Reset</button>

      <select onChange={e => setEditMode(e.target.value)}>
        <option value={false}>Edit as</option>
        {Object.entries(EDIT_MODE).map(([mode, value]) => (
          <option value={value}>{mode}</option>
        ))}
      </select>

      <select onChange={e => setPreviewMode(e.target.value)}>
        <option value={false}>Preview</option>
        {Object.entries(PREVIEW_MODE).map(([mode, value]) => (
          <option value={value}>{mode}</option>
        ))}
      </select>

      <div class="row">

        {editMode === EDIT_MODE.TEXT && (
          <div class="col">
            <textarea
              onChange={e => setFileContent(e.target.value)}
              cols="30"
              rows="33"
              value={fileContent}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {previewMode === PREVIEW_MODE.HTML && (
          <div class="col editor-preview-container">
            <iframe
              sandbox=""
              srcdoc={fileContent}
            ></iframe>
          </div>
        )}

        {previewMode === PREVIEW_MODE.IMG && (
          <div class="col editor-preview-container">
            <FileEditorImagePreview file={originalFile} />
          </div>
        )}

      </div>
    </div>
  )
}
