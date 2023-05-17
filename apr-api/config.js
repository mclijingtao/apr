module.exports = {
    port: 3000, // express 服务启动端口
    /* 数据库相关配置 */
    mysql: {
        host: 'localhost', // 主机名
        port: 3306,        // MySQL 默认端口为 3306
        user: 'root',
        password: '123456',
        database: 'apr', // 数据库名
        multipleStatements: true, //多条SQL语句查询
    },
    /* 微信账号配置 */
    wx: {
        appid: 'wxefd1ccbf8ba95748',
        secret: '09d9648dd1985f411814b49ba03932f7',
    },
    SECRET_KEY : 'token_demo'
}
