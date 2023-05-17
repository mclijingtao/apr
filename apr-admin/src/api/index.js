import AxiosInstance from "../utils/request"

export default {
    // admin登录
    adminLogin(data) {
        return AxiosInstance.post('/admin/adminLogin', data)
    },
    // 获取浏览器IP
    getIP() {
        return AxiosInstance.get('https://api.ipify.org?format=json')
    },
    // 获取首页信息
    getHome() {
        return AxiosInstance.get('/admin/getHome')
    },
    // 获取用户列表
    getUserList() {
        return AxiosInstance.get('/admin/getUserList')
    },
    // 添加用户
    upUser(data) {
        return AxiosInstance.post('/admin/upUser', data, {headers: {'Content-Type': 'multipart/form-data'}})
    },
    // 更新用户数据
    setUser(data) {
        return AxiosInstance.post('/admin/setUser', data)
    },
    // 删除用户
    delUser(data) {
        return AxiosInstance.post('/admin/delUser', data)
    },
    // 搜索用户
    searchUser(data) {
        return AxiosInstance.post('/admin/searchUser', data)
    },
    // 获取管理员列表
    getAdminList() {
        return AxiosInstance.get('/admin/getAdminList')
    },
    // 添加管理员
    upAdmin(data) {
        return AxiosInstance.post('/admin/upAdmin', data, {headers: {'Content-Type': 'multipart/form-data'}})
    },
    // 更新管理员数据
    setAdmin(data) {
        return AxiosInstance.post('/admin/setAdmin', data)
    },
    // 删除管理员
    delAdmin(data) {
        return AxiosInstance.post('/admin/delAdmin', data)
    },
    // 搜索管理员
    searchAdmin(data) {
        return AxiosInstance.post('/admin/searchAdmin', data)
    },
    // 获取动漫列表
    getAnimeList() {
        return AxiosInstance.get('/admin/getAnimeList')
    },
    // 添加动漫
    upAnime(data) {
        return AxiosInstance.post('/admin/upAnime', data, {headers: {'Content-Type': 'multipart/form-data'}})
    },
    // 更新动漫数据
    setAnime(data) {
        return AxiosInstance.post('/admin/setAnime', data, {headers: {'Content-Type': 'multipart/form-data'}})
    },
    // 删除动漫
    delAnime(data) {
        return AxiosInstance.post('/admin/delAnime', data)
    },
    // 搜索动漫
    searchAnime(data) {
        return AxiosInstance.post('/admin/searchAnime', data)
    },
    // 获取评论列表
    getCommentList() {
        return AxiosInstance.get('/admin/getCommentList')
    },
    // 删除评论
    delComment(data) {
        return AxiosInstance.post('/admin/delComment', data)
    }
}
