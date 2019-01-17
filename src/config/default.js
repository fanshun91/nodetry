module.exports = {
  root: process.cwd(),
  host: '127.0.0.1',
  port: 9900,
  compress: /\.(html|css|js|md)/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};
