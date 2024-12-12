# ✨🔐✨ [Cryptic](https://the-human-guy.github.io/cryptic)

**Encrypt, Decrypt, and Edit Files in-browser**

## How it works

Cryptic is entirely client-side, it utilizes [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) and [OpenPGP.js](https://openpgpjs.org/)<sup>(by Proton Mail)</sup> to perform encryption within your browser, on your own computer without sending anything to a server

Currently it allows the following encryption modes:

- AES-CBC
- AES-GCM
- PGP

[How to choose AES mode](https://stackoverflow.com/questions/1220751/how-to-choose-an-aes-encryption-mode-cbc-ecb-ctr-ocb-cfb)

## How to run locally

Clone this repo, then:
`bash ./host-web.sh`

## Todo

- Cover with tests
- AES-CTR
- PGP: allow users to choose type (ecc) and openpgp.enums.curve
- More editor & preview modes
