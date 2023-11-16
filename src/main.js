import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
// 由于引入了CDN的element-ui的css，此处就注释掉或删除即可
// import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '@/assets/global.less'
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

Vue.use(ElementUI)
Vue.use(VueQuillEditor)

// 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:9090'
// 将axios挂载到Vue原型上
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 将token加到请求头中
  if (config.url.startsWith('/my')) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function(error) {
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  return response
}, function(error) {
  if (error.response.status === 401) {
    // 说明token失效或者token错误导致返回401，则清空vuex中的token，并跳转到登录页
    store.commit('user/updateToken', '')
    router.push('/login')
    this.$message.error('登录过期，请重新登录')
  }
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
