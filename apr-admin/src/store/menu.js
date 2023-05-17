export default {
    namespaced: true,
    state: {
        isCollapse: false //控制菜单是否展开
    },
    mutations: {
        //修改菜单展开状态
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse;
        }
    }
}