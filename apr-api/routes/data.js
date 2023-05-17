const express = require('express');
const router = express.Router();

// 引入自定义data方法
const data = require('../controller/data');

// 定义搜索路由
router.get('/search',data.search);
// 定义查找动漫路由
router.get('/find',data.find);
// 定义轮播图路由
router.get('/swiperList',data.swiperList);
// 定义榜单路由
router.get('/getList',data.getList);
// 定义分类路由
router.get('/typeList',data.typeList);
// 定义查询操作记录路由
router.get('/state',data.state);
// 定义评分路由
router.post('/score',data.score);
// 定义收藏路由
router.post('/collect',data.collect);
// 定义分享路由
router.post('/share',data.share);
// 定义浏览记录路由
router.post('/log',data.log);
// 定义获取评论路由
router.get('/getComment',data.getComment);
// 定义评论路由
router.post('/comment',data.comment);
// 定义查询用户收藏路由
router.get('/userCollect',data.userCollect);
// 定义查询用户评论路由
router.get('/userComment',data.userComment);
// 定义查询用户分享路由
router.get('/userShare',data.userShare);
// 定义查询用户浏览记录路由
router.get('/userLog',data.userLog);

module.exports = router;