const http = require('http');
const chalk = require('chalk');
const config = require('./config/default');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-type', 'text/plain');
  res.end('Hello world!\n');
});

server.listen(config.port, config.host, () => {
  const site = `http://${config.host}:${config.port}`;
  console.info(`Server start at ${chalk.green(site)}.`);
});
