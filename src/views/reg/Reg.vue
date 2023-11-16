<template>
    <!-- 注册页面的整体盒子 -->
    <div class="reg-container">
        <!-- 注册的盒子 -->
        <div class="reg-box">
            <!-- 标题的盒子 -->
            <div class="title-box"></div>
            <!-- 注册的表单区域 -->
            <el-form :model="regForm" :rules="regRules" ref="regFormRef" class="reg-form">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="regForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="regForm.password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>

                <el-form-item prop="repassword">
                    <el-input prefix-icon="el-icon-lock" v-model="regForm.repassword" placeholder="请再次确认密码" show-password></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="btn-reg" @click="regNewUser" plain>注册</el-button>
                    <el-link type="info" @click="$router.push('/login')">去登录</el-link>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Reg',
  data() {
    // 验证密码是否相同
    const samePwd = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      // 参数校验
      regRules: {
        username: [
          { require: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    regNewUser() {
      // 兜底校验
      this.$refs.regFormRef.validate(valid => {
        if (!valid) return
        console.info('校验通过！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
    background: url('@/assets/images/login_bg.png') center;
    background-size: cover;
    height: 100%;

    .reg-box {
        width: 400px;
        height: 335px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .title-box {
            height: 60px;
            background: url('../../assets/images/login_title.png') center no-repeat;
        }

        .reg-form {
            padding: 0 20px;
        }

        .btn-reg {
            width: 100%;
        }
    }
}
</style>
