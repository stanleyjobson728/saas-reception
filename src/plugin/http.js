import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
axios.interceptors.request.use(config => { //请求拦截器

    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => { //响应拦截器
    return response;
}, error => {
    return Promise.resolve(error.response)
});

function changeSucceed(response) {
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        // 如果不需要除了data之外的数据，可以直接 return response.data
        return response
    }else{
        // 异常状态下，把错误信息返回去
        return {
            status: -404,
            msg: '网络异常',
            response: response
        }
    }
}

function changeError(error) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (error.status === -404) {
        Message({
            message: error.msg,
            type: 'error'
        })
    }
    if (error.data && (!error.data.message)) {
        Message({
            message: error.data.error_msg,
            type: 'error'
        })
    }
    return error
}

export default {
    post(url, data) {
        return axios({
            method: 'post',
            url,
            data: qs.stringify(data),
            timeout: 10000,
        }).then((response) => {
            return changeSucceed(response)
        }).catch((res) => {
            return changeError(res)
        })
    },
    get(url, params) {
        return axios({
            method: 'get',
            url,
            params, // get 请求时带的参数
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((response) => {
            return changeSucceed(response)
        }).catch((res) => {
            return changeError(res)
        })
    },
    postJson(url, data) {
        return axios({
            method: 'post',
            url,
            data: data,
            timeout: 10000,
        }).then((response) => {
            return changeSucceed(response)
        }).catch((res) => {
            return changeError(res)
        })
    },
}
