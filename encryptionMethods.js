const jose = require('node-jose');

export default class EncryptionMethods {
  static getSymetricKey() {
    const key64 = Buffer.from(process.env.KEY_OUATH_IRIS).toString('base64');
    return jose.JWK.asKey({
      kid: 'default',
      alg: 'A256GCM',
      kty: 'oct',
      k: key64,
    }).then((result) => result);
  }

  static decryptSymetric(encoded) {
    const symetricKey = this.getSymetricKey();
    return jose.JWE.createDecrypt(symetricKey)
      .decrypt(encoded)
      .then((result) => result.plaintext.toString('utf8'));
  }
}
