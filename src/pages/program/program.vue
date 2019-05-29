<template>
    <div class="program">
        <header-module></header-module>
        <div class="content">
            <div class="search">
                <el-col :span="6">
                    <el-input v-model="pagingObj.name" placeholder="请输入内容"></el-input>
                </el-col>
                <el-button type="primary" icon="el-icon-search" @click="changeSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="changeAddProgram">添加应用</el-button>
            </div>
            <el-table v-loading="listLoading" :data="list" element-loading-text="加载中" border fit highlight-current-row>
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
                        <img :src="scope.row.icon" />
                    </template>
                </el-table-column>
                <el-table-column label="链接地址" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.url }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.createTime }}
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.textAbstract }}
                    </template>
                </el-table-column>
                <el-table-column class-name="status-col" label="状态（open_status）" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.openStatus ? '新窗口打开' : '原窗口打开' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column class-name="status-col" label="状态（show_status）" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.showStatus ? '显示' : '隐藏' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="changeEidter(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination background @current-change='handleChangePage' layout="prev, pager, next" :total="pageTotal"></el-pagination>
            <!-- 新添加应用弹框 -->
            <el-dialog title="新建资源" :visible.sync="dialogFormVisible" @close='changeCloseDialog'>
                <el-form ref="resForm" :rules="resFormRules" :model="resForm" label-position="left" label-width="90px">
                    <el-form-item label="应用名称" prop="displayName">
                        <el-input v-model="resForm.displayName" placeholder="资源名称，不可重复" />
                    </el-form-item>
                    <el-form-item label="应用描述" prop="description">
                        <el-input v-model="resForm.description" placeholder="应用描述" />
                    </el-form-item>
                    <el-form-item label="资源路径" prop="uris">
                        <el-input v-model="resForm.uris" placeholder="资源路径，必填且不包含上下文名称" />
                    </el-form-item>
                    <el-form-item label="打开方式">
                        <el-radio v-model="resForm.radio" label="0">原窗口打开</el-radio>
                        <el-radio v-model="resForm.radio" label="1">新窗口打开</el-radio>
                    </el-form-item>
                    <el-form-item label="是否显示">
                        <el-radio v-model="resForm.radio1" label="0">隐藏</el-radio>
                        <el-radio v-model="resForm.radio1" label="1">显示</el-radio>
                    </el-form-item>
                    <!--图片上传-->
                    <el-form-item label="ICON" class="defaultPic" prop="icon">
                        <label for="pic">
                            <img :src="resForm.icon" class="el-icon-plus" alt="">
                        </label>
                        <input @change="fileFn" type="file" id="pic" accept="image/*">
                        <p v-if="resForm.fileErrorFlag == false">只能上传jpg/png格式文件，文件不能超过1M</p>
                        <p class='fileError' v-if="resForm.fileErrorFlag == true">{{this.resForm.fileErrorText}}</p>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import HeaderModule from '@/components/HeaderModule.vue'
    import Api from '@/api/index'
    import {compress} from './../../plugin/common'
    export default {
        name: "program",
        data() {
            return {
                listLoading: false,
                list: [],
                pageTotal: 0,
                pagingObj: {
                    name: '',
                    page: 1,
                    pagenum: 10
                },
                dialogFormVisible: false,
                resForm: {
                    isUpdataFlag: '',
                    displayName: '',
                    description: '',
                    uris: '',
                    radio: '0',
                    radio1: '0',
                    icon: '',
                    fileErrorFlag: false,
                    fileErrorText: ''
                },
                resFormRules: {
                    displayName: [
                        {required: true, message: '请输入资源名称', trigger: 'blur'},
                        {min: 3, max: 50, message: '3-50字符', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入应用描述', trigger: 'blur'},
                        {min: 3, max: 50, message: '3-50字符', trigger: 'blur'}
                    ],
                    uris: [
                        {required: true, message: '请输入资源路径', trigger: 'blur'},
                        {min: 3, max: 100, message: '3-100字符', trigger: 'blur'}
                    ],
                    icon: [
                        {required: true, message: ' ', trigger: 'blur'}
                    ]
                },
            }
        },
        components: {
            HeaderModule
        },
        mounted() {
            this.handleProgramList();
        },
        methods: {
            // 页面初始化，获取数据
            handleProgramList() {
                let data = this.pagingObj;
                Api.getProgramList(data).then(({ data}) => {
                    console.log(data)
                    if (data.errorCode == 0) {
                        this.list = data.resultObject.list;
                        this.pageTotal = data.resultObject.total;
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 搜索
            changeSearch() {
                this.handleProgramList();
            },
            // 添加应用，显示弹框
            changeAddProgram() {
                this.dialogFormVisible = true;
            },
            // 上传图片
            fileFn(){
                if(event.target.files[0]){
                    let fileData = event.target.files[0];
                    if(fileData.size > 1*1024*1024){
                        this.resForm.fileErrorFlag = true;
                        this.resForm.fileErrorText = '图片文件不得大于1M';
                    }else{
                        let formdata = new FormData();
                        formdata.append('file',fileData)
                        Api.addImgFile(formdata).then(({data})=>{
                            if(data.errorCode === 0){
                                this.resForm.fileErrorFlag = false;
                                this.resForm.icon = data.resultObject.url;
                            }else{
                                this.$message({
                                    message: data.errorMessage,
                                    type: 'error'
                                });
                            }
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                }
            },
            // 确认提交
            handleSubmit(){
                this.$refs.resForm.validate((valid) => {
                    if (valid) {
                        // 所用参数都正确是把fileErrorFlag置为false
                        this.resForm.fileErrorFlag = false;
                        let data = {
                            icon: this.resForm.icon,
                            name: this.resForm.displayName,
                            openstatus: this.resForm.radio,
                            showstatus: this.resForm.radio1,
                            textabstract:  this.resForm.description,
                            url: this.resForm.uris
                        }
                        if(this.resForm.isUpdataFlag){
                            data.id = this.resForm.isUpdataFlag;
                            Api.updataProgram(data).then(({data})=>{
                                if(data.errorCode === 0){
                                    this.$message({
                                        message: data.resultObject,
                                        type: 'success'
                                    });
                                    this.dialogFormVisible = false;
                                    this.handleProgramList();
                                }else{
                                    this.$message({
                                        message: data.errorMessage,
                                        type: 'success'
                                    });
                                }
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }else{
                            console.log(data)
                            Api.addProgram(data).then(({data})=>{
                                if(data.errorCode === 0){
                                    this.$message({
                                        message: data.resultObject,
                                        type: 'success'
                                    });
                                    this.dialogFormVisible = false;
                                    this.handleProgramList();
                                }else{
                                    this.$message({
                                        message: data.errorMessage,
                                        type: 'success'
                                    });
                                }
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        this.resForm.fileErrorFlag = true;
                        this.resForm.fileErrorText = '请选择图片';
                        return false;
                    }
                })
            },
            // 编辑
            changeEidter(val) {
                this.dialogFormVisible = true;
                this.resForm.isUpdataFlag = val.id;
                this.resForm.displayName = val.name;
                this.resForm.description = val.textAbstract;
                this.resForm.uris = val.url;
                this.resForm.radio = String(val.openStatus);
                this.resForm.radio1 = String(val.showStatus);
                this.resForm.icon = val.icon;
            },
            // 监听dialog弹框关闭
            changeCloseDialog(){
                this.$refs.resForm.resetFields();
                this.$refs.resForm.clearValidate();
                this.resForm.fileErrorFlag = false;
            },
            // 分页
            handleChangePage(val){
                this.pagingObj.page = val;
                this.handleProgramList();
            }
        },
        watch: {

        },
        filters: {
            statusFilter() {

            }
        }
    }

</script>
<style scoped lang="scss">
    .program {
        height: 100%;
        overflow: hidden;
        .content {
            padding: 20px;
            .search {
                .el-col-6 {
                    margin-right: 16px;
                }
            }
            .el-table {
                margin-top: 20px;
                img {
                    height: 90%;
                }
            }
            .el-pagination{
                text-align: center;
                margin-top: 16px;
            }
            .el-dialog{
                .defaultPic{
                    width: auto;
                    label{
                        display: inline-block;
                        width: 100px;
                        height: 100px;
                        border: 4px dotted #363636;
                        overflow: hidden;
                        img{
                            width: 100%;
                            height: 100%;
                            font-size: 100px;
                        }
                    }
                    input{
                        display: none;
                    }
                    .fileError{
                        color: #F56C6C;
                    }
                }
            }
        }
    }

</style>
