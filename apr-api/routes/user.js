const express = require('express');
const router = express.Router();

// 引入自定义user方法
const user = require('../controller/user');
const recommended = require('../controller/recommended');

// 定义登录路由，POST请求
router.post('/login', user.login);
// 定义注册路由，POST请求
router.post('/register', user.register);
// 定义修改头像路由，POST请求
router.post('/uploadFile', user.uploadFile);
// 定义修改用户密码路由，POST请求
router.post('/setPassword', user.setPassword);
// 定义推荐路由，get请求
router.get('/recommended',recommended.recommended)

module.exports = router;
