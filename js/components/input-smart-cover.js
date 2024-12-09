import { copyTextToClipboard } from '../utils/clipboard.js'
import { downloadText, selectFileAndRead } from '../utils/files.js'

export const InputSmartCover = ({
  value,
  onChange,
  actionCopy,
  actionDownload,
  actionUpload,
  name = '',
  children,
}) => {
  return (
    <div className='input-smart-cover'>
      {children}

      <div className='input-smart-cover__btns'>
        {!!actionUpload && (
          <div
            className='input-smart-cover__btn'
            title='Upload'
            onClick={async () => {
              const fileContents = await selectFileAndRead()
              onChange(fileContents)
            }}
          >
            📁
          </div>
        )}

        {!!actionDownload && (
          <div
            className='input-smart-cover__btn'
            title='Download'
            onClick={async () => {
              downloadText(value, name)
            }}
          >
            💾
          </div>
        )}

        {!!actionCopy && (
          <div
            className='input-smart-cover__btn'
            title='Copy'
            onClick={async () => {
              copyTextToClipboard(value)
            }}
          >
            📋
          </div>
        )}
      </div>
    </div>
  )
}
