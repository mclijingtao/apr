const config = require('../config') // 获取配置信息const
const mysql = require('mysql2')   //mysql模块

const db = mysql.createConnection(config.mysql) // mysql.createConnection 方法创建连接实例

// 构建或更新用户画像方法
function UserPortrait(user_id, state, res) {
    const anime_district = ['中国', '日本', '欧美']
    const anime_type = ['动作', '搞笑', '幻想', '冒险', '热血', '校园']
    const anime_time = ['2018', '2019', '2020', '2021', '2022', '2023']
    let userPortrait = {
        anime_district: {},
        anime_type: {},
        anime_time: {}
    }
    anime_district.forEach((value) => {
        userPortrait.anime_district[value] = 0
    })
    anime_type.forEach((value) => {
        userPortrait.anime_type[value] = 0
    })
    anime_time.forEach((value) => {
        userPortrait.anime_time[value] = 0
    })
    let sql = 'select AVG(anime_score) avg from score  where user_id = ? ;' +
        'select anime.anime_district,anime.anime_type,anime.anime_time,score.anime_score  from score,anime where anime.anime_id = score.anime_id and user_id = ? ;' +
        'select anime.anime_district,anime.anime_type,anime.anime_time from collect,anime where anime.anime_id = collect.anime_id and user_id = ? ;' +
        'select anime.anime_district,anime.anime_type,anime.anime_time from share,anime where anime.anime_id = share.anime_id and user_id = ? ;'
    let sqlParams = [user_id, user_id, user_id, user_id]
    db.query(sql, sqlParams, (err, result) => {
        for (let i in result[1]) {
            if (result[1][i].anime_score >= result[0][0].avg) {
                userPortrait.anime_district[result[1][i].anime_district] += 1
                userPortrait.anime_type[result[1][i].anime_type] += 1
                userPortrait.anime_time[result[1][i].anime_time] += 1
            } else {
                userPortrait.anime_district[result[1][i].anime_district] -= 1
                userPortrait.anime_type[result[1][i].anime_type] -= 1
                userPortrait.anime_time[result[1][i].anime_time] -= 1
            }
        }
        let list = [...result[2], ...result[3]]
        for (j in list) {
            userPortrait.anime_district[list[j].anime_district] += 1
            userPortrait.anime_type[list[j].anime_type] += 1
            userPortrait.anime_time[list[j].anime_time] += 1
        }
        let type = ['anime_district', 'anime_type', 'anime_time']
        for (let f in type) {
            for (let n in userPortrait[type[f]]) {
                if (userPortrait[type[f]][n] <= 0) {
                    delete userPortrait[type[f]][n]
                }
            }
        }
        if (state === 'build') {
            sql = "insert into portrait(user_id,user_portrait,portrait_time) values(?,?,?)"
            sqlParams = [user_id, JSON.stringify(userPortrait), Date.now()]
            db.query(sql, sqlParams, (err, result) => {
                matching(user_id, userPortrait, res)
            })
        } else if (state === 'update') {
            sql = "update portrait set user_portrait = ? , portrait_time = ? where user_id = ? "
            sqlParams = [JSON.stringify(userPortrait), Date.now(), user_id]
            db.query(sql, sqlParams, (err, result) => {
                matching(user_id, userPortrait, res)
            })
        }
    })
}

// 匹配动漫
function matching(user_id, portrait, res) {
    if (Object.keys(portrait.anime_district).length > 0 || Object.keys(portrait.anime_type).length > 0 || Object.keys(portrait.anime_time).length > 0) {

        let sql = 'select * from portrait where not user_id = ?'
        let sqlParams = [user_id]
        db.query(sql, sqlParams, (err, result) => {

            // 用户画像匹配
            function list(user_portrait, type) {
                let set = new Set(Object.keys(user_portrait[type]))
                let value = Object.keys(portrait[type]).filter(item => set.has(item))
                let sum = 0
                for (let j in value) {
                    sum += Math.abs(portrait[type][value[j]] - user_portrait[type][value[j]])
                }
                return sum
            }

            let sumList = []
            for (let i in result) {
                let user_portrait = JSON.parse(result[i].user_portrait)
                let sum = list(user_portrait, 'anime_district') + list(user_portrait, 'anime_type') + list(user_portrait, 'anime_time')
                let obj = {
                    user_id: result[i].user_id,
                    sum: sum
                }
                sumList.push(obj)
            }
            let id
            for (let k = 0; k < sumList.length; k++) {
                let min = sumList[0].sum
                id = sumList[k].user_id
                if (sumList[k].sum < min) {
                    min = sumList[k].sum;
                    id = sumList[k].user_id
                }
            }
            sql = 'select anime.* from collect,anime where user_id = ? and  collect.anime_id not in(select anime_id from collect where user_id = ?) and anime.anime_id=collect.anime_id limit 10'
            sqlParams = [id, user_id]
            db.query(sql, sqlParams, (err, data) => {

                // 动漫匹配
                let type = ['anime_district', 'anime_type', 'anime_time']
                for (let f in type) {
                    let data = 0
                    for (let n in portrait[type[f]]) {
                        if (portrait[type[f]][n] >= data) {
                            data = portrait[type[f]][n]
                            portrait[type[f]] = n
                        }
                    }
                }
                sql = 'select * from anime where (anime_district=? and anime_type=?) or (anime_time=? and anime_type=?) or (anime_district=? and anime_time=?) limit 10'
                sqlParams = [portrait.anime_district, portrait.anime_type, portrait.anime_time, portrait.anime_type, portrait.anime_district, portrait.anime_time]
                db.query(sql, sqlParams, (err, result) => {
                    res.json([...data, ...result])
                })
            })
        })
    } else {
        res.json({})
    }
}

function recommended(req, res){
    let user_id = req.query.user_id
    let sql = 'select * from portrait where user_id = ?'
    let sqlParams = [user_id]
    db.query(sql, sqlParams, (err, result) => {
        let state
        if (result.length === 0) {
            state = 'build'
            UserPortrait(user_id, state,res)
        } else {
            let portrait_time = result[0].portrait_time
            let time = parseInt((Date.now() - portrait_time) / 1000 / 60 / 60 / 24)
            if (time >= 1) {
            state = 'update'
            UserPortrait(user_id, state,res)
            }else {
                let portrait = JSON.parse(result[0].user_portrait)
                matching(user_id, portrait, res)
            }
        }
    })
}

module.exports.recommended = recommended;