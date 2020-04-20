module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://13.125.207.178:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
}
