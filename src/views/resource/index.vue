<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="clientOpts.value" placeholder="请选择客户端" qu style="width: 240px" class="filter-item" @change="handleChangeClientFilter">
        <el-option v-for="item in clientOpts.list" :key="item.cid" :label="item.clientId" :value="item.cid" />
      </el-select>
      <el-input v-model="resource.keyText" placeholder="资源名称或编码,按Enter搜索" suffix-icon="el-icon-search" style="width: 240px;" class="filter-item" @keyup.enter.native="handleSearchResource" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddBtn">添加资源</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="resourceList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="70" >
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="资源名称" align="center" width="180">
        <template slot-scope="scope">
          {{ scope.row.displayName }}
        </template>
      </el-table-column>
      <el-table-column label="资源编码" align="center" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源路径" align="center" width="400" >
        <template slot-scope="scope">
          {{ scope.row.uris }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdateBtn(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="resForm.title" :visible.sync="resForm.dialogFormVisible">
      <el-form ref="resForm" :rules="resFormRules" :model="resForm" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="资源名称" prop="displayName" >
          <el-input v-model="resForm.displayName" placeholder="资源名称，不可重复" />
        </el-form-item>
        <el-form-item label="资源编码" prop="name">
          <el-input v-model="resForm.name" placeholder="资源编码，不可重复"/>
        </el-form-item>
        <el-form-item label="资源路径" prop="uris" >
          <el-input v-model="resForm.uris" style="width: 500px;" placeholder="资源路径，必填且不包含上下文名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resForm.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { requestUtil } from '@/api/table'
import { Message } from 'element-ui'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        Published: 'success',
        Disabled: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      resourceList: null,
      resourceTempList: null,
      listLoading: false,
      clientOpts: {
        list: [],
        value: ''
      },
      resource: {
        keyText: ''
      },
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
      }
    }
  },
  created() {
    this.loadClients()
  },
  methods: {
    loadClients() {
      const self = this
      const clientUrl = '/msas-auth-gateway/msas-microservice-usr/auth/clients/get'
      requestUtil(clientUrl, 'get', {}, {}).then(response => {
        console.log(response)
        self.clientOpts.list = response.result.filter(data => {
          return data.enableAuth === true
        })
      })
    },
    handleChangeClientFilter() {
      const self = this
      const cId = self.clientOpts.value
      if (cId === '') {
        return
      }
      self.loadResourceByClientId(cId)
    },
    loadResourceByClientId(clientId) {
      const self = this
      self.listLoading = true
      const clientResourceUrl = '/msas-auth-gateway/msas-microservice-usr/auth/resource/get/' + clientId
      requestUtil(clientResourceUrl, 'get', {}, {}).then(response => {
        console.log(response)
        self.resourceList = response.result
        self.resourceTempList = response.result
        self.listLoading = false
      })
    },
    handleAddBtn() {
      const self = this
      if (self.clientOpts.value === '') {
        Message({
          message: '请先选择客户端!',
          type: 'info',
          duration: 3 * 1000
        })
        return
      }
      self.resForm.id = ''
      self.resForm.uris = ''
      self.resForm.name = ''
      self.resForm.displayName = ''
      self.resForm.title = '新建资源'
      self.resForm.dialogFormVisible = true
    },
    handleUpdateBtn(row) {
      const self = this
      console.log(row)
      self.resForm.title = '编辑资源'
      self.resForm.dialogFormVisible = true
      self.resForm.id = row._id
      self.resForm.uris = row.uris[0]
      self.resForm.name = row.name
      self.resForm.displayName = row.displayName
    },
    handleDelete(row) {
      const self = this
      this.$confirm('确定删除该资源吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.deleteResource(row._id)
      }).catch(() => {
      })
    },
    deleteResource(resourceId) {
      const self = this
      const clientId = self.clientOpts.value
      const delResourceUrl = '/msas-auth-gateway/msas-microservice-usr/auth/resource/del/' + clientId + '/' + resourceId
      requestUtil(delResourceUrl, 'delete', {}, {}).then(response => {
        console.log(response)
        Message({
          message: response.message,
          type: 'success',
          duration: 3 * 1000
        })
        self.loadResourceByClientId(clientId)
      })
    },
    handleSearchResource() {
      const self = this
      const searchText = self.resource.keyText
      if (searchText === '') {
        self.resourceList = self.resourceTempList
        return
      }
      self.resourceList = self.resourceTempList.filter(data => {
        if (data.displayName) {
          return data.displayName.indexOf(searchText) > -1 || data.name.indexOf(searchText) > -1
        }
        return data.name.indexOf(searchText) > -1
      })
    },
    handleSubmit() {
      const self = this
      self.$refs['resForm'].validate((valid) => {
        if (valid) {
          const resourceCode = self.resForm.name
          const resourceName = self.resForm.displayName
          let method = 'put'
          let addResourceUrl = '/msas-auth-gateway/msas-microservice-usr/auth/resource/put/' + self.clientOpts.value + '/' + self.resForm.id
          let params = { 'resourceName': resourceCode, 'dispalyName': resourceName, 'uris': self.resForm.uris }
          if (!self.resForm.id) {
            const filterArry = self.resourceTempList.filter(data => {
              if (data.displayName) {
                return data.displayName.indexOf(resourceName) > -1
              }
              if (data.name) {
                return data.name.indexOf(resourceCode) > -1
              }
            })
            if (filterArry.length > 0) {
              Message({
                message: '资源名称或编码重复!',
                type: 'error',
                duration: 3 * 1000
              })
              return
            }
            method = 'post'
            addResourceUrl = '/msas-auth-gateway/msas-microservice-usr/auth/resource/add'
            params = { 'clientId': self.clientOpts.value, 'resourceName': resourceCode, 'dispalyName': resourceName, 'uris': self.resForm.uris }
          }
          requestUtil(addResourceUrl, method, params, {}).then(response => {
            console.log(response)
            Message({
              message: response.message,
              type: 'success',
              duration: 3 * 1000
            })
            self.resForm.dialogFormVisible = false
            self.loadResourceByClientId(self.clientOpts.value)
          })
        }
      })
    }
  }
}
</script>
