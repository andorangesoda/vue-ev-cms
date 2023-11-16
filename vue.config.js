const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 不用给所有包进行降级兼容处理
  transpileDependencies: false,
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
