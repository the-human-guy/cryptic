from playwright.sync_api import Page

from tests.constants import EncryptionInfo, Locators


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
        self.click_button(Locators.CREATE_NEW_FILE_BTN.value)
        return self

    def select_crypto_algorithm(self, algorithm: str):
        self.page.select_option(Locators.CRYPTO_ALGO_DROPDOWN.value, value=algorithm)
        return self

    def select_aes_key_extractability(self, is_extractable: str):
        self.page.select_option(
            Locators.AES_KEY_EXTRACTABILITY_DROPDOWN.value, value=is_extractable
        )
        return self

    def enter_password(self, text: str):
        self.fill_form(Locators.PASSWORD_FIELDS.value, text=text)
        return self

    def click_encrypt_button(self):
        self.click_button(Locators.ENCRYPT_BTN.value)
        return self

    def enter_text_to_encrypt(self, text: str):
        self.fill_form(Locators.TEXT_TO_ENCRYPT_TEXTAREA.value, text=text)

    def click_details(self):
        self.page.click(Locators.SUMMARY_BTN.value)

    def get_aes_key(self):
        return self.page.locator("#cryptoInfo_aesKeyExtracted_base64").get_attribute(
            "value"
        )

    def get_auth_tag(self):
        return self.page.locator("#cryptoInfo_authTag_base64").get_attribute("value")

    def get_iv(self):
        return self.page.locator("#cryptoInfo_iv_base64").get_attribute("value")

    def get_cyphered_text(self):
        return self.page.locator("#cryptoInfo_cipherText_base64").get_attribute("value")

    def get_encryption_details(self):
        encryption_info = EncryptionInfo(
            aes_key=self.get_aes_key(),
            auth_tag=self.get_auth_tag(),
            iv=self.get_iv(),
            encrypted_text=self.get_cyphered_text(),
        )
        return encryption_info
