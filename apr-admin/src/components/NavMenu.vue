<template>
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse-transition="false"
             background-color="#373d41" text-color="#fff" active-text-color="#409eff"
             :collapse="isCollapse" :default-active="$route.path" router>
        <div class="head">
            <img src="../assets/logo.png" alt="avatar">
            <div class="title" v-show="!isCollapse">小程序后台管理</div>
        </div>
        <template v-for="item in menuData" >
            <template v-if="item.children">
                <el-submenu :index="item.name">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.name }}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item v-for="child  in item.children" :key="child.name" :index="child.path">
                           <span class="child">{{ child.name }}</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :index="item.path">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.name }}</span>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</template>

<script>
export default {
    name: "NavMenu",
    data() {
        return {
            menuData: [
                {
                    path: "/home",
                    name: '首页',
                    icon: 'el-icon-menu'
                },
                {
                    name: '账户管理',
                    icon: 'el-icon-s-custom',
                    children: [
                        {
                            path: "/user",
                            name: '用户管理',
                            icon: 'el-icon-menu'
                        },
                        {
                            path: "/admin",
                            name: '管理员管理',
                            icon: 'el-icon-menu'
                        }
                    ]
                },
                {
                    name: '动漫管理',
                    icon: 'el-icon-mobile',
                    children: [
                        {
                            path: "/anime",
                            name: '信息管理',
                            icon: 'el-icon-menu'
                        },
                        {
                            path: "/comment",
                            name: '评论管理',
                            icon: 'el-icon-menu'
                        }
                    ]
                }
            ]
        };
    },
    computed:{
        isCollapse(){
            return this.$store.state.menu.isCollapse
        }
    }
}
</script>

<style scoped>
.el-menu-vertical-demo {
    height: 100vh;
    border: 0;
}

/*头部*/
.el-menu-vertical-demo .head{
    width: 100%;
    height: 70px;
    padding:0 15px;
    display: flex;
    justify-content: space-evenly ;
    align-items: center;
    overflow: hidden;
    color: #f1f1f1;
    font-size: 19px;
    font-weight: 700;
}

.el-menu-vertical-demo .head img {
    width:35px;
    height:35px;
}

/*菜单悬浮样式*/
.el-submenu /deep/ .el-submenu__title:hover,
.el-menu-item:hover {
    background-color: rgba(164, 169, 169, 0.32) !important;
}

/*选中样式*/
.el-menu-item.is-active {
    border-left: #fff solid 7px !important;
    background-color: rgba(205, 210, 215, 0.1) !important;
    font-weight: 700 !important;
}

.el-menu-item.is-active i,
.el-menu-item.is-active .child{
    margin-left:-7px;
}

::v-deep.el-submenu.is-active > .el-submenu__title,
::v-deep .el-submenu.is-active > .el-submenu__title i {
    color: #409eff !important;
}
</style>