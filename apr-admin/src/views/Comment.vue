<template>
    <div class="manage">
        <el-card style="height:95%">
            <el-table :data="List" style="width: 100%" height="93%">
                <el-table-column
                        prop="comment_id"
                        label="评论ID"
                        width="100">
                </el-table-column>
                <el-table-column
                    prop="anime_name"
                    label="评论动漫"
                    width="200">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        label="评论账号"
                        width="150">
                </el-table-column>
                <el-table-column
                    prop="comment_content"
                    label="评论内容"
                    width="400">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p style="width:500px">评论内容: {{ scope.row.comment_content }}</p>
                            <div slot="reference" class="view-text">
                                {{ scope.row.comment_content }}
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="comment_time"
                    label="评论时间"
                    :formatter="formatDate"
                    >
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除评论
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
import api from "../api"
export default {
    name: "Comments",
    data() {
        return {
            tableData: [],
            pageSize: 10,
            currentPage: 1
        };
    },
    computed: {
        // 列表数据
        List() {
            return  this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
    },
    mounted() {
        this.getCommentList()
    },
    methods: {
        // 获取用户列表
        getCommentList() {
            api.getCommentList().then(({data}) => {
                this.tableData = data
            })
        },
        // 删除按钮
        handleDelete(row) {
            this.$confirm('确认是否删除评论?', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                api.delComment({comment_id: row.comment_id}).then(() => {
                    this.getCommentList()
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
        // 格式化时间显示
        formatDate(row, column) {
            // 获取单元格数据
            let data = row[column.property]
            if(data == null) {
                return null
            }
            let dt = new Date(data)
            return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
        },
        // 绑定一页显示数量
        handleSizeChange(val) {
            this.pageSize = val
        },
        // 绑定选择第几页
        handleCurrentChange(val) {
            this.currentPage = val
        }
    }
}
</script>

<style scoped>
.manage {
    height: 100%;
}

.manage /deep/ .el-card__body {
    height: 100%;
}

.view-text{
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
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