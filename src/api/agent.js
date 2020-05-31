import axios from '@/libs/api.request'
// 获取代理商等级
export const getAgents = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/agent/query/agentList`,
    data,
    method: 'post'
  })
}
// 添加代理商等级
export const addAgents = (data) => {
  return axios.request({
    url: `api/agent/add`,
    data,
    method: 'post'
  })
}
// 编辑代理商等级
export const editAgent = (data) => {
  return axios.request({
    url: `api/agent/add`,
    data,
    method: 'post'
  })
}
// 删除代理商等级
export const deleteAgent = (data) => {
  return axios.request({
    url: `api/agent/delete/${data.id}`,
    method: 'get'
  })
}
// 查看代理商详情
export const detailAgent = (data) => {
  return axios.request({
    url: `api/agent/detail/${data.id}`,
    method: 'get'
  })
}
/**
 *  代理商账户
 */
// 获取代理商账户
export const getAgentAmounts = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/agentAmount/listPage`,
    data,
    method: 'post'
  })
}
// 代理商账户详情
export const detailAgentAmount = (data) => {
  return axios.request({
    url: `api/agentAmount/detail`,
    data,
    method: 'post'
  })
}
// 代理商账户审核
export const checkAgentAmount = (data) => {
  return axios.request({
    url: `api/agentAmount/check`,
    data,
    method: 'post'
  })
}
// 代理商账户冻结
export const freezeAgentAmount = (data) => {
  return axios.request({
    url: `api/agentAmount/freeze/${data.id}`,
    method: 'post'
  })
}
// 代理商账户解冻
export const activeAgentAmount = (data) => {
  return axios.request({
    url: `api/agentAmount/active/${data.id}`,
    method: 'post'
  })
}
// 充值列表
export const getAgentAmountsByCharge = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/agentRechargeRecord/listPage`,
    data,
    method: 'post'
  })
}
// 充值详情
export const detailAgentAmountByCharge = (data) => {
  return axios.request({
    url: `api/agentRechargeRecord/detail/${data.id}`,
    method: 'get'
  })
}
// 充值审核
export const checkAgentAmountByCharge = (data) => {
  return axios.request({
    url: `api/agentRechargeRecord/dcheckRecharge`,
    data,
    method: 'post'
  })
}
// 充值删除
export const deleteAgentAmountByCharge = (data) => {
  return axios.request({
    url: `api/agentRechargeRecord/remove/${data.id}`,
    data,
    method: 'get'
  })
}
// 提现列表
export const getAgentAmountsByWithdraw = (pages, queries) => {
  let data = { ...pages, ...queries }
  return axios.request({
    url: `api/agentAmountCashOut/listPage`,
    data,
    method: 'get'
  })
}
// 提现详情
export const detailAgentAmountByWithdraw = (data) => {
  return axios.request({
    url: `api/agentAmount/agentAmountCashOut/detail/${data.id}`,
    data,
    method: 'get'
  })
}
// 提现审核
export const checkAgentAmountByWithdraw = (data) => {
  return axios.request({
    url: `api/agentAmountCashOut/verifyCashOut/${data.id}`,
    data,
    method: 'get'
  })
}
