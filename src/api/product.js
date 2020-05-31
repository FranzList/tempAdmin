import axios from '@/libs/api.request'

export const getProducts = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/product/page`,
    data,
    method: 'get'
  })
}
export const addProduct = (data) => {
  return axios.request({
    url: `api/product/add`,
    data,
    method: 'post'
  })
}
export const editProduct = (data) => {
  return axios.request({
    url: `api/product/update`,
    data,
    method: 'post'
  })
}

export const onProduct = (data) => {
  return axios.request({
    url: `api/product/on`,
    data,
    method: 'post'
  })
}
export const offProduct = (data) => {
  return axios.request({
    url: `api/product/off`,
    data,
    method: 'post'
  })
}
// 产品详情
export const detailProduct = (data) => {
  return axios.request({
    url: `api/product/detail`,
    data,
    method: 'post'
  })
}
// 分类
export const getCategories = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/category/list`,
    data,
    method: 'get'
  })
}
// 分类添加或更新
export const addCategory = (data) => {
  return axios.request({
    url: `api/category/add`,
    data,
    method: 'get'
  })
}
// 分类添加或更新
export const deleteCategory = (data) => {
  return axios.request({
    url: `api/category/remove/${data.id}`,
    method: 'get'
  })
}
/**
 * 抽奖商品
 */
// 获取抽奖商品
export const getLottos = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/raffleGoods/listPage`,
    data,
    method: 'get'
  })
}
// 添加抽奖商品
export const addLotto = (data) => {
  return axios.request({
    url: `api/raffleGoods/addRaffleGoods`,
    data,
    method: 'get'
  })
}
// 编辑抽奖商品
export const editLotto = (data) => {
  return axios.request({
    url: `api/raffleGoods/addRaffleGoods`,
    data,
    method: 'get'
  })
}
// 详情抽奖商品
export const detailLotto = (data) => {
  return axios.request({
    url: `api/raffleGoods/detail/${data.id}`,
    data,
    method: 'get'
  })
}

// 删除抽奖商品
export const deletelLotto = (data) => {
  return axios.request({
    url: `api/raffleGoods/removeId`,
    data,
    method: 'get'
  })
}
// 抽奖结果
export const getLottoResult = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/lotteryDrawResults/listPage`,
    data,
    method: 'get'
  })
}
