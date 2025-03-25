import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'

// 后端给基地址
const baseURL = 'http://localhost:3000'

const instance = axios.create({
  // 基础地址，超时时间
  baseURL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带token
    const userStore = useUserStore()
    if (userStore.token){
        config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
      if (res.data.code === 0) {
          return res
        }
        // 处理业务失败,提示错误，抛出错误
        ElMessage.error(res.data.message || '服务异常，请稍后再试')
        return Promise.reject(res.data)

        // 摘取核心响应数据
    },
  (err) => {
    // 401错误 token失效 => 重新登录 
    if (err.response?.status === 401) {
        router.push('/login')
    }   

    // 错误的默认情况
    ElMessage.error(err.response?.response?.msg || '出错了，请重试，我懒得写错误信息了。。。')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }