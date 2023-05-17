const config = require('../config') // 获取配置信息const
const mysql = require('mysql2')   //mysql模块
const request = require('request') //发送请求模块
const bodyParser = require('body-parser');  // 这个模块是获取post请求传过来的数据。
const multer = require('multer'); //用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection(config.mysql) // mysql.createConnection 方法创建连接实例

let exportObj = {
    login,
    register,
    uploadFile,
    setPassword
};

module.exports = exportObj;

// 登录方法
function login(req, res) {
    // 注册用户登录
    if (req.body.user === 'user') {
        let loginName = req.body.loginName;
        let loginPwd = req.body.loginPwd;
        let sql = "select * from user where user_name = ? and password = ?"
        let sqlParams = [loginName, loginPwd]
        db.query(sql, sqlParams, (err, result) => {
            // 用户未注册
            if (result.length === 0) {
                res.json({})
            }
            // 老用户
            else {
                res.json({
                    id: result[0].user_id,
                    head: result[0].head,
                    name: result[0].user_name
                })
            }
        })
    }
    // 微信用户登录
    else if (req.body.user === 'wx') {
        let appid = config.wx.appid
        let secret = config.wx.secret
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${req.body.code}&grant_type=authorization_code `
        request(url, (err, response, body) => {
            let openid = JSON.parse(body).openid
            if (openid) {
                let sql = "select * from user where openid = ?"
                let sqlParams = [openid]
                db.query(sql, sqlParams, (err, result) => {
                    // 首次登录
                    if (result.length === 0) {
                        let sql = "insert into user(user_name,openid,head) values(?,?,?)"
                        const user_name = '微信用户'
                        const head = 'http://127.0.0.1:3000/head/wx.png'
                        let sqlParams = [user_name, openid, head]
                        db.query(sql, sqlParams, (err, results) => {
                            res.json({
                                id: results.insertId,
                                head: head,
                                name: user_name
                            })
                        })
                    }
                    // 老用户
                    else {
                        res.json({
                            id: result[0].user_id,
                            head: result[0].head,
                            name: result[0].user_name
                        })
                    }
                })
            }
        })
    }
}

//注册方法
function register(req, res) {
    let regName = req.body.regName
    let regPwd = req.body.regPwd
    let sql = "select * from user where user_name = ?"
    let sqlParams = [regName]
    db.query(sql, sqlParams, (err, result) => {
        if (result.length === 0) {
            let sql = "insert into user(user_name,password,head) values(?,?,?)"
            const user_name = regName
            const password = regPwd
            const head = 'http://127.0.0.1:3000/head/user.png'
            let sqlParams = [user_name, password, head]
            db.query(sql, sqlParams, (err, result) => {
                res.json({
                    id: result.insertId,
                    head: head,
                    name: user_name
                })
            })
        } else {
            res.json({})
        }
    })
}

// 修改头像方法
function uploadFile(req, res) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/head'); // 设置文件保存的目录
        }
    });
    const upload = multer({storage: storage}).single('head');
    upload(req, res, function (err) {
        if (err) {
            console.log('Multer 发生了错误', err);
        } else {
            const id = req.body.id
            const sql = "select user_name from user where user_id = ?"
            const sqlParams = [id]
            db.query(sql, sqlParams, (err, result) => {
                if (result.length !== 0) {
                    let name = result[0].user_name
                    let newFile = name + path.parse(req.file.originalname).ext
                    fs.renameSync(req.file.path, './public/head/' + newFile)
                    let sql = "update user set head = ? where user_id = ?"
                    const head = `http://127.0.0.1:3000/head/${newFile}`
                    let sqlParams = [head, name]
                    db.query(sql, sqlParams, (err, result) => {
                        res.json({
                            path: "http://127.0.0.1:3000/head/" + newFile
                        })
                    })
                }
            })
        }
    });
}

//修改密码方法
function setPassword(req, res) {
    let sql = "UPDATE user SET `password` = ? WHERE user_id = ?";
    let sqlParams = [req.body.password, req.body.id]
    db.query(sql, sqlParams, (err, result) => {
        res.json({})
    })
}