<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交修改</el-button>
        <el-button @click="$refs.userFormRef.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserInfo',
  created() {
    // 基于浅拷贝，把 Vuex 中的用户信息对象复制一份，交给 userForm，也可以Object.assign({}, this.userInfo)
    this.userForm = { ...this.userInfo }
  },
  computed: {
    // 使用计算属性，可以减少获取参数的麻烦，不然需要这样this.$store.state.user.userInfo
    ...mapState('user', ['userInfo'])
  },
  methods: {
    submit() {
      this.$refs.userFormRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.put('/my/userinfo', this.userForm)
          if (res.code !== 0) return this.$message.error('更新用户信息失败！')
          this.$store.dispatch('user/getUserInfo')
          this.$message.success('更新用户信息成功！')
        } catch (e) {
          console.error('更新用户信息失败！【/my/userinfo】 ' + e)
          // todo 模拟更新用户信息
          this.$store.commit('user/updateUserInfo', this.initUserInfo())
        }
      })
    },
    initUserInfo() {
      return {
        id: 1,
        nickname: '橘子',
        username: '橘子',
        user_pic: 'https://gd-hbimg.huaban.com/3f7e21996fa5b20a164a8e2e1ccd09f0b9729a1023e56-IPJs3b_fw1200webp',
        email: 'orange@gmail.com'
      }
    }
  },
  data() {
    return {
      // 不能直接使用计算属性中的userInfo，由于初始化顺序的原因。所以可以通过在created()中获取userInfo
      userForm: {},
      // 表单的验证规则对象
      userRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
