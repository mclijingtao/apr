const app = getApp()
const serverUrl = app.globalData.serverUrl
var touch = [0, 0];

Component({
    options: {
        addGlobalClass: true
    },

    data: {
        CustomBar: app.globalData.CustomBar,
        list: {},
        testCurrentNav: 0,
        currentIndex: 0,
        moveDistance: 0,
        classArray: ['active', 'next'],
    },
    lifetimes: {
        attached: function () {
            let userInfo = wx.getStorageSync('userInfo')
            if (userInfo) {
                this.recommended(userInfo.id)
            } else {
                this.getanime()
            }
        },
    },
    methods: {
        // 获取推荐动漫
        recommended(user_id) {
            wx.request({
                url: serverUrl + '/recommended',
                method: 'get',
                data: {
                    user_id: user_id
                },
                success: res => {
                    if (res.data.length > 0) {
                        this.setData({
                            list: res.data
                        })
                    } else {
                        this.getanime()
                    }
                }
            })
        },

        getanime() {
            wx.request({
                url: serverUrl + '/data/getlist',
                method: 'get',
                success: res => {
                    this.setData({
                        list: res.data[0],
                    })
                }
            })
        },

        // 开始滑动
        onTouchStart(e) {
            touch[0] = e.touches[0].clientX
        },

        // 结束滑动
        onTouchEnd(e) {
            touch[1] = e.changedTouches[0].clientX;
            if (touch[0] - touch[1] > 5) {
                this.addClassName('left');
            } else if (touch[1] - touch[0] > 5) {
                this.addClassName('right');
            }
        },

        addClassName(direction) {
            let currentIndex = this.data.currentIndex
            let list = this.data.list
            let length = list.length
            let classArray = new Array(length)

            if (direction === 'left') { // 向左滑动
                if (++currentIndex >= length) return

                classArray[currentIndex] = 'active';
                classArray[currentIndex - 1] = 'prev';
                if (currentIndex + 1 < length) {
                    classArray[currentIndex + 1] = 'next';
                }

            } else if (direction === 'right') { // 向右滑动
                if (--currentIndex < 0) return

                if (currentIndex - 1 >= 0) {
                    classArray[currentIndex - 1] = 'prev';
                }
                classArray[currentIndex] = 'active';
                classArray[currentIndex + 1] = 'next';

            }
            this.moveCard(direction)
            this.setData({
                currentIndex,
                classArray
            })
        },

        // 创建平移动画
        moveCard(direction) {
            let moveDistance = this.data.moveDistance

            if (direction === 'left') {
                moveDistance -= 549
            } else if (direction === 'right') {
                moveDistance += 549
            }
            this.setData({
                moveDistance
            })
        },
    }
})