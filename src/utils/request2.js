import axios from 'axios'
import { Message } from 'element-ui'
// 创建axios实例
axios.defaults.withCredentials = true
const service2 = axios.create({
  timeout: 60000 // 请求超时时间
})
// request拦截器
service2.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('access_token')
    if (token) {
      // 让每个请求携带OAuth 2 token
      const auth = 'Bearer ' + token
      config.headers['Authorization'] = auth
    } else {
      // 刷新当前页面触发认证
      location.reload()
    }
    return config
  },
  error => {
    console.error(error) // for debug
    Promise.reject(error)
  }
)
// response 拦截器
service2.interceptors.response.use(
  response => {
    /**
     * response.data = {code:200, message:'ok', result:{}/[]}
     * if code != 200 then show message
     * else return the response data
     */
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    const status = error.response.status
    switch (status) {
      case 403 :
        Message({
          message: '您没有权限访问该资源',
          type: 'error',
          duration: 5 * 1000 // 提示信息在页面持续5秒
        })
        break
      default :
        var msg = error.response.data ? error.response.data.message : error.message
        Message({
          message: msg,
          type: 'error',
          duration: 5 * 1000
        })
    }
    return Promise.reject('error')
  }
)

export default service2
