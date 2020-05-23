import axios from '@/libs/api.request'

export const getNotices = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/notice/page`,
    data,
    method: 'get'
  })
}
export const addNotice = (data) => {
  return axios.request({
    url: `api/notice/add`,
    data,
    method: 'post'
  })
}
export const editNotice = (data) => {
  return axios.request({
    url: `api/notice/update`,
    data,
    method: 'post'
  })
}
export const deleteNotice = (data) => {
  return axios.request({
    url: `api/notice/del`,
    data,
    method: 'post'
  })
}

// 新手锦囊 ---------
export const getRookies = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/rookie/page`,
    data,
    method: 'get'
  })
}
export const addRookie = (data) => {
  return axios.request({
    url: `api/rookie/add`,
    data,
    method: 'post'
  })
}
export const editRookie = (data) => {
  return axios.request({
    url: `api/rookie/update`,
    data,
    method: 'post'
  })
}
export const deleteRookie = (data) => {
  return axios.request({
    url: `api/rookie/del`,
    data,
    method: 'post'
  })
}
