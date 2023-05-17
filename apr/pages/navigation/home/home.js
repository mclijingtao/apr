const app = getApp()
const serverUrl = app.globalData.serverUrl

Component({
	options: {
		addGlobalClass: true
	},
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		swiperList: [],
		list: [],
	},
	lifetimes: {
		attached: function () {
			this.get_swiperList()
			var that = this
			setInterval(function () {
				that.towerEnd()
			}, 2000)
			this.getlist()
		},
	},
	methods: {
		// 搜索页面按钮
		tosearch() {
			wx.navigateTo({
				url: '/pages/navigation/search/search',
			})
		},

		// 跳转分类按钮
		gopage(e) {
			if (e.currentTarget.dataset.id === '1') {
				this.triggerEvent('gopage', {
					cur: 4
				})
			} else if (e.currentTarget.dataset.id === '2') {
				this.triggerEvent('gopage', {
					cur: 1
				})
			} else if (e.currentTarget.dataset.id === '3') {
				this.triggerEvent('gopage', {
					cur: 2
				})
			} else if (e.currentTarget.dataset.id === '4') {
				this.triggerEvent('gopage', {
					cur: 3
				})
			}
		},

		// 获取榜单列表
		getlist() {
			wx.request({
				url: serverUrl + '/data/getlist',
				method: 'get',
				success: res => {
					this.setData({
						list: res.data,
					})
				}
			})
		},

		// 获取轮播图
		get_swiperList() {
			wx.request({
				url: serverUrl + '/data/swiperList',
				method: 'get',
				data: {
					sum: '7'
				},
				success: res => {
					this.setData({
						swiperList: res.data
					})
					this.towerSwiper('swiperList');
				}
			})
		},

		// 初始化towerSwiper
		towerSwiper(name) {
			let list = this.data[name];
			for (let i = 0; i < list.length; i++) {
				list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
				list[i].mLeft = i - parseInt(list.length / 2)
			}
			this.setData({
				swiperList: list
			})
		},
		// towerSwiper触摸开始
		towerStart(e) {
			this.setData({
				towerStart: e.touches[0].pageX
			})
		},
		// towerSwiper计算方向
		towerMove(e) {
			this.setData({
				direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
			})
		},
		// towerSwiper计算滚动
		towerEnd(e) {
			let direction = this.data.direction;
			let list = this.data.swiperList;
			if (direction == 'right') {
				let mLeft = list[0].mLeft;
				let zIndex = list[0].zIndex;
				for (let i = 1; i < list.length; i++) {
					list[i - 1].mLeft = list[i].mLeft
					list[i - 1].zIndex = list[i].zIndex
				}
				list[list.length - 1].mLeft = mLeft;
				list[list.length - 1].zIndex = zIndex;
				this.setData({
					swiperList: list
				})
			} else {
				let mLeft = list[list.length - 1].mLeft;
				let zIndex = list[list.length - 1].zIndex;
				for (let i = list.length - 1; i > 0; i--) {
					list[i].mLeft = list[i - 1].mLeft
					list[i].zIndex = list[i - 1].zIndex
				}
				list[0].mLeft = mLeft;
				list[0].zIndex = zIndex;
				this.setData({
					swiperList: list
				})
			}
		}
	}
})