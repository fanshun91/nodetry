const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { promisify } = require('util');
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFreshCaChe = require('./cache');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath).toString();
const template = Handlebars.compile(source);

module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath);
      const { code, start, end } = range(stats.size, req, res);
      let rs = null;
      res.setHeader('Content-type', contentType);

      if (isFreshCaChe(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, { start, end });
      }
      // 对符合条件的文件进行压缩
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      const dir = path.relative(config.root, filePath);
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',
        files
      };
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(template(data));
    }
  } catch (ex) {
    console.error(ex);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
  }
}
