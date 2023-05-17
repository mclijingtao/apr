const app = getApp()
const serverUrl = app.globalData.serverUrl

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        showModal: false
    },
    hideModal() {
        this.setData({
            showModal: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取Storage用户信息
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo: userInfo,
                hasUserInfo: true,
            })
        }
    },
    onChooseAvatar(e) {
        const id = JSON.stringify(this.data.userInfo.id)
        wx.uploadFile({
            url: serverUrl + '/uploadFile',
            filePath: e.detail.avatarUrl, //上传文件的path
            name: 'head',
            formData: {
                id: id
            },
            header: {
                "content-type": "multipart/form-data"
            },
            success: (res) => {
                this.setData({
                    userInfo: {
                        id: this.data.userInfo.id,
                        head: JSON.parse(res.data).path,
                        name: this.data.userInfo.name
                    }
                })
                wx.setStorage({
                    key: 'userInfo',
                    data: this.data.userInfo
                })
                wx.showToast({
                    title: '设置成功!',
                    icon: 'success',
                    duration: 1000
                })
                setTimeout(function () {
                    wx.hideToast()
                }, 2000)
            },
            fail: function (err) {
                wx.showToast({
                    title: '设置失败!',
                    icon: 'error',
                    duration: 1000
                })
                setTimeout(function () {
                    wx.hideToast()
                }, 2000)
            }
        })
    },
    set() {
        this.setData({
            showModal: true
        })
    },
    setPassword(e) {
        if (e.detail.value.password.length == 0) {
            wx.showToast({
                title: '输入框不能为空!',
                icon: 'error',
                duration: 1000
            })
            setTimeout(function () {
                wx.hideToast()
            }, 2000)
        } else {
            if (this.data.userInfo.name !== '微信用户') {
                wx.request({
                    url: serverUrl + '/setPassword',
                    method: 'post',
                    data: {
                        id: this.data.userInfo.id,
                        password: e.detail.value.password
                    },
                    success: res => {
                        wx.showToast({
                            title: '设置成功!',
                            icon: 'success',
                            duration: 1000
                        })
                        this.hideModal()
                        setTimeout(function () {
                            wx.hideToast()
                        }, 2000)
                    }
                })
            }
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})