const config = require('../config') // 获取配置信息const
const mysql = require('mysql2')   //mysql模块
const bodyParser = require('body-parser');

const db = mysql.createConnection(config.mysql) // mysql.createConnection 方法创建连接实例

let exportObj = {
    search,
    find,
    state,
    swiperList,
    getList,
    typeList,
    score,
    collect,
    share,
    log,
    getComment,
    comment,
    userCollect,
    userComment,
    userShare,
    userLog
};

module.exports = exportObj;

// 格式化当前时间
function nowTime(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

// 搜索方法
function search(req, res) {
    const anime_district = ['中国', '日本', '欧美']
    const anime_type = ['动作', '搞笑', '幻想', '冒险', '热血', '校园']
    const anime_time = ['2018', '2019', '2020', '2021', '2022', '2023']

    function sql(condition) {
        return `select * from anime where ${condition} = ? limit ?`;
    }

    let sqlParams = [req.query.value, Number(req.query.anime_num)]
    if (anime_district.includes(req.query.value)) {
        db.query(sql('anime_district'), sqlParams, (err, result) => {
            res.json(result)
        })
    } else if (anime_type.includes(req.query.value)) {
        db.query(sql('anime_type'), sqlParams, (err, result) => {
            res.json(result)
        })
    } else if (anime_time.includes(req.query.value)) {
        db.query(sql('anime_time'), sqlParams, (err, result) => {
            res.json(result)
        })
    } else {
        let sql = "select * from anime where anime_name regexp ? limit ? "
        db.query(sql, sqlParams, (err, result) => {
            res.json(result)
        })
    }
}

//查询动漫信息方法
function find(req, res) {
    let sql = `select * from anime where anime_id = ${req.query.anime_id} ;`
    db.query(sql, (err, result) => {
        res.json(result[0])
    })
}

// 查询评分、收藏、分享的记录
function state(req,res){
    let sql = `select count(anime_id) as collect_count from collect where anime_id= ${req.query.anime_id} ;` +
        `select count(anime_id) as share_count from share where anime_id=  ${req.query.anime_id} ;`;
    if (req.query.user_id.length>0) {
        sql += `select * from score where anime_id=${req.query.anime_id} and user_id = ${req.query.user_id} ;` +
            `select * from collect where anime_id=${req.query.anime_id} and user_id = ${req.query.user_id} ;` +
            `select * from share where anime_id=${req.query.anime_id} and user_id = ${req.query.user_id} ;` ;
    }
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

//获取轮播图方法
function swiperList(req, res) {
    const sql = `select anime_id , anime_name , anime_pic from anime order by anime_score DESC limit ${req.query.sum}`;
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

//获取榜单列表方法
function getList(req, res) {
    const anime_district = ["'中国'", "'日本'", "'欧美'"]
    let sql = 'select * from anime WHERE anime_time=(SELECT max(anime_time) from anime) order by anime_score DESC limit 6 ;'
    anime_district.forEach((value) => {
        sql += `select anime_id , anime_name , anime_pic from anime WHERE anime_district=${value} order by anime_score DESC limit 6 ;`
    })
    db.query(sql, (err, result) => {
        res.json(result)
    })
}

//获取分类方法
function typeList(req, res) {
    const tab = ['全部', '动作', '搞笑', '幻想', '冒险', '热血', '校园']
    const nav = ['全部', '中国', '日本', '欧美', '2023', '2022', '2021', '2020', '2019', '2018']
    if (req.query.tabCur === '0') {
        if (req.query.navCur === '0') {
            let sql = 'select * from anime limit ?'
            let sqlParams = [Number(req.query.num)]
            get(sql, sqlParams)
        } else if (Number(req.query.navCur) < 4) {
            let sql = 'select * from anime where anime_district = ? limit ?'
            let sqlParams = [nav[Number(req.query.navCur)], Number(req.query.num)]
            get(sql, sqlParams)
        } else {
            let sql = 'select * from anime where anime_time = ? limit ?'
            let sqlParams = [nav[Number(req.query.navCur)], Number(req.query.num)]
            get(sql, sqlParams)
        }
    } else {
        if (req.query.navCur === '0') {
            let sql = 'select * from anime where anime_type = ? limit ?'
            let sqlParams = [tab[Number(req.query.tabCur)], Number(req.query.num)]
            get(sql, sqlParams)
        } else if (Number(req.query.navCur) < 4) {
            let sql = 'select * from anime where anime_type = ? and anime_district = ? limit ?'
            let sqlParams = [tab[Number(req.query.tabCur)], nav[Number(req.query.navCur)], Number(req.query.num)]
            get(sql, sqlParams)
        } else {
            let sql = 'select * from anime where anime_type = ? and anime_time = ? limit ?'
            let sqlParams = [tab[Number(req.query.tabCur)], nav[Number(req.query.navCur)], Number(req.query.num)]
            get(sql, sqlParams)
        }
    }

    function get(sql, sqlParams) {
        db.query(sql, sqlParams, (err, result) => {
            res.json(result)
        })
    }
}

// 评分方法
function score(req, res) {
    const sql = "insert into score(anime_id, user_id , anime_score) values(?,?,?)"
    const sqlParams = [req.body.anime_id,req.body.user_id,req.body.anime_score]

    db.query(sql,sqlParams,(err,result)=>{
        res.json({})
    })
}

// 收藏方法
function collect(req, res) {
    let sql = `select * from collect where anime_id=${req.body.anime_id} and user_id = ${req.body.user_id} ;`
    db.query(sql,(err,result)=>{
        if (result.length>0){
            let sql = `delete from collect where anime_id=${req.body.anime_id} and user_id = ${req.body.user_id}`
            db.query(sql,(err,result)=>{
                res.json({})
            })
        }else {
            let time = nowTime()
            let sql = "insert into collect(anime_id, user_id , collect_time) values(?,?,?)"
            let sqlParams = [req.body.anime_id,req.body.user_id,time]
            db.query(sql,sqlParams,(err,result)=>{
                res.json({})
            })
        }
    })
}

// 分享方法
function share(req, res) {
    let time = nowTime()
    const sql = "insert into share(anime_id, user_id , share_time) values(?,?,?)"
    const sqlParams = [req.body.anime_id,req.body.user_id,time]

    db.query(sql,sqlParams,(err,result)=>{
        res.json({})
    })
}

// 添加浏览记录方法
function log(req, res) {
    let time = nowTime()
    const sql = "insert into log(anime_id, user_id , log_time) values(?,?,?)"
    const sqlParams = [req.body.anime_id,req.body.user_id,time]

    db.query(sql,sqlParams,(err,result)=>{
        res.json({})
    })
}

// 查询动漫所有评论方法
function getComment(req, res) {
    const sql = "select user.user_name,user.head,comment.comment_content,DATE_FORMAT(comment.comment_time,'%Y年%m月%d日') as comment_time from user,comment where user.user_id=comment.user_id and anime_id = ? order by comment.comment_id desc limit ?";
    const sqlParams = [req.query.anime_id,Number(req.query.num)]

    db.query(sql,sqlParams,(err,result)=>{
        res.json(result)
    })
}

// 评论方法
function comment(req, res) {
    let time = nowTime()
    const sql = "insert into comment(anime_id, user_id , comment_content , comment_time) values(?,?,?,?)"
    const sqlParams = [req.body.anime_id,req.body.user_id,req.body.comment_content,time]

    db.query(sql,sqlParams,(err,result)=>{
        res.json({})
    })
}

// 定义查询用户收藏路由
function userCollect(req, res) {
    const sql = "select anime.*,DATE_FORMAT(collect.collect_time,'%Y年%m月%d日') as collect_time from anime,collect where anime.anime_id=collect.anime_id and user_id = ? order by collect.collect_id desc limit ?";
    const sqlParams = [req.query.user_id,Number(req.query.num)]

    db.query(sql,sqlParams,(err,result)=>{
        res.json(result)
    })
}

// 定义查询用户评论路由
function userComment(req, res) {
    const sql = "select DATE_FORMAT(comment.comment_time,'%Y年%m月%d日') as comment_time,comment_content,anime.* from anime,comment,user where anime.anime_id=comment.anime_id and user.user_id=comment.user_id and comment.user_id=? order by comment.comment_id desc limit ?";
    const sqlParams = [req.query.user_id,Number(req.query.num)]

    db.query(sql,sqlParams,(err,result)=>{
        res.json(result)
    })
}

// 定义查询用户分享路由
function userShare(req, res) {
    const sql = "select anime.*,DATE_FORMAT(share.share_time,'%Y年%m月%d日') as share_time from anime,share where anime.anime_id=share.anime_id and user_id = ? order by share.share_id desc limit ?";
    const sqlParams = [req.query.user_id,Number(req.query.num)]

    db.query(sql,sqlParams,(err,result)=>{
        res.json(result)
    })
}

// 定义查询用户浏览记录路由
function userLog(req, res) {
    const sql = "select anime.*,DATE_FORMAT(log.log_time,'%Y年%m月%d日') as log_time from anime,log where anime.anime_id=log.anime_id and user_id = ? order by log.log_id desc limit ?";
    const sqlParams = [req.query.user_id,Number(req.query.num)]

    db.query(sql,sqlParams,(err,result)=>{
        res.json(result)
    })
}