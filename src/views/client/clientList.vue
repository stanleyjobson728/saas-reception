<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="70" >
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="ID" >
        <template slot-scope="scope">
          {{ scope.row.cid }}
        </template>
      </el-table-column>
      <el-table-column label="客户端" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户端名称" align="center" >
        <template slot-scope="scope">
          {{ scope.row.clientName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled">
            已启用
          </span>
          <span v-else>
            已禁用
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.enabled" type="danger" size="mini" icon="el-icon-close" @click="handleEnabled(scope.row.cid,scope.row.clientId,false)" >禁用</el-button>
          <el-button v-else type="primary" style="background-color:green" size="mini" icon="el-icon-check" @click="handleEnabled(scope.row.cid,scope.row.clientId,true)" >启用</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      list: null,
      listLoading: true
    }
  },
  created() {
    this.loadClients()
  },
  methods: {
    loadClients() {
      const self = this
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/auth/clients/get'
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        console.log(response)
        self.listLoading = false
        self.list = response.result
      }).catch(() => { self.listLoading = false })
    },
    handleEnabled(cid, clientId, enabled) {
      const self = this
      if (!enabled) {
        this.$confirm('确定禁用该客户端吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.clientStatusHanlder(cid, clientId, enabled)
        }).catch(() => {
        })
      } else {
        self.clientStatusHanlder(cid, clientId, enabled)
      }
    },
    clientStatusHanlder(cid, clientId, enabled) {
      const self = this
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/auth/' + clientId + '/modifyEnabled'
      const myParams = { 'cid': cid, 'enabled': enabled }
      requestUtil(myUrl, 'post', myParams, {}).then(response => {
        Message({
          message: response.message,
          type: 'success',
          duration: 3 * 1000
        })
        self.loadClients()
      })
    },
    handleCreate() {
    },
    handleUpdate() {
    },
    handleModifyStatus() {
    }
  }
}
</script>
