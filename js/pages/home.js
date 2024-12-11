import { FileEncryptPage } from '../pages/file-encrypt/page.js'
import { RsaStringEncryptPage } from './rsa-string-encrypt.js'
import { RsaStringDecryptPage } from './rsa-string-decrypt.js'

const { useSearchParams } = ReactRouterDOM

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      {(!searchParams.get('page') ||
        searchParams.get('page') === 'file_encrypt') && <FileEncryptPage />}
      {searchParams.get('page') === 'rsa_key_encrypt' && (
        <RsaStringEncryptPage />
      )}
      {searchParams.get('page') === 'rsa_key_decrypt' && (
        <RsaStringDecryptPage />
      )}
    </>
  )
}
