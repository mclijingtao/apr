export default {
    namespaced: true,
    state: {
        tabsList: [
            {
                path: "/home",
                name: '首页'
            }
        ]
    },
    mutations: {
        selectMenu(state, value) {
                const index = state.tabsList.findIndex (item => item.name === value.meta.name)
                if (index === -1){
                    if (state.tabsList.length >= 3) {
                        state.tabsList.splice(1,1)
                    }
                    state.tabsList.push({
                        path: value.path,
                        name: value.meta.name
                    })
                }else {
                    state.tabsList.splice(index+1,)
                }
        }
    }
}