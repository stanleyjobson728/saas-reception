import http from "../plugin/http"
export default{
    //获取应用列表
    getProgramList(param){
        return http.post('/program/search',param);
    },
    //添加应用
    addProgram(param){
        return http.post('/program/add',param);
    },
    // 修改应用
    updataProgram(param){
        return http.post('/program/update',param);
    },
    // 上传图片
    addImgFile(param){
        return http.postJson('common/fileUpload',param);
    },
    // 


}