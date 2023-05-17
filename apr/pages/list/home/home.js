const app = getApp()
const serverUrl = app.globalData.serverUrl

Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        cur: Number
    },
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        tablist: ['全部', '动作', '搞笑', '幻想', '冒险', '热血', '校园'],
        navlist: ['全部', '中国', '日本', '欧美', '2023', '2022', '2021', '2020', '2019', '2018'],
        tabCur: 0,
        scrollLeft: 0,
        navCur: 0,
        typelist: [],
        num: 5,
        scrollTop: 0
    },

    lifetimes: {
        attached: function () {
            this.setData({
                navCur: this.data.cur
            })
            this.gettype()
        },
    },

    methods: {
        // 搜索页面按钮
        tosearch() {
            wx.navigateTo({
                url: '/pages/navigation/search/search',
            })
        },

        // tab选项
        tabSelect(e) {
            this.setData({
                tabCur: e.currentTarget.dataset.id,
                scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
                scrollTop: 0
            })
            this.gettype()

        },

        // nav选项
        navSelect(e) {
            this.setData({
                navCur: e.currentTarget.dataset.id,
                scrollTop: 0
            })
            this.gettype()
        },

        // 获取分类列表
        gettype() {
            wx.request({
                url: serverUrl + '/data/typelist',
                method: 'get',
                data: {
                    tabCur: this.data.tabCur,
                    navCur: this.data.navCur,
                    num: this.data.num
                },
                success: res => {
                    this.setData({
                        typelist: res.data,
                    })
                }
            })
        },

        // 加载更多
        ReachBottom() {
            if (this.data.num > this.data.typelist.length) {
                return wx.showToast({
                    title: '没有下一页',
                })
            }
            this.setData({
                num: this.data.num + 5
            })
            this.gettype()
        }
    }
})