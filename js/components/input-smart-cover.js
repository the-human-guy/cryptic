import { copyTextToClipboard } from '../utils/clipboard.js'
import { downloadText, selectFileAndRead } from '../utils/files.js'

export const InputSmartCover = ({
  value,
  onChange,
  actionCopy,
  actionDownload,
  actionUpload,
  actionDelete,
  name = '',
  children,
  ...restProps
}) => {
  return (
    <div className='input-smart-cover' {...restProps}>
      {children}

      <div className='input-smart-cover__btns'>
        {!!actionDelete && (
          <div
            className='input-smart-cover__btn'
            title='Delete'
            data-testid='isc-delete'
            onClick={async () => {
              onChange('')
            }}
          >
            ❌
          </div>
        )}

        {!!actionUpload && (
          <div
            className='input-smart-cover__btn'
            title='Upload'
            data-testid='isc-upload'
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
            data-testid='isc-download'
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
            data-testid='isc-copy'
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
