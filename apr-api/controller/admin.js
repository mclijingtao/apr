const config = require('../config') // 获取配置信息const
const mysql = require('mysql2')   //mysql模块
const bodyParser = require('body-parser');// 这个模块是获取post请求传过来的数据。
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const jwt = require('jsonwebtoken')

const db = mysql.createConnection(config.mysql) // mysql.createConnection 方法创建连接实例

let exportObj = {
    adminLogin,
    getHome,
    getUserList,
    upUser,
    setUser,
    delUser,
    searchUser,
    getAdminList,
    upAdmin,
    setAdmin,
    delAdmin,
    searchAdmin,
    getAnimeList,
    upAnime,
    setAnime,
    delAnime,
    searchAnime,
    getCommentList,
    delComment
};

module.exports = exportObj;

// admin登录
function adminLogin(req, res) {
    const {name, password} = req.body;
    let sql = "SELECT head,password FROM admin WHERE admin_name = ? "
    let params = [name]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length !== 0) {
                if (result[0].password === password) {
                    const token = jwt.sign({name: name}, config.SECRET_KEY, {expiresIn: '1 days'})
                    res.json({
                        state: 'resolve',
                        meg: '登录成功',
                        token: token,
                        userInfo: {
                            name,
                            head: result[0].head
                        }
                    })
                } else {
                    res.json({
                        state: 'reject',
                        meg: '账号或密码错误'
                    })
                }
            } else {
                res.json({
                    state: 'reject',
                    meg: '账号或密码错误'
                })
            }
        }
    })
}

// 获取首页信息
function getHome(req, res) {
    let sql = "SELECT  (SELECT COUNT(*) FROM user) AS user, (SELECT COUNT(*) FROM admin) AS admin, (SELECT COUNT(*) FROM anime) AS anime;" +
        "SELECT COUNT(CASE WHEN openid IS NULL THEN 1 END) AS counts, COUNT(CASE WHEN openid IS NOT NULL THEN 1 END) AS count FROM user;" +
        "SELECT anime_type, COUNT(*) as count FROM anime GROUP BY anime_type ;" +
        "SELECT anime_type, SUM(count) as count FROM ( SELECT anime_type, 0 as count FROM anime UNION ALL SELECT anime.anime_type, COUNT(*) as count FROM collect INNER JOIN anime ON collect.anime_id = anime.anime_id GROUP BY anime.anime_type  ) AS t GROUP BY anime_type;"
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

// 获取用户列表
function getUserList(req, res) {
    let sql = "SELECT user_id, user_name, head, IF(openid IS NULL, '账号登录', '微信登录') AS tag FROM user ORDER BY user_id DESC;"
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

// 添加用户
function upUser(req, res) {
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
            const name = req.body.name
            const sql = "select user_id from user where user_name = ?"
            const sqlParams = [name]
            db.query(sql, sqlParams, (err, result) => {
                const {name, password} = req.body
                if (result.length === 0) {
                    let newFile
                    if (typeof (req.file) == "undefined") {
                        newFile = 'user.png'
                    } else {
                        newFile = name + path.parse(req.file.originalname).ext
                        fs.renameSync(req.file.path, './public/head/' + newFile)
                    }
                    let sql = "insert into user(user_name,password,head) values(?,?,?)"
                    const head = `http://127.0.0.1:3000/head/${newFile}`
                    let sqlParams = [name, password, head]
                    db.query(sql, sqlParams, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.json({state: 'resolve', message: '新增成功'})
                        }
                    })
                } else {
                    if (typeof (req.file) != "undefined") {
                        fs.unlink(req.file.path, function (err) {
                            if (err) {
                                throw err;
                            }
                        })
                    }
                    res.json({state: 'reject', message: '账号重复'})
                }
            })
        }
    });
}

// 更新用户数据
function setUser(req, res) {
    const sql = "UPDATE user SET `password` = '123456' WHERE user_id = ?"
    const params = [req.body.user_id]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({msg: "重置成功"})
        }
    })
}

