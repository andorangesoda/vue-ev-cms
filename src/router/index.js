import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
// 路由懒加载
const Reg = () => import('@/views/reg/Reg.vue')
const Login = () => import('@/views/login/Login.vue')
const Main = () => import('@/views/main/Main.vue')
const Home = () => import('@/views/menus/home/Home.vue')
const UserInfo = () => import('@/views/menus/user/UserInfo.vue')
const UserAvatar = () => import('@/views/menus/user/UserAvatar.vue')
const UserPwd = () => import('@/views/menus/user/UserPwd.vue')
const ArtCate = () => import('@/views/menus/article/ArtCate.vue')
const ArtList = () => import('@/views/menus/article/ArtList.vue')

Vue.use(VueRouter)

// 防止vue-router重复调用push函数跳转到同一个路由地址时导致的报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 声明路由规则
const routes = [
  {
    path: '/reg',
    component: Reg
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Main,
    // 开启路由重定向
    redirect: '/home',
    children: [
      { path: 'home', component: Home },
      { path: 'user-info', component: UserInfo },
      { path: 'user-avatar', component: UserAvatar },
      { path: 'user-pwd', component: UserPwd },
      { path: 'art-cate', component: ArtCate },
      { path: 'art-list', component: ArtList }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫, 允许你在路由发生变化前进行一些操作
router.beforeEach((to, from, next) => {
  // 如果用户未登录（无token）且尝试访问需要登录的才能访问的页面时，进行重定向处理
  console.info(store.state.user)
  // 这里有个很奇怪的地方，debugger模式下获取不到store，但是console却可以打印出来！！！！ 看来2种方式都得学会用
  if (!store.state.user.token && to.path !== '/login' && to.path !== '/reg') {
    // 没有token，或者请求不是到登录和注册的，重定向到登录页。加上return，不再执行后续的导航
    console.info('非法登录')
    return next('/login')
  } else {
    // 如果条件满足，允许导航
    next()
  }
})

export default router
