import axios from '@/libs/api.request'

export const getBills = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/bill/page`,
    data,
    method: 'get'
  })
}
// 审核不通过
export const dontCheck = (data) => {
  return axios.request({
    url: `api/bill/dontCheck`,
    data,
    method: 'post'
  })
}
// 充值
export const checkBill1 = (data) => {
  return axios.request({
    url: `api/bill/check1`,
    data,
    method: 'post'
  })
}
// 提现
export const checkBill2 = (data) => {
  return axios.request({
    url: `api/bill/check2`,
    data,
    method: 'post'
  })
}
