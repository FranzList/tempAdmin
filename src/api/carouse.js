import axios from '@/libs/api.request'

export const getCarouses = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/carouse/list`,
    data,
    method: 'get'
  })
}
export const editCarouses = (data) => {
  return axios.request({
    url: `api/carouse/update`,
    data,
    method: 'post'
  })
}
