from base64 import b64decode, b64encode
from dataclasses import dataclass
from pathlib import Path

from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad

from tests.constants import EncryptionAlgo


@dataclass
class EncryptionResult:
    encrypted_text: str


def encrypt(plain_text: str, key: str, iv: str, algo: str):
    key_bytes = b64decode(key)
    iv_bytes = b64decode(iv)
    if algo == EncryptionAlgo.GCM.value:
        cipher_config = AES.new(key=key_bytes, mode=AES.MODE_GCM, nonce=iv_bytes)
        cipher_text, tag = cipher_config.encrypt_and_digest(bytes(plain_text, "utf-8"))
    else:
        plain_text_pad_aes = pad(plain_text.encode(), AES.block_size)
        cipher_config = AES.new(key=key_bytes, mode=AES.MODE_CBC, iv=iv_bytes)
        cipher_text = cipher_config.encrypt(plain_text_pad_aes)
    encryption_result = EncryptionResult(
        encrypted_text=b64encode(cipher_text).decode("utf-8")
    )
    return encryption_result


def decrypt(enc_dict, password):
    pass


def find_project_root(start_path=None):
    start_path = start_path or Path(__file__).resolve()
    current_path = start_path
    while current_path != current_path.root:
        if (current_path / ".gitignore").exists():
            return current_path
        current_path = current_path.parent
    raise FileNotFoundError("Project root not found")
