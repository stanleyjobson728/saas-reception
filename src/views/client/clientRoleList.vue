<template>
  <div class="app-container">
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="roleName" placeholder="请输入角色名,按Enter搜索,支持模糊搜索" style="width:300px" @keyup.enter.native="toSearch2"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch2()"><i class="el-icon-search" />&nbsp;&nbsp;搜索</el-button>
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
      <el-table-column label="角色名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toBindRole(scope.row.id)">关联资源</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="关联资源" width="650px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="资源列表">
          <el-transfer
            v-model="myTgt"
            :data="mySrc"
            :titles="['未关联', '已关联']"
            :filter-method="transferFilterMethod"
            filterable
            filter-placeholder="请输入资源名"
            @change="updateResource" >
            <span slot-scope="{ option }" :title="option.label" >{{ option.label }}</span>
          </el-transfer>
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
      dialogFormVisible: false,
      // clientUUID: '23a2a430-bac5-49c9-a2d1-11070a69ec5e',
      curRoleUUID: '',
      mySrc: [],
      myTgt: [],
      roleName: '',
      roleList: null
    }
  },
  watch: {
    clientUUID: function(newVal) {
      this.roleName = ''
      this.toSearch()
    }
  },
  created() {

  },
  methods: {
    transferFilterMethod(key, item) {
      return (item.label.indexOf(key) > -1) // 模糊查询资源名
    },
    toSearch2() {
      var tmpList = this.list ? this.list : []
      if (this.roleName) {
        this.list = tmpList.filter(item => item.name.indexOf(this.roleName) > -1) // 模糊查询角色名
      } else {
        this.list = this.roleList
      }
    },
    toSearchAllResource(clientUUID) {
      this.mySrc = []
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRoleRes/' + clientUUID + '/resources'
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        var arr = response.result
        for (let i = 0; i < arr.length; i++) {
          var item = arr[i]
          this.mySrc.push({
            key: item._id,
            label: item.displayName ? item.displayName : item.name
          })
        }
      })
    },
    toSearchEffective(roleUUID, clientUUID) {
      this.myTgt = []
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRoleRes/' + clientUUID + '/roles/' + roleUUID + '/resources'
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        var arr = response.result
        for (let i = 0; i < arr.length; i++) {
          var item = arr[i]
          this.myTgt.push(item._id)
        }
      })
    },
    updateResource(curVal, direction, keyArr) {
      var arrResult = [] // 由于服务端要求 _id 为必传字段 所以要重新构造请求数据
      var arr = keyArr // keyArr 发生移动的数据 key 数组
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        arrResult.push({ '_id': item })
      }
      var myData = JSON.stringify(arrResult)
      // 只有对话框处于打开状态且当前userUUID不为空的时候才提交请求
      if (this.dialogFormVisible && this.curRoleUUID) {
        var myUrl = ''
        var myMethod = ''
        var myParams = {}
        var myHeaders = { 'Content-Type': 'application/json' }
        if (direction === 'right') { // 执行添加操作
          myUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRoleRes/' + this.clientUUID + '/roles/' + this.curRoleUUID + '/resources/add'
          myMethod = 'post'
          service2.request({
            url: myUrl,
            method: myMethod,
            params: myParams,
            headers: myHeaders,
            data: myData
          }).then(response => {
            this.$message('角色[' + this.curRoleUUID + ']资源添加成功' + response.message)
          })
        } else if (direction === 'left') { // 执行删除操作
          myUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRoleRes/' + this.clientUUID + '/roles/' + this.curRoleUUID + '/resources/remove'
          myMethod = 'delete'
          service2.request({
            url: myUrl,
            method: myMethod,
            params: myParams,
            headers: myHeaders,
            data: myData
          }).then(response => {
            this.$message('角色[' + this.curRoleUUID + ']资源删除成功' + response.message)
          })
        }
      }
    },
    toBindRole(roleUUID) {
      if (!this.clientUUID) {
        this.$message({
          message: '请先选择客户端',
          type: 'warning'
        })
        return
      }
      this.toSearchAllResource(this.clientUUID)
      this.toSearchEffective(roleUUID, this.clientUUID)
      this.dialogFormVisible = true
      this.curRoleUUID = roleUUID
    },
    toSearch() {
      if (!this.clientUUID) {
        this.$message({
          message: '请先选择客户端',
          type: 'warning'
        })
        return
      }
      this.listLoading = true
      const cid = this.clientUUID ? '/' + this.clientUUID : ''
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/kcClientRole/' + cid + '/roles'
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        this.list = response.result
        this.listLoading = false
        this.roleList = this.list ? this.list.slice() : null
      }).catch((e) => {
        this.list = null
        this.listLoading = false
        this.roleList = null
      })
    }
  }
}
</script>
