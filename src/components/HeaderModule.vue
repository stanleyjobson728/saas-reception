<template>
    <div class="header-moduel">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>应用管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown class="username">
            <el-button type="primary">
                {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
<!--            <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item>黄金糕</el-dropdown-item>-->
<!--                <el-dropdown-item>狮子头</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>我的消息</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided
                                  @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import kc from '@/plugin/keycloak-config.js'

export default {
    name: 'header-moduel',
    data () {
        return {
            username: sessionStorage.getItem('username'),
            isCollapse: false
        }
    },
    methods: {
        toggleSideBar() {
            this.isCollapse = !this.isCollapse
        },
        logout: function () {
            this.$confirm('确认退出?', '提示', {})
                .then(() => {
                    sessionStorage.removeItem('access_token')
                    window.location.href = kc.createLogoutUrl()
                })
                .catch(() => { });
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
    },
    mounted: function () {
        let user = sessionStorage.getItem('user');
        if (user) {
            this.username = user;
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.header-moduel{
    height: 50px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    line-height: 50px;
    padding: 0 20px;
    .el-breadcrumb{
        display: inline-block;
    }
    .username{
        height: 100%;
        float: right;
    }
}
</style>
