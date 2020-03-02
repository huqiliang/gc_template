module.exports = {
  devServer: {
    // 设置代理
    proxy: {
      "/context": {
        target: process.env.api,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/context": "/"
        }
      }
    }
  }
};
