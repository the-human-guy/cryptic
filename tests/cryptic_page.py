from playwright.sync_api import Page

from tests.constants import EncryptionInfo, DataTestId


class CrypticPage(Page):
    def __init__(self, page):
        super().__init__(page)
        self.page = page

    def click_button(self, data_test_id: str):
        self.page.click(f"//*[@data-testid='{data_test_id}']")
        return self

    def fill_form(self, locator: str, text: str):
        self.page.fill(selector=locator, value=text)
        return self

    def click_create_new_button(self):
        self.click_button(DataTestId.CREATE_NEW_FILE_BTN.value)
        return self

    def select_crypto_algorithm(self, algorithm: str):
        self.page.select_option(DataTestId.CRYPTO_ALGO_DROPDOWN.value, value=algorithm)
        return self

    def select_aes_key_extractability(self, is_extractable: str):
        self.page.select_option(
            DataTestId.AES_KEY_EXTRACTABILITY_DROPDOWN.value, value=is_extractable
        )
        return self

    def enter_password(self, text: str):
        self.fill_form(DataTestId.PASSWORD_FIELD.value, text=text)
        return self

    def click_encrypt_button(self):
        self.click_button(DataTestId.ENCRYPT_BTN.value)
        return self

    def enter_text_to_encrypt(self, text: str):
        self.fill_form(DataTestId.TEXT_TO_ENCRYPT_TEXTAREA.value, text=text)

    def click_details(self):
        self.page.click(DataTestId.SUMMARY_BTN.value)

    def click_save_file_button(self):
        self.click_button(DataTestId.SAVE_FILE_BTN.value)

    def click_reset_button(self):
        self.click_button(DataTestId.RESET_BTN.value)

    def get_aes_key(self):
        return self.page.locator(DataTestId.AES_KEY_EXTRACTED_FIELD.value).get_attribute(
            "value"
        )

    def get_auth_tag(self):
        return self.page.locator(DataTestId.AUTH_TAG_FIELD.value).get_attribute("value")

    def get_iv(self):
        return self.page.locator(DataTestId.IV_FIELD.value).get_attribute("value")

    def get_cyphered_text(self):
        return self.page.locator(DataTestId.CYPHERED_TEXT_FIELD.value).get_attribute(
            "value"
        )

    def get_encryption_details(self):
        encryption_info = EncryptionInfo(
            aes_key=self.get_aes_key(),
            auth_tag=self.get_auth_tag(),
            iv=self.get_iv(),
            encrypted_text=self.get_cyphered_text(),
        )
        return encryption_info
