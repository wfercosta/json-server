const jose = require('node-jose');

module.exports = {
  async getSymetricKey() {
    const key64 = Buffer.from(process.env.KEY_OAUTH_IRIS).toString('base64');
    return jose.JWK.asKey({
      kid: 'default',
      alg: 'A256GCM',
      kty: 'oct',
      k: key64,
    })
      .then((result) => result)
      .catch((error) => console.log(`[EncryptionMethods - getSymetricKey] An error occurs ${error}`));
  },
  async decryptSymetric(encoded) {
    const symetricKey = await this.getSymetricKey();
    // console.log(`Symetric key ${JSON.stringify(symetricKey)}`);
    return jose.JWE.createDecrypt(symetricKey)
      .decrypt(encoded)
      .then((result) => result.plaintext.toString('utf8'))
      .catch((error) => console.log(`[EncryptionMethods - decryptSymetric] An error occurs ${error}`));
  },
};
