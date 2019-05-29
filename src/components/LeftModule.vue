<template>
    <div class="left-module">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <el-menu text-color="#fff" background-color="#545c64" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">           
            <router-link to="/index">
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
            </router-link>
            <router-link :to="{path:'/index/program'}">
                <el-menu-item index="2">
                    <i class="el-icon-setting"></i>
                    <span slot="title">应用管理</span>
                </el-menu-item>
            </router-link>
        </el-menu>
    </div>
</template>
<script>
export default {
    name:'left-module',
    data() {
        return {
            isCollapse: false
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
    
}
</script>
<style lang="scss" scoped>
.left-module{
    background: #545c64;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        height: 100%;
        a{
            display: block;
            width: 100%;
        }
    }
}
</style>

