const jsonServer = require('json-server');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const encryptionMethods = require('./encryptionMethods');
const routes = require('./routes.json');

const db = low(new FileSync('db.json'));
const server = jsonServer.create();
const port = 3000;

const DEFAULT_KEY = 'default';

const getObjectKey = (token) => {
  const decryptedInfo = encryptionMethods.decryptSymetric(token);
  const payload = JSON.parse(decryptedInfo);

  return payload[process.env.ENCRYPTED_KEY] || DEFAULT_KEY;
};

const buildResponse = (collection, objectKey) => {
  const responseKey = db.get(collection).get(objectKey).value()
    || db.get(collection).get(DEFAULT_KEY).value();

  return responseKey;
};

Object.keys(routes).forEach((key) => {
  const { method, collection } = routes[key];
  console.log(`\nRegistering route '${key}' with method '${method}' -> '${collection}'`);
  server[method](key, (req, res, next) => {
    const token = req.headers.Authorization;
    const objectKey = getObjectKey(token);
    const response = buildResponse(collection, objectKey);

    console.log(`\nAccess to route ${key}`);
    res.jsonp(response);
  });
});

server.listen(port, () => {
  console.log(`\nServer is running on port ${port}`);
});
