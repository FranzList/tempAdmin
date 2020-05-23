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
