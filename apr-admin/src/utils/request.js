import axios from "axios"

// 创建实例
const AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
})


export default AxiosInstance