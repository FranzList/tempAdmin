import axios from '@/libs/api.request'

export const getOrders = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/order/page`,
    data,
    method: 'get'
  })
}
// 已发货
export const shippedOrder = (data) => {
  return axios.request({
    url: `api/order/shipped`,
    data,
    method: 'post'
  })
}
// 备货更改为发货中
export const shippingOrder = (data) => {
  return axios.request({
    url: `api/order/shipping`,
    data,
    method: 'post'
  })
}

// 成产订单
export const getProductions = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/proOrder/page`,
    data,
    method: 'get'
  })
}
// 成产订单详情
export const subListProduction = (data) => {
  return axios.request({
    url: `api/proOrder/subList`,
    data,
    method: 'post'
  })
}
