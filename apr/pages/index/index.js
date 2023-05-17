const app = getApp()
const serverUrl = app.globalData.serverUrl

Page({
    data: {
        pageNav: 'navigationPage', // tabbar起始默认页设置
        list: [],
        cur:0
    },
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        if (!userInfo) {
            this.setData({
                pageNav: 'aboutPage'
            })
        }
    },
    // 设置选中页
    changeNav(e) {
        this.setData({
            pageNav: e.currentTarget.dataset.nav
        })
    },

    // 跳转页面方法
    gopage(e) {
        this.setData({
            pageNav: 'listPage',
            cur: e.detail.cur
        })
    }
})