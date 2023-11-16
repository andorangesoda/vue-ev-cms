import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'

export default {
  namespaced: true,
  // 下载并导入包后，将此持久化组件配置为vuex的插件
  plugins: [createPersistedState()],
  state: {
    // 用来存储登录成功后token
    token: '',
    // 1、定义接受用户信息的变量，默认是空对象{}即可，此处因为http接口不能使用，暂时用假数据
    userInfo: {
      id: 1,
      nickname: '创作者去玩儿23',
      username: '创作者去玩儿23',
      user_pic: 'https://gd-hbimg.huaban.com/3f7e21996fa5b20a164a8e2e1ccd09f0b9729a1023e56-IPJs3b_fw1200webp',
      email: 'ev-official@gmail.com'
    }
  },
  mutations: {
    updateToken(state, newToken) {
      state.token = newToken
    },
    updateUserInfo(state, userInfo) {
      // 3、通过actions提交参数到mutations中统一操作state中的userInfo变量
      state.userInfo = userInfo
    }
  },
  actions: {
    // 2、定义获取用户信息方向，将结果赋值到先前定义的变量中
    async getUserInfo(ctx) {
      try {
        // 此处不能使用this.$http.get()，因为this指向的是Store实例对象，而不是Vue实例对象
        const { data: res } = await axios.get('/my/userinfo')
        if (res.code === 0) {
          ctx.commit('user/updateUserInfo', res.data)
        }
      } catch (error) {
        console.log('获取用户信息失败!【/my/userinfo】' + error)
      }
    }
  },
  getters: {}
}
