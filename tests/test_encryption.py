import pytest

from tests.utils import encrypt


@pytest.mark.parametrize(
    "text, password",
    [("Hello world", "12345678"), ("My precious", "Wa1t4!t_dUmbA$$")],
)
def test_can_encrypt_file_with_aes_gcm(cryptic_page, text, password):
    cryptic_page.click_create_new_button()
    cryptic_page.enter_text_to_encrypt(text)
    cryptic_page.click_save_file_button()
    cryptic_page.select_crypto_algorithm("GCM")
    cryptic_page.enter_password(password)
    cryptic_page.select_aes_key_extractability("true")
    cryptic_page.click_encrypt_button()
    cryptic_page.click_details()
    actual_data = cryptic_page.get_encryption_details()
    expected_data = encrypt(plain_text=text, key=actual_data.aes_key, iv=actual_data.iv)
    assert actual_data.encrypted_text == expected_data.encrypted_text
    cryptic_page.click_reset_button()
