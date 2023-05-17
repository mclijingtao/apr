const express = require('express');
const router = express.Router();

const admin = require('../controller/admin');

// admin登录
router.post('/adminLogin',admin.adminLogin)
// 定义首页路由
router.get('/getHome',admin.getHome)
// 获取用户列表
router.get('/getUserList',admin.getUserList)
// 添加用户
router.post('/upUser',admin.upUser)
// 更新用户数据
router.post('/setUser',admin.setUser)
// 删除用户
router.post('/delUser',admin.delUser)
// 搜索用户
router.post('/searchUser',admin.searchUser)

// 获取管理员列表
router.get('/getAdminList',admin.getAdminList)
// 添加管理员
router.post('/upAdmin',admin.upAdmin)
// 更新管理员数据
router.post('/setAdmin',admin.setAdmin)
// 删除管理员
router.post('/delAdmin',admin.delAdmin)
// 搜索管理员
router.post('/searchAdmin',admin.searchAdmin)

// 获取动漫列表
router.get('/getAnimeList',admin.getAnimeList)
// 添加动漫
router.post('/upAnime',admin.upAnime)
// 编辑动漫
router.post('/setAnime',admin.setAnime)
// 删除动漫
router.post('/delAnime',admin.delAnime)
// 搜索动漫
router.post('/searchAnime',admin.searchAnime)


// 获取评论列表
router.get('/getCommentList',admin.getCommentList)
// 删除评论
router.post('/delComment',admin.delComment)

module.exports = router;