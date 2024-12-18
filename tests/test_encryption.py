import pytest

from tests.constants import EncryptionAlgo
from tests.utils import encrypt


@pytest.mark.parametrize(
    "text, password, encryption_algo",
    [
        ("Hello world", "1a2b3c4d5e6f7g8h", EncryptionAlgo.GCM.value),
        ("My precious", "Wa1t4!t_ dUmbA$$", EncryptionAlgo.GCM.value),
    ],
    ids=[
        "Weak pass without special symbols",
        "Strong pass with special symbols",
    ],
)
def test_can_encrypt_file_with_aes_gcm(cryptic_page, text, password, encryption_algo):
    cryptic_page.click_create_new_button()
    cryptic_page.enter_text_to_encrypt(text)
    cryptic_page.click_save_file_button()
    cryptic_page.select_crypto_algorithm(encryption_algo)
    cryptic_page.enter_password(password)
    cryptic_page.select_aes_key_extractability()
    cryptic_page.click_encrypt_button()
    cryptic_page.click_details()
    actual_data = cryptic_page.get_encryption_details(algo=encryption_algo)
    expected_data = encrypt(
        plain_text=text,
        key=actual_data.aes_key,
        iv=actual_data.iv,
        algo=encryption_algo,
    )
    assert actual_data.encrypted_text == expected_data.encrypted_text
    cryptic_page.click_reset_button()


@pytest.mark.parametrize(
    "text, password, encryption_algo",
    [
        ("Hello world", "1a2b3c4d5e6f7g8h", EncryptionAlgo.CBC.value),
        ("My precious", "Wa1t4!t_ dUmbA$$", EncryptionAlgo.CBC.value),
    ],
    ids=[
        "Weak pass without special symbols",
        "Strong pass with special symbols",
    ],
)
def test_can_encrypt_file_with_aes_cbc(cryptic_page, text, password, encryption_algo):
    cryptic_page.click_create_new_button()
    cryptic_page.enter_text_to_encrypt(text)
    cryptic_page.click_save_file_button()
    cryptic_page.select_crypto_algorithm(encryption_algo)
    cryptic_page.enter_password(password)
    cryptic_page.select_aes_key_extractability()
    cryptic_page.click_encrypt_button()
    cryptic_page.click_details()
    actual_data = cryptic_page.get_encryption_details(algo=encryption_algo)
    expected_data = encrypt(
        plain_text=text,
        key=actual_data.aes_key,
        iv=actual_data.iv,
        algo=encryption_algo,
    )
    assert actual_data.encrypted_text == expected_data.encrypted_text
    cryptic_page.click_reset_button()


@pytest.mark.parametrize(
    "text, passphrase, encryption_algo",
    [
        ("Hello world", "1a2b3c4d5e6f7g8h", EncryptionAlgo.PGP.value),
        ("My precious", "Wa1t4!t_ dUmbA$$", EncryptionAlgo.PGP.value),
    ],
    ids=[
        "Weak pass without special symbols PGP algo",
        "Strong pass with special symbols PGP algo",
    ],
)
def test_can_encrypt_file_with_pgp(cryptic_page, text, passphrase, encryption_algo):
    cryptic_page.click_create_new_button()
    cryptic_page.enter_text_to_encrypt(text)
    cryptic_page.click_save_file_button()
    cryptic_page.select_crypto_algorithm(encryption_algo)
    cryptic_page.enter_passphrase(passphrase)
    cryptic_page.generate_pgp_keys()
