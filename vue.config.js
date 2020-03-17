//代理，不用跨域
module.exports = {
  devServer: {
    proxy: {
      '/api': { //凡是以/api开头的请求走代理
        target: 'http://118.24.25.7:5000',
        changeOrigin: true
      }
    }
  }
}