<template>
    <div class="app-container">
        <el-form :inline="true" label-width="120px" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="username" placeholder="请输入用户名,按Enter搜索,支持模糊搜索" style="width:300px"
                          @keyup.enter.native="toSearchProgram"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="toSearchProgram()"><i class="el-icon-search"/>&nbsp;&nbsp;搜索
                </el-button>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                           @click="programAddBtn">添加应用
                </el-button>
            </el-form-item>
        </el-form>

        <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="加载中"
                border
                fit
                highlight-current-row>
            <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="应用名称">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="icon图标">
                <template slot-scope="scope">
                    {{ scope.row.icon }}
                </template>
            </el-table-column>
            <el-table-column label="链接地址" align="center">
                <template slot-scope="scope">
                    {{ scope.row.url }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                    {{ scope.row.create_time }}
                </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
                <template slot-scope="scope">
                    {{ scope.row.text_abstract }}
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态（open_status）" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enabled | statusFilter">{{ scope.row.enabled ? '已启用' : '已禁用' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态（show_status）" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enabled | statusFilter">{{ scope.row.enabled ? '已启用' : '已禁用' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.enabled === false" type="text" @click="toDelete(scope.row.id)">禁用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="resForm.title" :visible.sync="resForm.dialogFormVisible">
            <el-form ref="resForm" :rules="resFormRules" :model="resForm" label-position="left" label-width="90px"
                     style="width: 400px; margin-left:50px;">
                <el-form-item label="应用名称" prop="displayName">
                    <el-input v-model="resForm.displayName" placeholder="资源名称，不可重复"/>
                </el-form-item>
                <el-form-item label="资源编码" prop="name">
                    <el-input v-model="resForm.name" placeholder="资源编码，不可重复"/>
                </el-form-item>
                <el-form-item label="资源路径" prop="uris">
                    <el-input v-model="resForm.uris" style="width: 500px;" placeholder="资源路径，必填且不包含上下文名称"/>
                </el-form-item>
                <!--图片上传-->
                <el-upload
                        action="http://localhost:8992/common/fileUpload"
                list-type="picture-card"
                accept="image/*"
                :limit="imgLimit"
                :file-list="productImgs"
                :multiple="isMultiple"
                :headers="myHeaders"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-exceed="handleExceed"
                :on-error="imgUploadError">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resForm.dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {requestUtil} from '@/api/user'
    import axios from 'axios'
    import service2 from '@/utils/request2'

    export default {

        filters: {
            statusFilter(status) {
                const statusMap = {
                    true: 'success',
                    false: 'danger'
                }
                return statusMap[status]
            }
        },
        data() {
            return {
                listLoading: false,
                username: '',
                resForm: {
                    title: '',
                    dialogFormVisible: false,
                    displayName: '',
                    name: '',
                    uris: '',
                    id: ''
                },
                resFormRules: {
                    displayName: [
                        {required: true, message: '请输入资源名称', trigger: 'blur'},
                        {min: 3, max: 50, message: '3-50字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入资源编码', trigger: 'blur'},
                        {min: 3, max: 50, message: '3-50字符', trigger: 'blur'}
                    ],
                    uris: [
                        {required: true, message: '请输入资源路径', trigger: 'blur'},
                        {min: 3, max: 100, message: '3-100字符', trigger: 'blur'}
                    ]
                },
                dialogImageUrl: '',
                dialogVisible: false,
                productImgs: [],
                isMultiple: true,
                imgLimit: 1,
                myHeaders :{},

            }
        },
        created() {
            // this.toSearchProgram()
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleSubmit() {

            },
            programAddBtn() {
                const self = this
                self.resForm.id = ''
                self.resForm.uris = ''
                self.resForm.name = ''
                self.resForm.displayName = ''
                self.resForm.title = '新建资源'
                self.resForm.dialogFormVisible = true
            },
            toDelete(id) {
                this.$confirm('确定要禁用吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('确定禁用_' + id)
                    this.delete(id)
                }).catch(() => {
                    console.log('取消禁用_' + id)
                })
            },
            delete(id) {
                const myUrl = '/msas-auth-gateway/msas-microservice-usr/kcUser/deleteUser/' + id
                const myMethod = 'delete'``
                const myParams = {}
                const myHeaders = {}
                requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
                    this.$message('禁用成功,刷新状态中...')
                    this.toSearchProgram()
                })
            },
            fileupload(){
                var f = this.$refs.file.files;
                console.dir(f.files[0]);
                const token = sessionStorage.getItem('access_token')
                const auth = 'Bearer ' + token
                // axios({
                //     headers: {
                //         'Authorization': auth,
                //         'Content-Type': 'multipart/form-data',
                //     },
                //     method: post,
                //     url: '/api/common/fileupload'
                //     data:{}
                // })
            },

            toSearchProgram() {
                var _this = this;
                // service2.request({
                //     url: 'http://localhost:8992/program/index',
                // }).then(response => {
                //     console.log(response.data.resultObject.list);
                // })
                const token = sessionStorage.getItem('access_token')
                const auth = 'Bearer ' + token
                console.log(auth);
                axios({
                    headers: {
                        'Authorization': auth
                    },
                    method: 'post',
                    url: '/api/program/index',
                    data: {}
                }).then(function (response) {
                    console.log(response.data.resultObject.list);
                    _this.list = response.data.resultObject.list;
                })
            },


            handleRemove(file, fileList) {//移除图片
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {//预览图片时调用
                console.log(file);
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            beforeAvatarUpload(file) {//文件上传之前调用做一些拦截限制
                const token = sessionStorage.getItem('access_token')
                const auth = 'Bearer ' + token
                this.myHeaders = {'Authorization': auth},

                console.log(file);
                const isJPG = true;
                // const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                //   this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleAvatarSuccess(res, file) {//图片上传成功
                console.log(res);
                console.log(file);
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            handleExceed(files, fileList) {//图片上传超过数量限制
                this.$message.error('上传图片不能超过6张!');
                console.log(file, fileList);
            },
            imgUploadError(err, file, fileList) {//图片上传失败调用
                console.log(err)
                this.$message.error('上传图片失败!');

            }
        }
    }
</script>
