<template>
    <div>
        <el-container>
            <el-aside width="auto">
                <NavMenu></NavMenu>
            </el-aside>
            <el-container>
                <el-header>
                    <Header></Header>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import NavMenu from "../components/NavMenu.vue";
import Header from "../components/Header.vue";
export default {
    name: "Main",
    components:{
        NavMenu,
        Header,
    }
}
</script>

<style scoped>
.el-header {
    height:70px!important ;
    padding:0;
    border: 0!important ;
}

.el-aside {
    transition: width 0.2s;
    -webkit-transition: width 0.2s;
    -moz-transition: width 0.2s;
    -o-transition: width 0.2s;
}

</style>