export default {
  MD5: () => ({ toString: () => 'mock-md5-hash' }),
  SHA1: () => ({ toString: () => 'mock-sha1-hash' }),
  SHA256: () => ({ toString: () => 'mock-sha256-hash' }),
  SHA512: () => ({ toString: () => 'mock-sha512-hash' }),
  enc: {
    Base64: {
      stringify: () => 'mock-base64',
      parse: () => 'mock-decoded',
    },
    Utf8: {
      stringify: () => 'mock-utf8',
      parse: () => 'mock-utf8',
    },
  },
}
