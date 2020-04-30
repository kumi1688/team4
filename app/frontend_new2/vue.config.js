module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    disableHostCheck: true,
  },
  chainWebpack: (config) => {
    config.module.rule('eslint').use('eslint-loader')
      .tap((options) => {
        options.fix = true // auto-fix 옵션
        return options
      })
  },
  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'ko',
      fallbackLocale: 'ko',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
