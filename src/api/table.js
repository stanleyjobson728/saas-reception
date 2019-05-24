import request from '@/utils/request'
import service2 from '@/utils/request2'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function requestUtil(url, method, params, headers) {
  return service2.request({
    url: url,
    method: method,
    params: params,
    headers: headers
  })
}
