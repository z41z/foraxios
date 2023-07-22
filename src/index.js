/**
 * 请求
 */
import axios from 'axios';
export default class {
  constructor(conf) {
    let { timeout = 10e3, headers, success = () => { }, error = () => { }, isShowConsole = true, request = () => { } } = conf
    // 创建axios实例
    const $api = axios.create({
      timeout // 请求超时时间
    });
    // request拦截器
    $api.interceptors.request.use(config => {
      let {
        method = 'get',
        data = {},
        type
      } = config
      request(config)
      let paramsName = /post|put|patch|delete/ig.test(method.toLowerCase()) ? 'data' : 'params';
      config[paramsName] = data;
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        ...config.headers,
        ...this.headers,
        ...headers
      }
      if (type === 'file') {
        config.responseType = 'blob'
      }
      return config;
    }, err => {
      error()
      Promise.reject(err);
    })
    // respone拦截器
    $api.interceptors.response.use(
      response => {
        let { mockData, name, type, data } = response.config
        const res = response.data;
        if (mockData !== undefined) {
          isShowConsole && console.log(`${name}已模拟数据:`, mockData)
          return mockData
        }
        if (type === 'file') {
          let fileName = JSON.parse(data).fileName
          let blob = new Blob([res])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName || `foraxios未设置文件名`
          link.click()
        }
        return Promise.resolve(success(res));
      },
      err => {
        let { config: { url = '', method = 'get', headers = {}, name = '', mockData, data, params }, response: { statusText } } = err;
        if (mockData !== undefined) {
          isShowConsole && console.log(`${name}已模拟数据:`, mockData)
          return mockData
        }
        else {
          let ERROR_CODE = {
            ECONNABORTED: '请求断开',
            ERR_NETWORK: '请求错误',
            ERR_BAD_REQUEST: '请求错误',
            "Not Found": '请求地址不存在'
          }
          let message = ERROR_CODE[statusText]
          data = data || params;
          let href = location.href;
          isShowConsole && console.log(`💔😭😱💔😭😱💔\n⚡name:${name}\n🎫message:${message}\n🌈href:${href}\n🌈url:${url}\n💬data:${JSON.stringify(data)}\n🐱‍👤method:${method}\n🤔headers:${JSON.stringify(headers)}`
          );
          return Promise.reject(error(message));
        }
      }
    )
    this.$api = $api
    return this
  }
}