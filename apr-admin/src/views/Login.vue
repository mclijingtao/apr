<template>
    <div class="main">
        <el-form :inline="true" :model="form" :rules="rules" class="login" ref="form">
            <h2>系统登录</h2>
            <el-form-item label="账号" prop="name">
                <el-input v-model="form.name" placeholder="请输入账号" clearable maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" clearable show-password maxlength="20"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from "../api"
import Cookie from "js-cookie";
export default {
    name: "Login",
    data() {
        return {
            form: {
                name: '',
                password: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    api.adminLogin(this.form).then(({ data }) => {
                        if (data.state === 'resolve') {
                            localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
                            Cookie.set('token', data.token, {expires: 30});
                            this.$message({
                                message: data.meg,
                                type: 'success'
                            });
                            this.$router.push({ name: 'home' })
                        } else if (data.state === 'reject') {
                            this.$message.error(data.meg);
                        }
                    }).catch((error) => {
                        this.$message.error(error);
                    })
                } else {
                    this.$message({
                        message: '输入格式错误',
                        type: 'warning'
                    });
                }
            });
        }
    }
}
</script>

<style scoped>
.main {
    width: 100%;
    height: 100vh;
    background-image: linear-gradient(248deg, rgba(213, 213, 213, 0.01) 0%, rgba(213, 213, 213, 0.01) 14.286%, rgba(140, 140, 140, 0.01) 14.286%, rgba(140, 140, 140, 0.01) 28.572%, rgba(52, 52, 52, 0.01) 28.572%, rgba(52, 52, 52, 0.01) 42.858%, rgba(38, 38, 38, 0.01) 42.858%, rgba(38, 38, 38, 0.01) 57.144%, rgba(159, 159, 159, 0.01) 57.144%, rgba(159, 159, 159, 0.01) 71.42999999999999%, rgba(71, 71, 71, 0.01) 71.43%, rgba(71, 71, 71, 0.01) 85.71600000000001%, rgba(88, 88, 88, 0.01) 85.716%, rgba(88, 88, 88, 0.01) 100.002%), linear-gradient(385deg, rgba(25, 25, 25, 0.01) 0%, rgba(25, 25, 25, 0.01) 12.5%, rgba(150, 150, 150, 0.01) 12.5%, rgba(150, 150, 150, 0.01) 25%, rgba(84, 84, 84, 0.01) 25%, rgba(84, 84, 84, 0.01) 37.5%, rgba(85, 85, 85, 0.01) 37.5%, rgba(85, 85, 85, 0.01) 50%, rgba(188, 188, 188, 0.01) 50%, rgba(188, 188, 188, 0.01) 62.5%, rgba(80, 80, 80, 0.01) 62.5%, rgba(80, 80, 80, 0.01) 75%, rgba(73, 73, 73, 0.01) 75%, rgba(73, 73, 73, 0.01) 87.5%, rgba(219, 219, 219, 0.01) 87.5%, rgba(219, 219, 219, 0.01) 100%), linear-gradient(251deg, rgba(233, 233, 233, 0.01) 0%, rgba(233, 233, 233, 0.01) 25%, rgba(114, 114, 114, 0.01) 25%, rgba(114, 114, 114, 0.01) 50%, rgba(164, 164, 164, 0.01) 50%, rgba(164, 164, 164, 0.01) 75%, rgba(228, 228, 228, 0.01) 75%, rgba(228, 228, 228, 0.01) 100%), linear-gradient(365deg, rgba(139, 139, 139, 0.02) 0%, rgba(139, 139, 139, 0.02) 16.667%, rgba(44, 44, 44, 0.02) 16.667%, rgba(44, 44, 44, 0.02) 33.334%, rgba(166, 166, 166, 0.02) 33.334%, rgba(166, 166, 166, 0.02) 50.001000000000005%, rgba(2, 2, 2, 0.02) 50.001%, rgba(2, 2, 2, 0.02) 66.668%, rgba(23, 23, 23, 0.02) 66.668%, rgba(23, 23, 23, 0.02) 83.33500000000001%, rgba(21, 21, 21, 0.02) 83.335%, rgba(21, 21, 21, 0.02) 100.002%), linear-gradient(376deg, rgba(3, 3, 3, 0.03) 0%, rgba(3, 3, 3, 0.03) 12.5%, rgba(116, 116, 116, 0.03) 12.5%, rgba(116, 116, 116, 0.03) 25%, rgba(214, 214, 214, 0.03) 25%, rgba(214, 214, 214, 0.03) 37.5%, rgba(217, 217, 217, 0.03) 37.5%, rgba(217, 217, 217, 0.03) 50%, rgba(68, 68, 68, 0.03) 50%, rgba(68, 68, 68, 0.03) 62.5%, rgba(118, 118, 118, 0.03) 62.5%, rgba(118, 118, 118, 0.03) 75%, rgba(200, 200, 200, 0.03) 75%, rgba(200, 200, 200, 0.03) 87.5%, rgba(198, 198, 198, 0.03) 87.5%, rgba(198, 198, 198, 0.03) 100%), linear-gradient(145deg, rgba(195, 195, 195, 0.03) 0%, rgba(195, 195, 195, 0.03) 16.667%, rgba(177, 177, 177, 0.03) 16.667%, rgba(177, 177, 177, 0.03) 33.334%, rgba(170, 170, 170, 0.03) 33.334%, rgba(170, 170, 170, 0.03) 50.001000000000005%, rgba(158, 158, 158, 0.03) 50.001%, rgba(158, 158, 158, 0.03) 66.668%, rgba(121, 121, 121, 0.03) 66.668%, rgba(121, 121, 121, 0.03) 83.33500000000001%, rgba(146, 146, 146, 0.03) 83.335%, rgba(146, 146, 146, 0.03) 100.002%), linear-gradient(316deg, rgba(103, 103, 103, 0.03) 0%, rgba(103, 103, 103, 0.03) 25%, rgba(112, 112, 112, 0.03) 25%, rgba(112, 112, 112, 0.03) 50%, rgba(4, 4, 4, 0.03) 50%, rgba(4, 4, 4, 0.03) 75%, rgba(227, 227, 227, 0.03) 75%, rgba(227, 227, 227, 0.03) 100%), linear-gradient(138deg, hsl(98, 0%, 0%), hsl(98, 0%, 0%));
    display: flex;
    justify-content: center;
    align-items: center;
}

.login {
    width: 350px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
}

h2 {
    margin: 20px 0;
    color: #363636;
}
</style>