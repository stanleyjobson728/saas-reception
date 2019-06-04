<template>
    <div class="header-moduel">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>应用管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown class="username" trigger="click">
            <el-button type="primary">
                你是谁<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" align="center">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
    name: 'header-moduel',
    data () {
        return {
            
        }
    }
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
