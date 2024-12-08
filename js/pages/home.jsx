import { FileEncryptPage } from '../pages/fileEncrypt/page.jsx'
import { RsaStringEncryptPage } from './rsa-string-encrypt.jsx'
import { RsaStringDecryptPage } from './rsa-string-decrypt.jsx'

const { useSearchParams } = ReactRouterDOM

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      {(!searchParams.get('page') ||
        searchParams.get('page') === 'aes_file_encrypt') && <FileEncryptPage />}
      {searchParams.get('page') === 'rsa_key_encrypt' && (
        <RsaStringEncryptPage />
      )}
      {searchParams.get('page') === 'rsa_key_decrypt' && (
        <RsaStringDecryptPage />
      )}
    </>
  )
}
