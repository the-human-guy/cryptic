const { useEffect, useState } = React

export const FileEditorImagePreview = ({ file }) => {
  const [imgUrl, setImgUrl] = useState(null)

  useEffect(() => {
    let imageUrl
    ;(async () => {
      if (!file) {
        return
      }
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const blob = new Blob([uint8Array.buffer], { type: file.type })
      imageUrl = URL.createObjectURL(blob)
      setImgUrl(imageUrl)
    })()

    return () => URL.revokeObjectURL(imageUrl)
  }, [file])

  return imgUrl ? (
    <div>
      <img src={imgUrl} alt='Image Preview' />
    </div>
  ) : null
}
