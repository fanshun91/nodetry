const http = require('http');
const path = require('path');
const chalk = require('chalk');
const config = require('./config/default');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');

class Server {
  constructor(userConfig) {
    this.config = Object.assign({}, config, userConfig);
  }

  start() {
    const config = this.config;
    const server = http.createServer((req, res) => {
      const filePath = path.join(config.root, req.url);
      route(req, res, filePath, config);
    });

    server.listen(config.port, config.host, () => {
      const site = `http://${config.host}:${config.port}`;
      console.info(`Server start at ${chalk.green(site)}.`);
      openUrl(site);
    });
  }
}

module.exports = Server;
