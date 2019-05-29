<template>
    <div class="index">
        <el-container>
            <left-module></left-module>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
    
</template>
<script>
import Vue from 'vue'
import LeftModule from '@/components/LeftModule.vue'
export default {
    name: "index",
    data () {
        return {
            
        }
    },
    mounted() {
        
    },
    components:{
        LeftModule
    },
}
</script>
<style scoped lang="scss">
.index,.el-container{
    height: 100%;
    .el-main{
        padding: 0; 
    }
}
</style>