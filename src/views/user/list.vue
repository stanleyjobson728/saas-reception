<template>
  <div class="app-container">
    <el-form :inline="true" label-width="120px" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="username" placeholder="请输入用户名,按Enter搜索,支持模糊搜索" style="width:300px" @keyup.enter.native="toSearch"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch()"><i class="el-icon-search" />&nbsp;&nbsp;搜索</el-button>
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
      <el-table-column label="用户名/邮箱">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="工号">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="姓" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.firstName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
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
  </div>
</template>

<script>
import { requestUtil } from '@/api/user'

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
      list: null,
      listLoading: false,
      username: ''
    }
  },
  created() {
    // this.toSearch()
  },
  methods: {
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
        this.toSearch()
      })
    },
    toSearch() {
      this.listLoading = true
      const username = this.username ? '/' + this.username : ''
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/kcUser/users' + username
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        this.list = response.result
        this.listLoading = false
      }).catch((e) => {
        this.list = null
        this.listLoading = false
      })
    }
  }
}
</script>
