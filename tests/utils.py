from base64 import b64decode, b64encode
from dataclasses import dataclass

from Cryptodome.Cipher import AES


@dataclass
class EncryptionResult:
    encrypted_text: str
    iv: str
    tag: str


def encrypt(plain_text, key, iv):
    key_bytes = b64decode(key)
    iv_bytes = b64decode(iv)
    cipher_config = AES.new(key_bytes, AES.MODE_GCM, nonce=iv_bytes)
    cipher_text, tag = cipher_config.encrypt_and_digest(bytes(plain_text, "utf-8"))
    encryption_result = EncryptionResult(
        encrypted_text=b64encode(cipher_text).decode("utf-8"),
        iv=b64encode(cipher_config.nonce).decode("utf-8"),
        tag=b64encode(tag).decode("utf-8"),
    )
    return encryption_result


def decrypt(enc_dict, password):
    pass
