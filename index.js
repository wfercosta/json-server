const jsonServer = require('json-server');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const routes = require('./routes.json');

const db = low(new FileSync('db.json'));
const server = jsonServer.create();
const port = 3000;

Object.keys(routes).forEach((key) => {
  const { method, collection } = routes[key];
  console.log(`\nRegistering route '${key}' with method '${method}' -> '${collection}'`);
  server[method](key, (req, res, next) => {
    res.jsonp(db.get(collection).value());
  });
});

server.listen(port, () => {
  console.log(`\nServer is running on port ${port}`);
});
