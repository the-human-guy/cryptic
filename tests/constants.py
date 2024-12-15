from enum import Enum


class Locators(Enum):
    CREATE_NEW_FILE_BTN = "create-new-file-btn"
    CRYPTO_ALGO_DROPDOWN = "[data-testid='crypto-algo-selector']"
    AES_KEY_EXTRACTABILITY_DROPDOWN = "//select[@data-testid='aes-key-extractability-selector']"
    PASSWORD_FIELDS = "//input[@data-testid='aes-passphrase-input']"
    ENCRYPT_BTN = 'crypto-btn-encrypt'
    TEXT_TO_ENCRYPT_TEXTAREA = "//textarea[@data-testid='file-editor-mode-text-input']"
    SUMMARY_BTN = "//summary[text()='Details']"