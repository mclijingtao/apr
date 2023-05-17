import Vue from 'vue'
import VueRouter from "vue-router"
import Cookie from "js-cookie"
import Main from "../views/Main.vue"
import Home from "../views/Home.vue"
import User from "../views/User.vue"
import Admin from "@/views/Admin.vue"
import Anime from "@/views/Anime.vue"
import Comment from "@/views/Comment.vue"
import Login from "@/views/Login.vue";

// 应用路由插件
Vue.use(VueRouter)

// 创建路由实例，配置路由规则
const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: Main,
            redirect: '/home',
            children: [
                {
                    path: "home",
                    name: "home",
                    component: Home,
                    meta: {name: '首页'}
                },
                {
                    path: "user",
                    component: User,
                    meta: {name: '用户管理'}
                },
                {
                    path: "admin",
                    component: Admin,
                    meta: {name: '管理员管理'}
                },
                {
                    path: "anime",
                    component: Anime,
                    meta: {name: '信息管理'}
                },
                {
                    path: "comment",
                    component: Comment,
                    meta: {name: '评论管理'}
                }
            ]
        },
        {
            path: "/login",
            name: 'login',
            component: Login,
        }
    ],
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
    const token = Cookie.get('token')
    if (!token && to.name !== 'login') {
        next({name: 'login'})
    } else if (token && to.name === 'login') {
        next({name:'home'})
    }else{
        next()
    }
})

//暴露router
export default router;
