const { cache } = require('../config/default');

function refreshRes(stats, res) {
  const {
    maxAge,
    etag,
    expires,
    cacheControl,
    lastModified,
  } = cache;

  if (expires) {
    const millSeconds = Date.now() + maxAge * 1000;
    const expireTime = (new Date(millSeconds)).toUTCString();
    res.setHeader('Expires', expireTime);
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    res.setHeader('last-Modified', stats.mtime.toUTCString());
  }

  if (etag) {
    res.setHeader('Etag', `${stats.size}-${stats.mtime}`);
  }
}

module.exports = function(stats, req, res) {
  refreshRes(stats, res);

  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  if (!lastModified && !etag) {
    return false;
  }

  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  if (etag && etag !== res.getHeader('ETag')) {
    return false;
  }

  return true;
};
