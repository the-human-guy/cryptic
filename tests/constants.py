from dataclasses import dataclass
from enum import Enum


class Locators(Enum):
    CREATE_NEW_FILE_BTN = "create-new-file-btn"
    CRYPTO_ALGO_DROPDOWN = "[data-testid='crypto-algo-selector']"
    AES_KEY_EXTRACTABILITY_DROPDOWN = (
        "//select[@data-testid='aes-key-extractability-selector']"
    )
    PASSWORD_FIELDS = "//input[@data-testid='aes-passphrase-input']"
    ENCRYPT_BTN = "crypto-btn-encrypt"
    TEXT_TO_ENCRYPT_TEXTAREA = "//textarea[@data-testid='file-editor-mode-text-input']"
    SUMMARY_BTN = "//summary[text()='Details']"
    AUTH_TAG_FIELD = "#cryptoInfo_authTag_base64"
    AES_KEY_EXTRACTED_FIELD = "#cryptoInfo_aesKeyExtracted_base64"
    IV_FIELD = "#cryptoInfo_iv_base64"
    CYPHERED_TEXT_FIELD = "#cryptoInfo_cipherTextWithoutAuthTag_base64"
    SAVE_FILE_BTN = "file-editor-btn-save"
    RESET_BTN = "reset-form-btn"


@dataclass
class EncryptionInfo:
    iv: str
    aes_key: str
    auth_tag: str
    encrypted_text: str
