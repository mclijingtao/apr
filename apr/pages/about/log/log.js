const app = getApp()
const serverUrl = app.globalData.serverUrl

Page({
    data: {
        list: [],
        hasList: false,
        num: 5,
        user_id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                user_id: userInfo.id
            })
            this.getLog()
        }
    },

    // 获取用户浏览列表
    getLog() {
        wx.request({
            url: serverUrl + '/data/userLog',
            method: 'get',
            data: {
                user_id: this.data.user_id,
                num: this.data.num
            },
            success: res => {
                if (res.data.length > 0) {
                    this.setData({
                        list: res.data,
                        hasList: true
                    })
                }
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (this.data.num > this.data.list.length) {
            return wx.showToast({
                title: '没有更多浏览',
            })
        } else {
            this.setData({
                num: this.data.num + 5
            })
            this.getLog()
        }
    },
})