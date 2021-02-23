module.exports = {
  devServer: {
    proxy: {
      "/" : {
        target: "http://127.0.0.1:82",
        ws: true,
        changeOrigin : true,
      }
    }
  }
}