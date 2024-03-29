const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://verbum-server-kd.onrender.com',
      // target: 'https://localhost:5000',
      changeOrigin: true,
    })
  );
};