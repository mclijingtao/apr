<template>
    <el-row>
        <el-col :span="8" style="padding-left: 10px">
            <el-card class="box-card">
                <div class="user">
                    <el-avatar shape="circle" icon="el-icon-user" :size="100" fit="fill" :src="avatar"></el-avatar>
                    <div class="userInfo">
                        <p class="name">{{ name }}</p>
                        <p class="access">系统管理员</p>
                    </div>
                </div>
                <el-divider><i class="el-icon-location-outline"></i></el-divider>
                <div class="loginInfo">
                    <p>登录时间： <span>{{ new Date().toLocaleString() }}</span></p>
                    <p>登录 IP ：&nbsp;&nbsp;&nbsp;<span>{{ ip }}</span></p>
                </div>
            </el-card>
            <el-card class="box-card time">
                <el-calendar></el-calendar>
            </el-card>
        </el-col>
        <el-col :span="16" style="padding-left: 20px">
            <div class="num">
                <el-card v-for="item in tableData" :key="item.name" :body-style="{display:'flex',padding:'0'}">
                    <i class="icon" :class="item.icon" :style="{backgroundColor:item.color}"></i>
                    <div class="detail">
                        <p class="price">{{ item.value }}</p>
                        <p class="desc">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>
            <div class="graph">
                <el-card style="height: 240px;width: 40%;">
                    <div ref="echarts1" style="height: 220px;"></div>
                </el-card>
                <el-card style="height: 240px;width: 55%;">
                    <div ref="echarts2" style="height: 200px;"></div>
                </el-card>
            </div>
            <el-card style="height: 250px;">
                <div ref="echarts3" style="height: 240px;"></div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import * as echarts from 'echarts';
import api from "@/api";

export default {
    name: "Home",
    data() {
        return {
            ip: '',
            name: "Admin",
            avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            tableData: [
                {
                    name: "用户",
                    value: "0",
                    icon: "el-icon-user-solid",
                    color: "#00c95c"
                },
                {
                    name: "管理员",
                    value: "0",
                    icon: "el-icon-s-custom",
                    color: "#00cebb"
                },
                {
                    name: "动漫",
                    value: "0",
                    icon: "el-icon-mobile",
                    color: "#00b2c9"
                }
            ]
        }
    },
    mounted() {
        const {name,head} =JSON.parse(localStorage.getItem('userInfo'))
        this.name = name
        this.avatar=head
        api.getIP().then(response => {
            this.ip = response.data.ip
        });
        api.getHome().then(({data}) => {
            this.tableData.forEach((item, index) => {
                item.value = Object.values(data[0][0])[index]
            })

            const echarts1 = echarts.init(this.$refs.echarts1)
            const option1 = {
                title: {
                    text: '用户占比',
                    left: 'right',
                },
                tooltip: {},
                series: [
                    {
                        type: 'pie',
                        data: [
                            {
                                name: "账号登录",
                                value: data[1][0]['counts']
                            },
                            {
                                name: "微信登录",
                                value: data[1][0]['count']
                            }
                        ]
                    }
                ]
            };
            echarts1.setOption(option1);

            const echarts2 = echarts.init(this.$refs.echarts2)
            const option2 = {
                color: '#00b2c9',
                title: {
                    text: '收藏柱状图'
                },
                tooltip: {},
                legend: {
                    data:['收藏量']
                },
                xAxis: {
                    data: data[3].map(item => item=item['anime_type'])
                },
                yAxis: {},
                series: [{
                    name: '收藏量',
                    type: 'bar',
                    data: data[3].map(item => item=item['count'])
                }]
            };
            echarts2.setOption(option2);

            const echarts3 = echarts.init(this.$refs.echarts3)
            const option3 = {
                color: '#2d9d62',
                title: {
                    text: '动漫柱状图'
                },
                tooltip: {},
                legend: {
                    data:['总数']
                },
                xAxis: {
                    data: data[2].map(item => item=item['anime_type'])
                },
                yAxis: {},
                series: [{
                    name: '总数',
                    type: 'bar',
                    data: data[2].map(item => item=item['count'])
                }]
            };
            echarts3.setOption(option3);

        })
    }
}
</script>

<style scoped>
.user {
    margin-left: 20px;
    display: flex;
    align-items: center;
}

.user .userInfo {
    margin-left: 40px;
    color: #625e5e;
}

.user .userInfo .name {
    margin-bottom: 5px;
    font-size: 24px;
    color: #000000;
}

.loginInfo {
    margin-left: 30px;
}

.loginInfo p {
    margin-bottom: 10px;
}

.loginInfo span {
    margin-left: 20px;
}

.time {
    margin-top: 20px;
}

/*日历css修改*/
/deep/ .el-calendar {
    font-size: 14px;
}

/deep/ .el-calendar .next {
    border: none;
}

/deep/ .el-calendar td {
    border: none;
}

/deep/ .el-calendar .el-calendar-day {

    height: 35px !important;
    text-align: center;
    border: none;
}

/deep/ .el-calendar .el-calendar__body {
    padding: 5px !important;
}

/deep/ .el-calendar .el-calendar-table tr td:first-child,
/deep/ .el-calendar .el-calendar-table tr:first-child td {
    border: none !important;
}

/deep/ .el-calendar .el-calendar__header {
    justify-content: space-between;
}

/deep/ .el-calendar-table td.is-today {
    background-color: #1d8dd8;
    color: #fff;
}

.num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.num .el-card {
    width: 30%;
}

.num .icon {
    width: 100px;
    height: 100px;
    font-size: 30px;
    text-align: center;
    line-height: 100px;
    color: #ffffff;
}

.num .detail {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.num .detail .price {
    font-size: 34px;
    line-height: 30px;
    text-align: center;
    margin-bottom: 10px;
}

.num .detail .desc {
    font-size: 18px;
    text-align: center;
    color: #999;
}

.graph {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
}

.graph .el-card {
    width: 47%;
}
</style>