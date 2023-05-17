<template>
    <div class="manage">
        <el-card class="manage-header">
            <el-dialog title="动漫信息" :visible.sync="dialogVisible" :before-close="handleClose" width="40%">
                <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="动漫名" prop="anime_name">
                        <el-input v-model="form.anime_name" placeholder="请输入动漫名" maxlength="20" show-word-limit
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="avatar">
                        <el-upload
                                class="avatar-uploader"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :show-file-list="false"
                                :auto-upload="false"
                                :on-change="imgSaveToUrl"
                                :on-remove="handleRemove">
                            <img v-if="form.anime_pic" :src="form.anime_pic" class="avatar" alt="avatar">
                            <span v-if="form.anime_pic" class="el-upload-action" @click.stop="handleRemove()">
                    <i class="el-icon-delete"></i>
                </span>
                            <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="动漫地区" prop="anime_district">
                        <el-select v-model="form.anime_district" placeholder="请选择动漫地区">
                            <el-option label="中国" value="中国"></el-option>
                            <el-option label="日本" value="日本"></el-option>
                            <el-option label="欧美" value="欧美"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="动漫年份" prop="anime_time">
                        <el-select v-model="form.anime_time" placeholder="请选择动漫年份">
                            <el-option label="2018" value="2018"></el-option>
                            <el-option label="2019" value="2019"></el-option>
                            <el-option label="2020" value="2020"></el-option>
                            <el-option label="2021" value="2021"></el-option>
                            <el-option label="2022" value="2022"></el-option>
                            <el-option label="2023" value="2023"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="动漫类型" prop="anime_type">
                        <el-select v-model="form.anime_type" placeholder="请选择动漫类型">
                            <el-option label="搞笑" value="搞笑"></el-option>
                            <el-option label="冒险" value="冒险"></el-option>
                            <el-option label="幻想" value="幻想"></el-option>
                            <el-option label="动作" value="动作"></el-option>
                            <el-option label="校园" value="校园"></el-option>
                            <el-option label="热血" value="热血"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="动漫简介" prop="anime_content">
                        <el-input type="textarea" maxlength="255" show-word-limit
                                  v-model="form.anime_content"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="handleClose">取 消</el-button>
                  <el-button type="primary" @click="submit">确 定</el-button>
            </span>
            </el-dialog>
            <div>
                <el-input placeholder="请输入搜索的动漫" v-model.lazy="input" clearable
                          style="width: 300px;margin:0 20px"></el-input>
                <el-button type="primary" @click="searchAnime" style="margin-right:20px">搜索</el-button>
                <el-button type="info" plain @click="handleAdd">
                    + 新增动漫
                </el-button>
            </div>
        </el-card>
        <el-card style="height:90%">
            <el-table :data="List" style="width: 100%" height="93%">
                <el-table-column
                        prop="anime_id"
                        label="动漫ID"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="anime_name"
                        label="动漫名"
                        width="300">
                </el-table-column>
                <el-table-column prop="anime_district" label="地区" width="150">
                    <template slot-scope="scope">
                        <el-tag disable-transitions>
                            {{ scope.row.anime_district }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="anime_time" label="年份" width="150">
                    <template slot-scope="scope">
                        <el-tag type="warning" disable-transitions>
                            {{ scope.row.anime_time }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="anime_type" label="动漫类型" width="200">
                    <template slot-scope="scope">
                        <el-tag type='success' disable-transitions>
                            {{ scope.row.anime_type }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑详情</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除动漫</el-button>
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
    name: "Anime",
    data() {
        return {
            input: "",
            dialogVisible: false,
            modalType: "0",
            form: {
                anime_pic: '',
                anime_name: "",
                anime_district: "",
                anime_type: '',
                anime_time: '',
                anime_content: ''
            },
            file: {},
            rules: {
                anime_name: [
                    {required: true, message: '请输入动漫名', trigger: 'blur'},
                    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                ],
                anime_district: [
                    {required: true, message: '请选择动漫地区', trigger: 'change'}
                ],
                anime_type: [
                    {required: true, message: '请选择动漫类型', trigger: 'change'}
                ],
                anime_time: [
                    {required: true, message: '请选择动漫年份', trigger: 'change'}
                ],
                anime_content: [
                    {required: true, message: '请填写动漫简介', trigger: 'blur'}
                ]
            },
            tableData: [],
            searchList: [],
            pageSize: 10,
            currentPage: 1
        };
    },
    methods: {
        // 搜索动漫
        searchAnime() {
            if (this.input.length === 0) {
                this.$message({
                    message: '搜索框不能为空',
                    type: 'warning'
                });
            } else {
                api.searchAnime({anime_name: this.input}).then(({data}) => {
                    if (data.state === 'reject') {
                        this.$message(data.meg);
                    } else if (data.state === 'resolve') {
                        this.$message({
                            message: data.meg,
                            type: 'success'
                        });
                        this.searchList = data.animeList
                    }
                }).catch(() => {
                    this.$message.error('搜索失败！');
                })
            }
        },
        // 获取动漫列表
        getAnimeList() {
            api.getAnimeList().then(({data}) => {
                this.tableData = data
            })
        },
        // 重置新增表单,并关掉
        handleClose() {
            this.form = {
                anime_pic: '',
                anime_name: "",
                anime_district: "",
                anime_type: '',
                anime_time: '',
                anime_content: ''
            }
            this.file = ''
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
                this.form.anime_pic = URL.createObjectURL(file.raw);
                this.file = file.raw
            }
        },
        // 删除选择的图片
        handleRemove() {
            this.form.anime_pic = ''
        },
        // 新增表单
        handleAdd() {
            this.dialogVisible = true
            this.modalType = '0'
        },
        // 编辑按钮
        handleEdit(row) {
            this.dialogVisible = true
            this.modalType = '1'
            this.form = JSON.parse(JSON.stringify(row))
        },
        // 提交表单
        submit() {
            if (this.form.anime_pic === '' || typeof (this.form.anime_pic) == 'undefined') {
                this.$message.error('未选择封面！')
            } else {
                this.$refs.form.validate((valid) => {
                    this.formData = new FormData();
                    this.formData.append('anime_pic', this.file);
                    this.formData.append('data', JSON.stringify(this.form));
                    if (valid) {
                        if (this.modalType === '0') {
                            api.upAnime(this.formData).then((res) => {
                                if (res.data.state === 'resolve') {
                                    this.getAnimeList()
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
                        } else if (this.modalType === '1') {
                            api.setAnime(this.formData).then((res) => {
                                if (res.data.state === 'resolve') {
                                    this.getAnimeList()
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
                    }
                })
            }
        },
        // 删除按钮
        handleDelete(row) {
            this.$confirm('确认是否删除动漫?', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                api.delAnime({anime_id: row.anime_id}).then(() => {
                    this.getAnimeList()
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
    mounted() {
        this.getAnimeList()
    },
    computed: {
        // 列表数据
        List() {
            const isSearch = this.searchList.length > 0
            const pageList = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            return isSearch ? this.searchList : pageList
        }
    },
    watch: {
        input() {
            if (this.input.length === 0) {
                this.searchList = []
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
/deep/ .el-dialog__body {
    padding-bottom: 0;
}

.avatar-uploader {
    width: 150PX;
    height: 200px;
    border-radius: 10%;
    position: absolute;
    overflow: hidden;
    border: 1px dashed #b9b3b3;
    background-size: 100% 100%;
}

.avatar-uploader-icon {
    font-size: 30px;
    color: #b9b3b3;
    width: 150px;
    height: 200px;
    line-height: 200px;
    text-align: center;
}

.avatar {
    position: relative;
    width: 150px;
    height: 200px;
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
    line-height: 200px;
}

.el-upload-action:hover {
    font-size: 20px;
    background-color: #000;
    background-color: rgba(0, 0, 0, .3)
}

/deep/ .el-textarea .el-textarea__inner {
    height: 120px;
    width: 470px;
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