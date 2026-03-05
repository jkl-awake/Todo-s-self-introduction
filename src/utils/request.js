import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  // 基础 URL，优先从环境变量获取，否则默认为空（用于相对路径或反向代理）
  //baseURL: import.meta.env.VITE_API_BASE_URL || '', 
  baseURL:'http://localhost',
  // 请求超时时间
  timeout: 10000 
})

// 请求拦截器 (Request Interceptor)
// 类似于后端的 Middleware，在请求发送前统一处理
service.interceptors.request.use(
  config => {
    // 在这里可以统一添加请求头，例如 Token
    // config.headers['Authorization'] = 'Bearer ' + getToken()
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器 (Response Interceptor)
// 在收到响应后统一处理，例如解包数据、处理错误码
service.interceptors.response.use(
  response => {
    const res = response.data
    // 自动处理标准格式 { code, data, message }
    // 如果 code 存在且不为 200，视为业务错误
    if (res.code !== undefined && res.code !== 200) {
      console.error('Business Error:', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    // 这里可以统一弹出错误提示
    return Promise.reject(error)
  }
)

/**
 * 通用的 API 调用方法
 * @param {string} url - 接口地址 (例如 '/games')
 * @param {string} method - 请求方法 ('GET', 'POST', 'PUT', 'DELETE')
 * @param {object} [data] - 请求体数据 (POST/PUT 用) 或 查询参数 (GET 用)
 * @param {object} [config] - 其他 axios 配置 (headers 等)
 * @param {Function} [adapter] - 可选：自定义数据转换函数
 */
export function callApi(url, method = 'GET', data = {}, config = {}, adapter = null) {
  const options = {
    url,
    method,
    ...config
  }

  // 根据请求方法自动区分 params (Query String) 和 data (Body)
  if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
    options.params = data
  } else {
    options.data = data
  }

  return service(options).then(res => {
    // 如果提供了 adapter，则使用 adapter 转换数据
    // 否则直接返回 res (此时 res 已经是 response.data，经过了拦截器处理)
    return adapter ? adapter(res) : res
  })
}

export default service
