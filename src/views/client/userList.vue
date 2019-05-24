<template>
  <div class="app-container">
    <el-form :inline="true" @submit.native.prevent>
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
          <el-button :disabled="scope.row.enabled === false" type="text" @click="toBindRole(scope.row.id)">关联角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="关联角色" width="650px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="角色列表">
          <el-transfer
            v-model="myTgt"
            :data="mySrc"
            :titles="['未关联', '已关联']"
            :filter-method="transferFilterMethod"
            filterable
            filter-placeholder="请输入角色名"
            @change="updateRole"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestUtil } from '@/api/user'
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
  props: {
    clientUUID: {
      type: String,
      default: '23a2a430-bac5-49c9-a2d1-11070a69ec5e'
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      username: '',
      dialogFormVisible: false,
      // clientUUID: '23a2a430-bac5-49c9-a2d1-11070a69ec5e',
      curUserUUID: '',
      mySrc: [],
      myTgt: [],
      roleMap: {}
    }
  },
  created() {

  },
  methods: {
    transferFilterMethod(key, item) {
      return (item.label.indexOf(key) > -1) // 模糊查询角色名
    },
    toSearchAllRole(clientUUID) {
      this.mySrc = []
      this.roleMap = {}
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRole/' + clientUUID + '/roles'
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        var arr = response.result
        for (let i = 0; i < arr.length; i++) {
          var item = arr[i]
          this.mySrc.push({
            key: item.id,
            label: item.name
          })
          this.roleMap[item.id] = item.name
        }
      })
    },
    toSearchEffective(userUUID, clientUUID) {
      this.myTgt = []
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/kcUserClientRole/' + userUUID + '/' + clientUUID + '/composite'
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        var arr = response.result
        for (let i = 0; i < arr.length; i++) {
          var item = arr[i]
          this.myTgt.push(item.id)
        }
      })
    },
    updateRole(curVal, direction, keyArr) {
      var arrResult = [] // 由于服务端要求 id name 为必传字段且对应准确 所以要重新构造请求数据
      var arr = keyArr // keyArr 发生移动的数据 key 数组
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (item in this.roleMap) {
          arrResult.push({ 'id': item, 'name': this.roleMap[item] })
        }
      }
      var myData = JSON.stringify(arrResult)
      // 只有对话框处于打开状态且当前userUUID不为空的时候才提交请求
      if (this.dialogFormVisible && this.curUserUUID) {
        var myUrl = ''
        var myMethod = ''
        var myParams = {}
        var myHeaders = { 'Content-Type': 'application/json' }
        if (direction === 'right') { // 执行添加操作
          myUrl = '/msas-auth-gateway/msas-microservice-usr/kcUserClientRole/' + this.curUserUUID + '/' + this.clientUUID + '/add'
          myMethod = 'post'
          service2.request({
            url: myUrl,
            method: myMethod,
            params: myParams,
            headers: myHeaders,
            data: myData
          }).then(response => {
            this.$message('用户[' + this.curUserUUID + ']角色添加成功' + response.message)
          })
        } else if (direction === 'left') { // 执行删除操作
          myUrl = '/msas-auth-gateway/msas-microservice-usr/kcUserClientRole/' + this.curUserUUID + '/' + this.clientUUID + '/remove'
          myMethod = 'delete'
          service2.request({
            url: myUrl,
            method: myMethod,
            params: myParams,
            headers: myHeaders,
            data: myData
          }).then(response => {
            this.$message('用户[' + this.curUserUUID + ']角色删除成功' + response.message)
          })
        }
      }
    },
    toBindRole(userUUID) {
      if (!this.clientUUID) {
        this.$message({
          message: '请先选择客户端',
          type: 'warning'
        })
        return
      }
      this.toSearchAllRole(this.clientUUID)
      this.toSearchEffective(userUUID, this.clientUUID)
      this.dialogFormVisible = true
      this.curUserUUID = userUUID
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
