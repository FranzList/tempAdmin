import axios from '@/libs/api.request'

export const getPlatformOptions = () => {
  return axios.request({
    url: `api/platformConfig/detail`,
    method: 'get'
  })
}
export const editPlatformOptions = (data) => {
  return axios.request({
    url: `api/platformConfig/add`,
    data,
    method: 'post'
  })
}
