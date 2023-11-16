<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 为啥不能直接定义一个变量，将‘../../../assets/images/avatar.jpg’绑定到这个变量并显示出来呢，而要借助if..else呢？
          因为，webpack打包时会将写死的src会把本地图片打包到出口，当遇到变量时它会直接将变量的值设置给src。
          从而导致本地图片加载不出来，如果是HTTP地址是可以的。img的src只能设置BASE64和URL。
       -->
      <img v-if="avatar" :src="avatar" alt="" />
      <img v-else src="../../../assets/images/avatar.jpg" alt="" />

      <div class="btn-box">
        <!-- 添加一个隐藏的文件输入框，即type="file"，然后利用accept接受所有格式的图片 -->
        <input type="file" style="display: none" accept="image/*" ref="fileInp" @change="onAvatarChange">
        <!-- 为input标签设置一个fileInp引用属性，然后在选择图片按钮上进行绑定并调用，模拟点击事件 -->
        <el-button type="primary" icon="el-icon-plus" @click="$refs.fileInp.click()">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="!avatar" @click="onUploadAvatar">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    onAvatarChange(e) {
      // 用户选择的文件列表（伪数组）
      const files = e.target.files
      if (files.length === 0) {
        // 没有选择文件或点击取消时，不处理
        this.avatar = ''
      } else {
        // 获取用户选择的图片并渲染出来
        const fileReader = new FileReader()
        // 基于FileReader 把文件读取为BASE64字符串(也成为DataURL)
        fileReader.readAsDataURL(files[0])
        // 监听加载事件，但此处不能使用function() {this.avatar = e.target.result }，不然this就指向的是fileReader这个对象
        fileReader.onload = (e) => {
          // 通过e.target.result获取读到的结果，值是BASE64字符串。
          this.avatar = e.target.result
        }
      }
    },
    async onUploadAvatar() {
      // 上传用户选择的文件，并更新用户信息
      try {
        const { data: res } = await this.$http.patch('/my/update/avatar', { avatar: this.avatar })
        if (res.code !== 0) return this.$message.error('上传头像失败！')
        this.$message.success('上传头像成功！')
        // 它一个 Vuex store 的 action，而 Vuex action 默认是一个异步操作（返回一个 Promise）
        // 此处可以添加一个await, 这样确保在获取用户信息完成之前，不会执行后续的逻辑。
        await this.$store.dispatch('user/getUserInfo')
      } catch (e) {
        console.error('上传头像异常！' + e)
        // todo 模拟上传新头像
        this.$store.commit('user/updateUserInfo', this.initAvatarInfo(this.avatar))
      }
    },
    initAvatarInfo(avatarImg) {
      return {
        id: 1,
        nickname: '新橘子',
        username: '新橘子',
        user_pic: avatarImg,
        email: 'new-orange@gmail.com'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
</style>