// 删除用户
function delUser(req, res) {
    const sql = "DELETE FROM user WHERE user_id = ?"
    const params = [req.body.user_id]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            res.json({msg: "删除成功"})
        }
    })
}

//搜索用户
function searchUser(req, res) {
    const sql = "SELECT user_id, user_name, head, IF(openid IS NULL, '账号登录', '微信登录') AS tag FROM user WHERE user_name = ?"
    const params = [req.body.name]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            if (result.length === 0) {
                res.json({
                    state: 'reject',
                    meg: '未找到该用户'
                })
            } else {
                res.json({
                    state: 'resolve',
                    meg: '搜索成功',
                    userList: result
                })
            }
        }
    })
}


// 获取管理员列表
function getAdminList(req, res) {
    let sql = "SELECT admin_id, admin_name, head FROM admin ORDER BY admin_id DESC;"
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

// 添加管理员
function upAdmin(req, res) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/admin'); // 设置文件保存的目录
        }
    });
    const upload = multer({storage: storage}).single('head');
    upload(req, res, function (err) {
        if (err) {
            console.log('Multer 发生了错误', err);
        } else {
            const name = req.body.name
            const sql = "select admin_id from admin where admin_name = ?"
            const sqlParams = [name]
            db.query(sql, sqlParams, (err, result) => {
                const {name, password} = req.body
                if (result.length === 0) {
                    let newFile
                    if (typeof (req.file) == "undefined") {
                        newFile = 'admin.png'
                    } else {
                        newFile = name + path.parse(req.file.originalname).ext
                        fs.renameSync(req.file.path, './public/admin/' + newFile)
                    }
                    let sql = "insert into admin(admin_name,password,head) values(?,?,?)"
                    const head = `http://127.0.0.1:3000/admin/${newFile}`
                    let sqlParams = [name, password, head]
                    db.query(sql, sqlParams, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.json({state: 'resolve', message: '新增成功'})
                        }
                    })
                } else {
                    if (typeof (req.file) != "undefined") {
                        fs.unlink(req.file.path, function (err) {
                            if (err) {
                                throw err;
                            }
                        })
                    }
                    res.json({state: 'reject', message: '账号重复'})
                }
            })
        }
    });
}

// 更新管理员数据
function setAdmin(req, res) {
    const sql = "UPDATE admin SET `password` = '123456' WHERE admin_id = ?"
    const params = [req.body.admin_id]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({msg: "重置成功"})
        }
    })
}

// 删除管理员
function delAdmin(req, res) {
    const sql = "DELETE FROM admin WHERE admin_id = ?"
    const params = [req.body.admin_id]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            res.json({msg: "删除成功"})
        }
    })
}

//搜索管理员
function searchAdmin(req, res) {
    const sql = "SELECT admin_id, admin_name, head FROM admin WHERE admin_name = ?"
    const params = [req.body.name]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            if (result.length === 0) {
                res.json({
                    state: 'reject',
                    meg: '未找到该管理员'
                })
            } else {
                res.json({
                    state: 'resolve',
                    meg: '搜索成功',
                    adminList: result
                })
            }
        }
    })
}


