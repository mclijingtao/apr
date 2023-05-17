const app = getApp()
const serverUrl = app.globalData.serverUrl

Page({
    data: {
        userInfo: {},
        title: '',
        anime_id: 0,
        anime: [],
        state: [],
        comment: [],
        num: 5,
        value: '',
        core: 0,
        modal: false,
        hasScore: false,
        hasCollect: false,
        hasShare: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取Storage用户信息
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo: userInfo
            })
        }
        this.setData({
            title: options.anime_name,
            anime_id: options.anime_id
        })
        this.find()
        this.state()
        this.log()
        this.getComment()
    },

    // 关闭modal
    hideModal() {
        this.setData({
            modal: false,
            core: 0
        })
    },

    // 查询动漫信息
    find() {
        wx.showLoading({
            title: '数据加载...',
        })
        wx.request({
            url: serverUrl + '/data/find',
            method: 'get',
            data: {
                anime_id: this.data.anime_id
            },
            success: res => {
                this.setData({
                    anime: res.data
                })
                wx.hideLoading();
            }
        })
    },

    // 查询操作数据
    state() {
        let user_id = ''
        if (this.data.userInfo.id) {
            user_id = this.data.userInfo.id
        }
        wx.request({
            url: serverUrl + '/data/state',
            method: 'get',
            data: {
                user_id: user_id,
                anime_id: this.data.anime_id
            },
            success: res => {
                this.setData({
                    state: res.data
                })
                if (this.data.userInfo.id) {
                    if (res.data[2].length > 0) {
                        this.setData({
                            hasScore: true
                        })
                    }
                    if (res.data[3].length > 0) {
                        this.setData({
                            hasCollect: true
                        })
                    }
                    if (res.data[4].length > 0) {
                        this.setData({
                            hasShare: true
                        })
                    }
                }
                wx.hideLoading();
            }
        })
    },

    // 评分按钮
    score() {
        if (this.data.userInfo.id && !this.data.hasScore) {
            this.setData({
                modal: true,
            })
        }
    },

    // 获取评分值
    core(e) {
        this.setData({
            core: Number(e.currentTarget.dataset.id),
            hasScore: true
        })
    },

    // 评分
    goScore() {
        wx.request({
            url: serverUrl + '/data/score',
            method: 'post',
            data: {
                anime_id: this.data.anime_id,
                user_id: this.data.userInfo.id,
                anime_score: this.data.core + 1
            },
            success: res => {
                this.state()
                this.hideModal()
                wx.showToast({
                    title: '评分成功!',
                    icon: 'success',
                    duration: 1000
                })
                setTimeout(function () {
                    wx.hideToast()
                }, 1500)
            }
        })
    },

    // 收藏按钮
    collect() {
        if (this.data.userInfo.id) {
            wx.request({
                url: serverUrl + '/data/collect',
                method: 'post',
                data: {
                    anime_id: this.data.anime_id,
                    user_id: this.data.userInfo.id
                },
                success: res => {
                    this.state()
                    this.setData({
                        hasCollect: !this.data.hasCollect
                    })
                }
            })
        }
    },

    // 浏览记录
    log() {
        if (this.data.userInfo.id) {
            wx.request({
                url: serverUrl + '/data/log',
                method: 'post',
                data: {
                    anime_id: this.data.anime_id,
                    user_id: this.data.userInfo.id
                }
            })
        }
    },

    // 获取评论
    getComment() {
        wx.request({
            url: serverUrl + '/data/getComment',
            method: 'get',
            data: {
                anime_id: this.data.anime_id,
                num: this.data.num
            },
            success: res => {
                this.setData({
                    comment: res.data
                })
            }
        })
    },

    // 上传评论
    comment(e) {
        if (e.detail.value.comment !== '') {
            wx.request({
                url: serverUrl + '/data/comment',
                method: 'post',
                data: {
                    anime_id: this.data.anime_id,
                    user_id: this.data.userInfo.id,
                    comment_content: e.detail.value.comment
                },
                success: res => {
                    this.setData({
                        value: ''
                    })
                    this.getComment()
                }
            })
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (this.data.num > this.data.comment.length) {
            return wx.showToast({
                title: '没有更多评论',
            })
        } else {
            this.setData({
                num: this.data.num + 5
            })
            this.getComment()
        }
    },

    /**
     * 用户点击右上角分享
     */
    // 自定义分享
    onShareAppMessage(res) {
        // 来自页面内转发按钮
        if (res.from === 'button') {
            if (this.data.userInfo.id) {
                wx.request({
                    url: serverUrl + '/data/share',
                    method: 'post',
                    data: {
                        user_id: this.data.userInfo.id,
                        anime_id: this.data.anime_id
                    },
                    success: res => {
                        this.setData({
                            hasShare: true
                        })
                        this.state()
                    }
                })
            }
        }
        return {
            title: `分享动漫《${this.data.title}》`,
            path: `/pages/list/anime/anime?anime_id=${this.data.anime_id}&anime_name=${this.data.title}`
        }
    }
})