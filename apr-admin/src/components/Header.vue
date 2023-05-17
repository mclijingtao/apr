<template>
    <div class="content">
        <div class="left">
            <el-button size="small" plain @click="handleMenu" class="menuButton">
                <i class="el-icon-s-fold"></i>
            </el-button>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in tabsList" :key="item.name"
                                    :to="{ path: item.path }">
                    {{ item.name }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                  <el-avatar shape="square" icon="el-icon-user-solid" size="large" fit="fill" :src="avatar"></el-avatar>
              </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-delete" command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import breadcrumb from "@/store/breadcrumb";
import Cookie from "js-cookie";

export default {
    name: "Header",
    computed: {
        breadcrumb() {
            return breadcrumb
        },
        ...mapState('breadcrumb', ['tabsList'])
    },
    data() {
        return {
            avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        }
    },
    methods: {
        ...mapMutations('menu', {handleMenu: 'collapseMenu'}),
        handleCommand(command) {
            if (command==='logout'){
                Cookie.remove('token')
                localStorage.removeItem('userInfo')
                this.$router.push({name: 'login'})
                this.$message({
                    message: '退出登录成功',
                    type: 'success'
                });
            }
        }
    },
    watch: {
        $route: {
            handler: function () {
                this.$store.commit('breadcrumb/selectMenu', this.$route.matched[1])
            },
            immediate: true
        }
    },
    mounted(){
        this.avatar=JSON.parse(localStorage.getItem('userInfo')).head
    }
}
</script>

<style scoped>
.content {
    padding: 0 30px;
    height: 100%;
    background-color: #2c2c2d;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.content .left {
    display: flex;
    align-items: center;
}

.content .left .menuButton {
    width: 40px;
    height: 35px;
    margin-right: 20px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/deep/ .el-breadcrumb__item .el-breadcrumb__inner.is-link{
    color: #b6b0b0;
    font-weight: 400;
}

/deep/ .el-breadcrumb__item .el-breadcrumb__inner.is-link:hover{
    color: #409EFF;
    font-weight: 700;
}

/deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner{
    color: #fff;
    font-weight: 700;
}
</style>