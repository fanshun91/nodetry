const fs = require('fs');
// const path = require('path');
const { promisify } = require('util');
// const Handlebars = require('handlebars');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const source = fs.readFileSync(path.resolve(__dirname, '../template/dir.tpl'));

module.exports = async function(req, res, path) {
  try {
    const stats = await stat(path);
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/plain');
      fs.createReadStream(path).pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(path);
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/plain');
      res.end(files.join(','));
    }
  } catch(ex) {
    console.error(ex);
    res.statusCode = 404;
    res.setHeader('Content-type', 'text/plain');
    res.end(`${path} is not exist.`);
  }
};
