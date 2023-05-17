<template>
    <div class="manage">
        <el-card class="manage-header">
            <el-dialog title="新增管理员" :visible.sync="dialogVisible" :before-close="handleClose" width="30%">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="头像" prop="avatar">
                        <el-upload
                                class="avatar-uploader"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :show-file-list="false"
                                :auto-upload="false"
                                :on-change="imgSaveToUrl"
                                :on-remove="handleRemove">
                            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" alt="avatar">
                            <span v-if="form.imageUrl" class="el-upload-action" @click.stop="handleRemove()">
                    <i class="el-icon-delete"></i>
                </span>
                            <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="账号名" prop="name">
                        <el-input v-model="form.name" placeholder="请输入账号名" maxlength="12" show-word-limit
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" placeholder="请输入账号密码" maxlength="20" show-word-limit
                                  clearable></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="handleClose">取 消</el-button>
                  <el-button type="primary" @click="submit">确 定</el-button>
            </span>
            </el-dialog>
            <div>
                <el-input placeholder="请输入搜索的管理员" v-model.lazy="input" clearable
                          style="width: 300px;margin:0 20px"></el-input>
                <el-button type="primary" @click="searchAdmin" style="margin-right:20px">搜索</el-button>
                <el-button type="info" plain @click="dialogVisible = true">
                    + 新增管理员
                </el-button>
            </div>
        </el-card>
        <el-card style="height:90%">
            <el-table :data="List" style="width: 100%" height="93%">
                <el-table-column
                        prop="admin_id"
                        label="账号ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="head"
                        label="头像"
                        width="250">
                    <template slot-scope="scope">
                        <el-avatar shape="square" size="large" :src="scope.row.head"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="admin_name"
                        label="账号名"
                        width="350">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="warning"
                                   @click="handleEdit(scope.row)">重置密码
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除管理员
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout=" total, sizes, prev, pager, next, jumper"
                    :total="tableData.length || 0">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import api from "@/api";

export default {
    name: "Admin",
    data() {
        return {
            input: "",
            dialogVisible: false,
            form: {
                name: "",
                password: "",
                imageUrl: 'http://127.0.0.1:3000/admin/admin.png'
            },
            file: {},
            rules: {
                name: [
                    {required: true, message: '请输入账号名', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入账号密码', trigger: 'blur'},
                    {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
                ],
            },
            tableData: [],
            searchList: [],
            pageSize: 10,
            currentPage: 1
        };
    },
    methods: {
        // 搜索管理员
        searchAdmin() {
            if (this.input.length === 0) {
                this.$message({
                    message: '搜索框不能为空',
                    type: 'warning'
                });
            } else {
                api.searchAdmin({name: this.input}).then(({data}) => {
                    if (data.state === 'reject') {
                        this.$message(data.meg);
                    } else if (data.state === 'resolve') {
                        this.$message({
                            message: data.meg,
                            type: 'success'
                        });
                        this.searchList = data.adminList
                    }
                }).catch(() => {
                    this.$message.error('搜索失败！');
                })
            }
        },
        // 获取管理员列表
        getAdminList() {
            api.getAdminList().then(({data}) => {
                this.tableData = data
            })
        },
        // 重置新增管理员表单,并关掉
        handleClose() {
            this.form = {
                name: "",
                password: "",
                imageUrl: 'http://127.0.0.1:3000/admin/admin.png'
            }
            this.dialogVisible = false
        },
        // 获取要上传的图片并显示
        imgSaveToUrl(file) {
            const type = (file.raw.type === 'image/jpg' || file.raw.type === 'image/jpeg' || file.raw.type === 'image/png')
            const isLt2M = (file.raw.size / 1024 / 1024 < 2)
            if (!type) {
                this.$message.error('图片格式不正确!(只能包含jpg,jpeg,png)')
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
            }
            if (type && isLt2M) {
                this.form.imageUrl = URL.createObjectURL(file.raw);
                this.file = file.raw
            }
        },
        // 删除选择的图片
        handleRemove() {
            this.form.imageUrl = ''
        },
        // 提交新增管理员表单
        submit() {
            if (this.form.imageUrl === '' || typeof (this.form.imageUrl) == 'undefined') {
                this.$message.error('未设置头像！')
            } else {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.formData = new FormData();
                        this.formData.append('head', this.file);
                        this.formData.append('name', this.form.name);
                        this.formData.append('password', this.form.password);
                        api.upAdmin(this.formData).then((res) => {
                            if (res.data.state === 'resolve') {
                                this.getAdminList()
                                this.handleClose()
                                this.$message({
                                    message: res.data.message,
                                    type: 'success'
                                });
                            } else if (res.data.state === 'reject') {
                                this.$message.error(res.data.message);
                            }
                        }).catch((err) => {
                            this.$message.error(err)
                        })
                    }
                })
            }
        },
        // 重置密码按钮
        handleEdit(row) {
            this.$confirm('确认是否重置密码?', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.setAdmin({admin_id: row.admin_id}).then(() => {
                    this.$alert('已将该管理员密码重置为默认：123456', '重置成功', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$message({
                                type: 'success',
                                message: '重置成功!'
                            });
                        }
                    });
                }).catch(error => {
                    this.$message.error(error)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消重置'
                });
            });
        },
        // 删除按钮
        handleDelete(row) {
            this.$confirm('确认是否删除管理员?', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                api.delAdmin({admin_id: row.admin_id}).then(() => {
                    this.getAdminList()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(error => {
                    this.$message.error(error)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 绑定一页显示数量
        handleSizeChange(val) {
            this.pageSize = val
        },
        // 绑定选择第几页
        handleCurrentChange(val) {
            this.currentPage = val
        }
    },
    computed: {
        // 列表数据
        List() {
            const isSearch = this.searchList.length > 0
            const pageList = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            return isSearch ? this.searchList : pageList
        }
    },
    mounted() {
        this.getAdminList()
    },
    watch:{
        input(){
            if (this.input.length===0){
                this.searchList=[]
            }
        }
    }
}
</script>

<style scoped>
.manage {
    height: 85%;
}

.manage /deep/ .el-card__body {
    height: 100%;
}

/*head*/
.manage-header {
    margin: 10px 0 30px;
}

/*表单样式*/
.el-form-item:first-child,
.el-form-item:last-child {
    margin-bottom: 0;
}

.avatar-uploader {
    width: 120PX;
    height: 120px;
    border-radius: 10%;
    cursor: pointer;
    position: relative;
    top: -30px;
    left: 10px;
    overflow: hidden;
    border: 1px dashed #b9b3b3;
    background-size: 100% 100%;
}

.avatar-uploader-icon {
    font-size: 30px;
    color: #b9b3b3;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.avatar {
    position: relative;
    width: 120px;
    height: 120px;
    display: block;
}

.el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 120px;
}

.el-upload-action:hover {
    font-size: 20px;
    background-color: #000;
    background-color: rgba(0, 0, 0, .3)
}

/*分页样式*/
/deep/ .el-pagination {
    margin-top: 10px;
    width: 100%;
    text-align: right;
}

/deep/ .el-pagination .el-pagination__jump {
    float: right;
}

/deep/ .el-pagination .el-pagination__sizes,
/deep/ .el-pagination .el-pagination__total {
    float: left;
}
</style>