const app = getApp()
const serverUrl = app.globalData.serverUrl

Page({
    data: {
        value: '',
        input_value: '',
        anime_list: [],
        anime_num: 5,
        isloading: false,
        search_log: [],
        haslog: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let search_log = wx.getStorageSync('search_log')
        if (search_log) {
            this.setData({
                search_log: search_log,
                haslog: true
            })
        }
    },

    // 获取记录
    get_log(e) {
        this.setData({
            value: e.currentTarget.dataset.value
        })
    },

    // 清除记录
    clear() {
        wx.setStorage({
            key: 'search_log',
            data: [],
            success: (res) => {
                this.setData({
                    search_log: [],
                    haslog: false
                })
            }
        })
    },

    // 搜索按钮
    search(e) {
        if (e.detail.value.search_value === '') {
            wx.showToast({
                title: '输入框不能为空!',
                icon: 'error',
                duration: 1000
            })
            setTimeout(function () {
                wx.hideToast()
            }, 2000)
        } else {
            this.data.search_log.push(e.detail.value.search_value)
            if (this.data.search_log.length > 4) {
                this.data.search_log.shift()
            }
            wx.setStorage({
                key: 'search_log',
                data: this.data.search_log
            })

            this.setData({
                value: '',
                search_log: this.data.search_log,
                haslog: true,
                input_value: e.detail.value.search_value
            })
            this.get_anime()
        }
    },

    // 获取动漫
    get_anime() {
        this.setData({
            isloading: true
        })
        wx.showLoading({
            title: '动漫搜索中...',
        })
        wx.request({
            url: serverUrl + '/data/search',
            method: 'get',
            data: {
                value: this.data.input_value,
                anime_num: this.data.anime_num
            },
            success: res => {
                this.setData({
                    anime_list: res.data,
                    isloading: false
                })
                wx.hideLoading();
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    // 触底加载
    onReachBottom() {
        if (this.data.anime_num > this.data.anime_list.length) {
            this.setData({
                input_value: ''
            })
            return wx.showToast({
                title: '没有下一页',
            })
        }
        if (this.data.isloading) return
        this.setData({
            anime_num: this.data.anime_num + 5
        })
        this.get_anime()
    },

})