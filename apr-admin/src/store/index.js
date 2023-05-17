import Vue from 'vue'
import Vuex from "vuex"
// 导入菜单数据模块
import menu from "./menu"

// 导入面包屑数据模块
import breadcrumb from "./breadcrumb"

// 应用Vuex插件
Vue.use(Vuex)

// 创建并暴露store实例
export default new Vuex.Store({
    modules:{
        menu,
        breadcrumb
    }
})