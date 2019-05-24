<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="clientOpts.value" placeholder="请选择客户端" qu style="width: 240px" class="filter-item" @change="handleChangeClientFilter">
        <el-option v-for="item in clientOpts.list" :key="item.cid" :label="item.clientId" :value="item.cid" />
      </el-select>
      <el-input v-model="role.keyText" placeholder="角色名称或编码,按Enter搜索" suffix-icon="el-icon-search" style="width: 240px;" class="filter-item" @keyup.enter.native="handleSearchRole" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddBtn">添加角色</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="roleList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="70" >
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center" width="180">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="角色编码" align="center" width="220" >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
        <el-form-item label="角色名称" prop="description" >
          <el-input v-model="resForm.description" placeholder="角色名称，不可重复" />
        </el-form-item>
        <el-form-item label="角色编码" prop="name">
          <el-input v-model="resForm.name" placeholder="角色编码，不可重复"/>
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
      roleList: null,
      roleTempList: null,
      listLoading: false,
      clientOpts: {
        list: [],
        value: ''
      },
      role: {
        keyText: ''
      },
      resForm: {
        title: '',
        dialogFormVisible: false,
        description: '',
        name: '',
        id: ''
      },
      resFormRules: {
        description: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 50, message: '3-50字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 3, max: 50, message: '3-50字符', trigger: 'blur' }
        ],
        uris: [
          { required: true, message: '请输入角色路径', trigger: 'blur' },
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
      self.loadRolesByClientId(cId)
    },
    loadRolesByClientId(clientId) {
      const self = this
      self.listLoading = true
      const clientResourceUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRole/' + clientId + '/roles'
      requestUtil(clientResourceUrl, 'get', {}, {}).then(response => {
        console.log(response)
        self.roleList = response.result
        self.roleTempList = response.result
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
      self.resForm.name = ''
      self.resForm.description = ''
      self.resForm.title = '新建角色'
      self.resForm.dialogFormVisible = true
    },
    handleUpdateBtn(row) {
      const self = this
      console.log(row)
      self.resForm.title = '编辑角色'
      self.resForm.dialogFormVisible = true
      self.resForm.id = row.id
      self.resForm.name = row.name
      self.resForm.description = row.description
    },
    handleDelete(row) {
      const self = this
      this.$confirm('确定删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.deleteRole(row.name)
      }).catch(() => {
      })
    },
    deleteRole(roleCode) {
      const self = this
      const clientId = self.clientOpts.value
      const delResourceUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRole/' + clientId + '/deleteRole/' + roleCode
      requestUtil(delResourceUrl, 'delete', {}, {}).then(response => {
        console.log(response)
        Message({
          message: response.message,
          type: 'success',
          duration: 3 * 1000
        })
        self.loadRolesByClientId(clientId)
      })
    },
    handleSearchRole() {
      const self = this
      const searchText = self.role.keyText
      if (searchText === '') {
        self.roleList = self.roleTempList
        return
      }
      self.roleList = self.roleTempList.filter(data => {
        if (data.description) {
          return data.description.indexOf(searchText) > -1 || data.name.indexOf(searchText) > -1
        }
        return data.name.indexOf(searchText) > -1
      })
    },
    handleSubmit() {
      const self = this
      self.$refs['resForm'].validate((valid) => {
        if (valid) {
          const roleCode = self.resForm.name
          const roleName = self.resForm.description
          let method = 'put'
          let roleUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRole/' + self.clientOpts.value + '/updateRole'
          const params = { 'name': roleCode, 'description': roleName }
          if (!self.resForm.id) {
            const filterArry = self.roleTempList.filter(data => {
              if (data.displayName) {
                return data.displayName.indexOf(roleName) > -1
              }
              if (data.name) {
                return data.name.indexOf(roleCode) > -1
              }
            })
            if (filterArry.length > 0) {
              Message({
                message: '角色名称或编码重复!',
                type: 'error',
                duration: 3 * 1000
              })
              return
            }
            method = 'post'
            roleUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRole/' + self.clientOpts.value + '/createRole'
          }
          requestUtil(roleUrl, method, params, {}).then(response => {
            console.log(response)
            Message({
              message: response.message,
              type: 'success',
              duration: 3 * 1000
            })
            self.resForm.dialogFormVisible = false
            self.loadRolesByClientId(self.clientOpts.value)
          })
        }
      })
    }
  }
}
</script>
