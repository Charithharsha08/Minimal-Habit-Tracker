import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const api = axios.create({
  baseURL: "https://689f09413fed484cf878cf87.mockapi.io/api/v1",
  timeout: 10000
})

api.interceptors.request.use(async (config: any) => {
  // const token = await AsyncStorage.getItem("token")
  // config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(async (config: any) => {
  //
  return config
})

export default api
