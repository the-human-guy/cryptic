from base64 import b64decode, b64encode

from Cryptodome.Cipher import AES


def encrypt(plain_text, key, iv):
    # generate a random salt
    key_bytes = b64decode(key)  # key_base64 == exported_key + '='
    iv_bytes = b64decode(iv)

    # create cipher config
    cipher_config = AES.new(key_bytes, AES.MODE_GCM, nonce=iv_bytes)

    # return a dictionary with the encrypted text
    cipher_text, tag = cipher_config.encrypt_and_digest(bytes(plain_text, "utf-8"))
    return {
        "cipher_text": b64encode(cipher_text).decode("utf-8"),
        "nonce": b64encode(cipher_config.nonce).decode("utf-8"),
        "tag": b64encode(tag).decode("utf-8"),
    }


# 1. соль генерится рандомно
# 2. key - результат kdf: пароль шифруется по алгоритму с кастомными конфигами. ключ определенной длины
# 3.


def decrypt(enc_dict, password):
    pass


#
# test = encrypt(
#     plain_text='12345',
#     key='6gaNF84jk4UZXv2sE6nmPIaK9ANPR0Ygsz7GkSTLBEI',
#     iv='6gaNF84jk4UZXv2s=',
# )
#
# print(test)
