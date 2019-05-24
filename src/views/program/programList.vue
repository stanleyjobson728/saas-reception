<template>
  <div class="app-container">
    <el-form :inline="true" label-width="120px" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="username" placeholder="请输入用户名,按Enter搜索,支持模糊搜索" style="width:300px" @keyup.enter.native="toSearchProgram"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearchProgram()"><i class="el-icon-search" />&nbsp;&nbsp;搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="programAddBtn">添加应用</el-button>
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
          <el-button :disabled="scope.row.enabled === false" type="text" @click="toDelete(scope.row.id)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="resForm.title" :visible.sync="resForm.dialogFormVisible">
      <el-form ref="resForm" :rules="resFormRules" :model="resForm" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="应用名称" prop="displayName" >
          <el-input v-model="resForm.displayName" placeholder="资源名称，不可重复" />
        </el-form-item>
        <el-form-item label="资源编码" prop="name">
          <el-input v-model="resForm.name" placeholder="资源编码，不可重复"/>
        </el-form-item>
        <el-form-item label="资源路径" prop="uris" >
          <el-input v-model="resForm.uris" style="width: 500px;" placeholder="资源路径，必填且不包含上下文名称"/>
        </el-form-item>
        <!--图片上传-->
        <el-form-item label="图片">
          <el-upload
            ref="upload"
            action="http://localhost:8992/common/fileUpload"
            name="file"
            list-type="picture-card"
            :limit="1"
            :file-list="fileList"
            :on-exceed="onExceed"
            :headers="myHeader"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

          图片上传：
          <input type="file" placeholder="商品图片" class="marleft marright clearmoren" id="chuan" ref="file" @change="upload2">
          <el-button type="primary" size="mini" @click="upload">上传</el-button>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resForm.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { requestUtil } from '@/api/user'
  // import axios from 'axios'
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
        uploadfile: null,
        list: null,
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
            { required: true, message: '请输入资源名称', trigger: 'blur' },
            { min: 3, max: 50, message: '3-50字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入资源编码', trigger: 'blur' },
            { min: 3, max: 50, message: '3-50字符', trigger: 'blur' }
          ],
          uris: [
            { required: true, message: '请输入资源路径', trigger: 'blur' },
            { min: 3, max: 100, message: '3-100字符', trigger: 'blur' }
          ]
        },
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
        const myMethod = 'delete'
        const myParams = {}
        const myHeaders = {}
        requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
          this.$message('禁用成功,刷新状态中...')
          this.toSearchProgram()
        })
      },
      toSearchProgram() {
        var _this = this;
        service2.request('/api/program/index',
          {page: 1}
        ).then(function (response) {
          console.log(response.data.resultObject.list);
          _this.list = response.data.resultObject.list;
          var item = sessionStorage.getItem('access_token');
          console.log(item);
        })
      },

      //文件上传成功的钩子函数
      handleSuccess(res, file) {
        this.$message({
          type: 'info',
          message: '图片上传成功',
          duration: 6000
        });
        if (file.response.success) {
          this.editor.picture = file.response.message; //将返回的文件储存路径赋值picture字段
        }
      },
      //删除文件之前的钩子函数
      handleRemove(file, fileList) {
        this.$message({
          type: 'info',
          message: '已删除原有图片',
          duration: 6000
        });
      },
      //点击列表中已上传的文件事的钩子函数
      handlePreview(file) {
      },
      //上传的文件个数超出设定时触发的函数
      onExceed(files, fileList) {
        this.$message({
          type: 'info',
          message: '最多只能上传一个图片',
          duration: 6000
        });
      },
      //文件上传前的前的钩子函数
      //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      },
      upload2:function(){
        this.uploadfile =  this.$refs.file.files  // 里面就是你要的内容
      },
      //上传图片
      upload: function () {
        // var f = this.$refs.file.files;
        // console.log(this.$refs.file);
        // console.dir(f.files[0]);
        let param = new FormData();
        param.append('file', this.uploadfile);//通过append向form对象添加数据
        console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        };
        const token = sessionStorage.getItem('access_token')
        const auth = 'Bearer ' + token
        config.headers['Authorization'] = auth
        //添加请求头
        service2.request("http://localhost:8992/common/fileUpload", param, config)
          .then(response => {
            this.form.url = this.$store.state.geturl.photourl + response.data.data.url;
            console.log(this.form.url)
            if (this.form.url) {
              alert('图片上传成功')
            }
          })
      },
    }
  }
</script>
