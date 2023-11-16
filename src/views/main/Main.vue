<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" width="200" height="60" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu class="el-menu-top" mode="horizontal" background-color="#23262E" text-color="#fff" active-text-color="#409EFF">
        <el-menu-item index="1">
            <img v-if="userInfo.user_pic" :src="userInfo.user_pic" alt="" class="avatar" />
            <img v-else src="../../assets/avatar.png" alt="" class="avatar" />
            <span>欢迎 {{userInfo.nickname || userInfo.username}}</span>
        </el-menu-item>
        <el-menu-item index="2" @click="logout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>

    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 此处el-menu中的router用于点击子菜单时进行路由，是router="true"的简写形式 -->
        <el-menu :default-active="$route.path" background-color="#23262E" text-color="#fff" active-text-color="#409EFF" router>
          <!-- template 是一个虚拟标签，此处用来包裹多个标签，便于使用v-for循环创建多个标签 -->
          <template v-for="item in menus">
            <!-- 有子菜单，展示本级和子菜单 -->
            <el-submenu v-if="item.children" :key="item.indexPath" :index="item.indexPath">
              <!--  slot="title"具名插槽, 即v-slot="title", 可简写为#title -->
              <template #title>
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <!-- 需要循环创建子菜单 -->
              <el-menu-item v-for="sub in item.children" :key="sub.indexPath" :index="sub.indexPath">
                <i :class="sub.icon"></i>
                <span>{{ sub.title }}</span>
              </el-menu-item>
            </el-submenu>
            <!-- 没有子菜单，展示本级 -->
            <el-menu-item v-else :key="item.indexPath" :index="item.indexPath">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <!-- 这里router-view就是一个占位符，用于在渲染时放置匹配的路由组件（router/index.js中配置）。这种方式可以让你在同一个应用中切换不同的视图组件而不需要重新加载整个页面-->
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© 版权所有 </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'Main',
  data() {
    return {
      // 构造假数据
      menus: [
        {
          indexPath: '/home',
          title: '首页',
          icon: 'el-icon-s-home',
          children: null
        },
        {
          indexPath: '2',
          title: '文章管理',
          icon: 'el-icon-s-order',
          children: [
            {
              indexPath: '/art-cate',
              title: '文章分类',
              icon: 'el-icon-s-data'
            },
            {
              indexPath: '/art-list',
              title: '文章列表',
              icon: 'el-icon-document-copy'
            }
          ]
        },
        {
          indexPath: '3',
          title: '个人中心',
          icon: 'el-icon-user-solid',
          children: [
            {
              indexPath: '/user-info',
              title: '基本资料',
              icon: 'el-icon-s-operation'
            },
            {
              indexPath: '/user-avatar',
              title: '更换头像',
              icon: 'el-icon-camera'
            },
            {
              indexPath: '/user-pwd',
              title: '重置密码',
              icon: 'el-icon-key'
            }
          ]
        }
      ]
    }
  },
  methods: {
    logout() {
      // 询问用户是否退出登录
      this.$confirm('您确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 1. 清空 token
        this.$store.commit('updateToken', '')
        // 2. 跳转到登录页面
        this.$message.success('退出成功')
        this.$router.push('/login')
      }).catch(() => {
        // 取消时执行
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    async initMenus() {
      try {
        const { data: res } = await axios.get('my/menus')
        if (res.code === 0) {
          this.menus = res.data
        }
      } catch (error) {
        console.error('获取获取左侧菜单列表失败！【/my/menus】' + error)
      }
    }
  },
  created() {
    if (this.token) {
      // 5、调用编写好的方法获取用户信息
      console.info('created()方法执行, 获取用户信息!')
      this.$store.dispatch('user/getUserInfo')
      // 菜单数据不用放到vuex中，直接获取左侧菜单列表即可
      this.initMenus()
    } else {
      // 未获取到token则跳转到登录页
      this.$router.push('/login')
    }
  },
  computed: {
    // 6、扩展用户信息，并渲染到页面。此处不用mapState的话，需要this.$store.state.user.userInfo
    ...mapState('user', ['userInfo', 'token'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 处理左侧边栏边缘部分不整齐
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
