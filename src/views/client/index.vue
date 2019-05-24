<template>
  <div class="tab-container">
    <el-form>
      <el-form-item label="客户端列表">
        <el-select v-model="clientUUID" placeholder="请先选择客户端">
          <el-option v-for="item in list" :key="item.cid" :label="item.clientId" :value="item.cid"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card">
      <el-tab-pane label="用户-角色管理">
        <userClientRoleMan :client-u-u-i-d="clientUUID" />
      </el-tab-pane>
      <el-tab-pane label="角色-资源管理">
        <clientRoleRes :client-u-u-i-d="clientUUID" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import userClientRoleMan from '@/views/client/userList'
import clientRoleRes from '@/views/client/clientRoleList'

import { requestUtil } from '@/api/user'

export default {
  name: 'Tab',
  components: { userClientRoleMan, clientRoleRes },
  data() {
    return {
      clientUUID: '',
      list: null
    }
  },
  created() {
    this.toSearchClient()
  },
  methods: {
    toSearchClient() {
      const myUrl = '/msas-auth-gateway/msas-microservice-usr/auth/clients/get'
      const myMethod = 'get'
      const myParams = {}
      const myHeaders = {}
      requestUtil(myUrl, myMethod, myParams, myHeaders).then(response => {
        var resultList = response.result
        this.list = resultList.filter(item => item.enableAuth ? item.enableAuth : false)
      })
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
