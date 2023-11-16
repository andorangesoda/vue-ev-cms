const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 不用给所有包进行降级兼容处理
  transpileDependencies: false,
  // 服务器部署的路径，默认为'/'。设置相对路径可以部署在服务器的任意地方，但不推荐。
  publicPath: './',
  // 打包优化项配置
  configureWebpack: {
    externals: {
      // import导入的包名: windows全局成员名称
      echarts: 'echarts',
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      'vue-quill-editor': 'VueQuillEditor',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      dayjs: 'dayjs',
      'vuex-persistedstate': 'createPersistedState'
    }
  }
})
