const app = getApp()
const serverUrl = app.globalData.serverUrl

Component({
    options: {
        addGlobalClass: true
    },
    properties: {},
    data: {
        userInfo: {},
        hasUserInfo: false,
        showModal: false,
        pwd: true,
        Value: '',
        reg: false
    },
    pageLifetimes: {
        // 页面被展示
        show() {
            //获取Storage用户信息
            let userInfo = wx.getStorageSync('userInfo')
            if (userInfo) {
                this.setData({
                    userInfo: userInfo,
                    hasUserInfo: true,
                })
            }
        }
    },
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached: function () {
            let userInfo = wx.getStorageSync('userInfo')
            if (userInfo) {
                this.setData({
                    userInfo: userInfo,
                    hasUserInfo: true,
                })
            }
        }
    },
    methods: {
        // 登录按钮
        login() {
            this.setData({
                showModal: true
            })
        },

        // 退出登录按钮
        exit() {
            wx.removeStorage({
                key: 'userInfo',
                success: (res) => {
                    this.setData({
                        userInfo: {},
                        hasUserInfo: false
                    })
                }
            })
            wx.removeStorage({
                key: 'search_log'
            })
        },

        // 隐藏modal
        hideModal() {
            this.setData({
                showModal: false,
                pwd: true,
                Value: '',
                reg: false
            })
        },

        // 密码显示切换按钮
        pwd() {
            this.setData({
                pwd: !this.data.pwd
            })
        },

        // 切换注册按钮
        regbtn() {
            this.setData({
                reg: true
            })
        },

        // 登录成功
        success(type, res) {
            if (res.data.head == undefined) {
                if (type == 'login') {
                    wx.showToast({
                        title: '登录失败!',
                        icon: 'error',
                        duration: 1000
                    })
                } else {
                    wx.showToast({
                        title: '账号重复!',
                        icon: 'error',
                        duration: 1000
                    })
                }
            } else {
                if (type == 'login') {
                    wx.showToast({
                        title: '登录成功!',
                        icon: 'success',
                        duration: 1000
                    })
                } else {
                    wx.showToast({
                        title: '注册成功!',
                        icon: 'success',
                        duration: 1000
                    })
                }
                wx.setStorage({
                    key: 'userInfo',
                    data: res.data
                })
                this.setData({
                    userInfo: res.data,
                    hasUserInfo: true,
                })
                this.hideModal();
            }
            setTimeout(function () {
                wx.hideToast()
            }, 2000)
        },

        // 用户登录
        userlogin(e) {
            if (e.detail.value.loginName.length == 0 || e.detail.value.loginPwd.length == 0) {
                wx.showToast({
                    title: '输入框不能为空!',
                    icon: 'error',
                    duration: 1000
                })
                setTimeout(function () {
                    wx.hideToast()
                }, 2000)
            } else {
                wx.request({
                    url: serverUrl + '/login',
                    method: 'post',
                    data: {
                        user: 'user',
                        loginName: e.detail.value.loginName,
                        loginPwd: e.detail.value.loginPwd
                    },
                    success: res => {
                        this.success('login', res);
                    }
                })
            }
        },

        // 微信登录
        wxlogin() {
            // 微信登录
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 userInfo
                    wx.request({
                        url: serverUrl + '/login',
                        method: 'post',
                        data: {
                            user: 'wx',
                            code: res.code
                        },
                        success: res => {
                            this.success('login', res);
                        }
                    })
                }
            })
        },

        // 注册
        register(e) {
            if (e.detail.value.regName.length == 0 || e.detail.value.regPwd.length == 0 || e.detail.value.regPwds.length == 0) {
                wx.showToast({
                    title: '输入框不能为空!',
                    icon: 'error',
                    duration: 1000
                })
                setTimeout(function () {
                    wx.hideToast()
                }, 2000)
            } else if (e.detail.value.regPwd !== e.detail.value.regPwds) {
                wx.showToast({
                    title: '密码不一致!',
                    icon: 'error',
                    duration: 1000
                })
                setTimeout(function () {
                    wx.hideToast()
                }, 2000)
            } else {
                wx.request({
                    url: serverUrl + '/register',
                    method: 'post',
                    data: {
                        regName: e.detail.value.regName,
                        regPwd: e.detail.value.regPwd
                    },
                    success: res => {
                        this.success('register', res);
                    }
                })
            }
        },

        // 跳转收藏页面
        goCollect() {
            if (this.data.hasUserInfo) {
                wx.navigateTo({
                    url: '/pages/about/collect/collect',
                })
            }
        },

        // 跳转评论页面
        goComment() {
            if (this.data.hasUserInfo) {
                wx.navigateTo({
                    url: '/pages/about/comment/comment',
                })
            }
        }
    },
})