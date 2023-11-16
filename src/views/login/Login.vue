<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <!-- 使用Vue Router的push()方法导航到'/reg'的路由, push()中名称取决于indx.js中设置的路由名称 -->
          <el-button type="primary" class="btn-login" @click="login" plain>登录</el-button>
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const uuid = require('uuid')
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', tigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      // async和await是JS中处理异步操作的语法，它的主要作用是让异步代码更具可读性和易于管理，以一种类似同步代码的方式编写异步操作。
      // this.$refs.loginFormRef.validate(async valid => {
      this.$refs.loginFormRef.validate(valid => {
        // 参数校验
        if (!valid) return
        try {
          // 发起登录请求，其中{data: res}是ES6解构赋值的语法，它的作用是从Promise异步请求的响应中提取数据并赋值给res
          // const { data: res } = await this.$http.post('/api/login', this.loginForm)
          // if (res.code === 0) return this.$message.error(res.message)
          // 登录成功
          // this.$message.success(res.message)
          // todo 模拟登录成功
          const isSuccess = (this.loginForm.username === 'admin' && this.loginForm.password === '111111')
          if (!isSuccess) return this.$message.error('用户名或密码错误')
          this.$message.success('登录成功')

          // 保存token到vuex中
          this.$store.commit('user/updateToken', uuid.v4()) // res.token
          // 登录成功跳转到后台首页
          this.$router.push('/')
        } catch (error) {
          console.error('登录失败！' + error.message)
          this.$message.error(error.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url('../../assets/images/login_bg.png') center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
