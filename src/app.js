const http = require('http');
const path = require('path');
const chalk = require('chalk');
const config = require('./config/default');
const route = require('./helper/route');


const server = http.createServer((req, res) => {
  const filePath = path.join(config.root, req.url);
  route(req, res, filePath);
});

server.listen(config.port, config.host, () => {
  const site = `http://${config.host}:${config.port}`;
  console.info(`Server start at ${chalk.green(site)}.`);
});
