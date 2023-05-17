const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = require('./config').port; // 获取启动参数

//引入路由
const userRouter = require('./routes/user');
const dataRouter = require('./routes/data');
const adminRouter = require('./routes/admin');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', userRouter);
app.use('/data',dataRouter);
app.use('/admin',adminRouter);

// 设置静态资源文件夹
app.use(express.static(path.join(__dirname,'public')));

app.use('/',(req, res)=>{
    res.send('<h1>express运行正常</h1>')
});

app.listen(port, () => {
    console.log(`express server url is http://localhost:${port}`);
})
