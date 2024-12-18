from dataclasses import dataclass
from enum import Enum


class DataTestId(Enum):
    CREATE_NEW_FILE_BTN = "create-new-file-btn"
    CRYPTO_ALGO_DROPDOWN = "crypto-algo-selector"
    AES_KEY_EXTRACTABILITY_DROPDOWN = "aes-key-extractability-selector"
    PASSWORD_FIELD = "aes-passphrase-input"
    ENCRYPT_BTN = "crypto-btn-encrypt"
    TEXT_TO_ENCRYPT_TEXTAREA = "file-editor-mode-text-input"
    SUMMARY_BTN = "//summary[text()='Details']"
    SAVE_FILE_BTN = "file-editor-btn-save"
    RESET_BTN = "reset-form-btn"
    PASSPHRASE_FIELD = "pgp-input-passphrase"
    GENERATE_PGP_KEYS_BTN = "pgp-gen-keys-btn"
    PGP_REVOC_CERT_INPUT = "pgp-revoc-cert-input"


class EncryptionAlgo(Enum):
    GCM = "GCM"
    CBC = "CBC"
    PGP = "PGP"


class ElementId(Enum):
    AUTH_TAG_FIELD = "#cryptoInfo_authTag_base64"
    AES_KEY_EXTRACTED_FIELD = "#cryptoInfo_aesKeyExtracted_base64"
    IV_FIELD = "#cryptoInfo_iv_base64"
    CYPHERED_TEXT_FIELD_GSM = "#cryptoInfo_cipherTextWithoutAuthTag_base64"
    CYPHERED_TEXT_FIELD_CBC = "#cryptoInfo_cipherText_base64"
    PRIVATE_KEY_TEXTAREA = "#privateKey"
    PUBLIC_KEY_TEXTAREA = "#publicKey"



@dataclass
class EncryptionInfo:
    iv: str
    aes_key: str
    encrypted_text: str = None
    auth_tag: str = None