//获取动漫列表
function getAnimeList(req, res) {
    let sql = "SELECT * FROM anime ORDER BY anime_id DESC;"
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

//添加动漫
function upAnime(req, res) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/anime'); // 设置文件保存的目录
        }
    });
    const upload = multer({storage: storage}).single('anime_pic');
    upload(req, res, function (err) {
        if (err) {
            console.log('Multer 发生了错误', err);
        } else {
            const anime_name = JSON.parse(req.body.data).anime_name
            const sql = "select anime_id from anime where anime_name = ?"
            const sqlParams = [anime_name]
            db.query(sql, sqlParams, (err, result) => {
                const {anime_name, anime_district, anime_type, anime_time, anime_content} = JSON.parse(req.body.data)
                if (result.length === 0) {
                    let newFile = anime_name + path.parse(req.file.originalname).ext
                    fs.renameSync(req.file.path, './public/anime/' + newFile)
                    let sql = "insert into anime(anime_pic, anime_name, anime_district, anime_type, anime_time, anime_content,anime_score) values(?,?,?,?,?,?,?)"
                    const anime_pic = `http://127.0.0.1:3000/anime/${newFile}`
                    let sqlParams = [anime_pic, anime_name, anime_district, anime_type, anime_time, anime_content, '4']
                    db.query(sql, sqlParams, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.json({state: 'resolve', message: '新增成功'})
                        }
                    })
                } else {
                    fs.unlink(req.file.path, function (err) {
                        if (err) {
                            throw err;
                        }
                    })
                    res.json({state: 'reject', message: '动漫重复'})
                }
            })
        }
    });
}

//编辑动漫
function setAnime(req, res) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/anime'); // 设置文件保存的目录
        }
    });
    const upload = multer({storage: storage}).single('anime_pic');
    upload(req, res, function (err) {
        if (err) {
            console.log('Multer 发生了错误', err);
        } else {
            let anime_name = JSON.parse(req.body.data).anime_name
            let anime_id = JSON.parse(req.body.data).anime_id
            let sql = "select anime_id from anime where anime_name = ? and anime_id != ?"
            let sqlParams = [anime_name,anime_id]
            db.query(sql, sqlParams, (err, result) => {
                let {
                    anime_id,
                    anime_pic,
                    anime_name,
                    anime_district,
                    anime_type,
                    anime_time,
                    anime_content
                } = JSON.parse(req.body.data)
                if (result.length === 0) {
                    let newFile, pic
                    if (typeof (req.file) == "undefined") {
                        pic = anime_pic
                    } else {
                        newFile = anime_name + path.parse(req.file.originalname).ext
                        fs.renameSync(req.file.path, './public/anime/' + newFile)
                        pic = `http://127.0.0.1:3000/anime/${newFile}`
                    }
                    let sql = "update anime set anime_pic=? , anime_name=?, anime_district=?, anime_type=?, anime_time=?, anime_content=?,anime_score=? where anime_id=?"
                    let sqlParams = [pic, anime_name, anime_district, anime_type, anime_time, anime_content, '4', anime_id]
                    db.query(sql, sqlParams, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.json({state: 'resolve',message: '编辑成功'})
                        }
                    })
                } else {
                    if (typeof (req.file) !== "undefined"){
                        fs.unlink(req.file.path, function (err) {
                            if (err) {
                                throw err;
                            }
                        })
                    }
                    res.json({state: 'reject', message: '动漫名重复'})
                }
            })
        }
    });
}

//删除动漫
function delAnime(req, res) {
    const sql = "DELETE FROM anime WHERE anime_id = ?"
    const params = [req.body.anime_id]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            res.json({msg: "删除成功"})
        }
    })
}

// 搜索动漫
function searchAnime(req, res) {
    const sql = "SELECT * FROM anime WHERE anime_name = ?"
    const params = [req.body.anime_name]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            if (result.length === 0) {
                res.json({
                    state: 'reject',
                    meg: '未找到该动漫'
                })
            } else {
                res.json({
                    state: 'resolve',
                    meg: '搜索成功',
                    animeList: result
                })
            }
        }
    })
}

//获取评论列表
function getCommentList(req,res) {
    let sql = "select comment.comment_id,anime.anime_name,user.user_name,comment.comment_content,comment.comment_time from anime,comment,user where anime.anime_id=comment.anime_id and comment.user_id = user.user_id ORDER BY comment_time DESC"
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

//删除评论
function delComment(req, res) {
    const sql = "DELETE FROM comment WHERE comment_id = ?"
    const params = [req.body.comment_id]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            res.json({msg: "删除成功"})
        }
    })
}