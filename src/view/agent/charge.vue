<template>
  <div>
    <Card>
      <tables
      ref="tables"
      v-model="tableData"
      :columns="columns"
      pageable
      :pageTotal="pageTotal"
      @on-pageChane="onPageChange"
      :searchColumns="searchColumns"
      @on-search="onSearch"
      @on-add="onAdd"
      ></tables>
    </Card>
    <forms
    :formsTitle="formsTitle"
    :formsData.sync="formsData"
    :formsVisible="formsVisible"
    :formsColumns="formsColumns"
    @on-formsSubmit="onFormsSubmit"
    @on-formsCancel="onFormsCancel"
    :openType="openType"
    ></forms>
  </div>
</template>

<script>
import Tables from '_c/tables'
import Forms from '_c/forms'
import { getAgentAmountsByCharge, detailAgentAmountByCharge, checkAgentAmountByCharge, deleteAgentAmountByCharge } from '@/api/agent'
import { isNullObject } from '@/libs/tools'
export default {
  name: 'agent',
  components: {
    Tables,
    Forms
  },
  data () {
    let _self = this
    return {
      columns: [
        { title: '充值金额', key: 'amount', align: 'center' },
        // { title: '操作人', key: 'operator', align: 'center' },
        { title: '充值等级', key: 'rechargeLevel', align: 'center' },
        { title: '充值时间', key: 'rechargeTime', align: 'center' },
        { title: '充值类型', key: 'chargeTypes', align: 'center' },
        { title: '操作',
          key: 'zz',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: this.$config.colors.edit,
                  size: 'small',
                  ghost: params.row.status === 2
                },
                style: {
                  'display': params.row.status === 3 ? 'none' : '',
                  'margin-left': '5px'
                },
                on: {
                  click () {
                    if (params.row.status === 2) return
                    const config = {
                      title: '提示',
                      content: '确定通过审核吗？',
                      loading: true,
                      onOk: () => {
                        checkAgentAmountByCharge({ id: params.row.id, status: 2 }).then(res => {
                          _self.$Modal.remove()
                          _self.$Message.info(res.data.message)
                          _self.getTableData(_self.pageParams, _self.queryParams)
                        })
                      },
                      onCancel: () => {
                        console.log('cacel')
                      }
                    }
                    _self.$Modal.confirm(config)
                  }
                }
              }, '审核通过'),
              h('Button', {
                props: {
                  type: this.$config.colors.delete,
                  size: 'small',
                  ghost: params.row.status === 3
                },
                style: {
                  'display': params.row.status === 2 ? 'none' : '',
                  'margin-left': '5px'
                },
                on: {
                  click () {
                    if (params.row.status === 3) return
                    const config = {
                      title: '提示',
                      content: '确定不通过审核吗？',
                      loading: true,
                      onOk: () => {
                        checkAgentAmountByCharge({ id: params.row.id, status: 3 }).then(res => {
                          _self.$Modal.remove()
                          _self.$Message.info(res.data.message)
                          _self.getTableData(_self.pageParams, _self.queryParams)
                        })
                      },
                      onCancel: () => {
                        console.log('cacel')
                      }
                    }
                    _self.$Modal.confirm(config)
                  }
                }
              }, '审核不通过'),
              h('Button', {
                props: {
                  type: this.$config.colors.delete,
                  size: 'small'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click () {
                    // 冻结
                    const modalText = '删除'
                    const config = {
                      title: '提示',
                      content: `确定${modalText}账户吗?`,
                      loading: true,
                      onOk: () => {
                        deleteAgentAmountByCharge({ id: params.row.id }).then(res => {
                          _self.$Modal.remove()
                          _self.$Message.info(res.data.message)
                          _self.getTableData(_self.pageParams, _self.queryParams)
                        })
                      },
                      onCancel: () => {
                        console.log('cacel')
                      }
                    }
                    _self.$Modal.confirm(config)
                    // freezed
                    // _self.formsVisible = true
                    // _self.formsData = params.row
                    // _self.formsTitle = '编辑'
                    // _self.openType = 'edit'
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: [],
      //  分页
      pageParams: {
        current: 1,
        size: 10
      },
      //   分页总数
      pageTotal: 0,
      // 搜索
      queryParams: {},
      searchColumns: [
        // { label: '商品名称', key: 'name' },
        // { label: '商品名称',
        //   key: 'type',
        //   type: 'select',
        //   selectData: [
        //     { label: '普通商品', value: 1 },
        //     { label: '计划商品', value: 2 },
        //     { label: '抽奖商品', value: 3 }
        //   ] }
      ],
      // 动态表单数据
      formsTitle: '',
      formsData: {},
      formsVisible: false,

      formsColumns: [
        { label: '充值金额', key: 'amount' },
        { label: '操作人', key: 'operator' },
        { label: '充值等级', key: 'rechargeLevel' },
        { label: '充值时间', key: 'rechargeTime' },
        { label: '充值类型',
          key: 'rechargeType',
          type: 'select',
          selectData: [
            { label: '网银', value: 1 },
            { label: '支付宝', value: 2 },
            { label: '其他', value: 3 }
          ] }
      ],
      openType: 'view'
    }
  },
  methods: {
    onAdd () {
      this.formsVisible = true
      this.openType = 'add'
      this.formsTitle = '添加'
    },
    onPageChange (event) {
      this.pageParams.current = event
      this.getTableData(this.pageParams, this.queryParams)
    },
    onSearch (event) {
      this.queryParams = event
      this.pageParams.current = 1
      this.getTableData(this.pageParams, this.queryParams)
    },
    handleDelete (params) {
      console.log(params)
    },
    async getTableData (pager, querys) {
      const res = await getAgentAmountsByCharge(pager, querys)
      console.log(res)
      this.tableData = this.filterData(res.data.data.records)
      this.pageTotal = Number(res.data.data.total)
    },
    filterData (data) {
      const chargeTypes = ['', '网银', '支付宝', '其他']
      data.forEach(item => {
        item.chargeTypes = chargeTypes[item.rechargeType]
      })
      return data
    },
    formValidate () {
    },
    // 表单提交
    async onFormsSubmit (event) {
      let data = {}
      let validateInfo = {
        platformSubsidyAmount: '平台补贴总金额',
        level: '代理等级',
        deposit: '押金',
        goodsAmount: '货款',
        monthlySubsidy: '每月补贴',
        commissionRate: '上对下代理的提成率'
      }
      let validateArr = []
      Object.keys(validateInfo).forEach(key => {
        data[key] = event[key]
        validateArr.push(key)
      })
      let message = ''
      Object.keys(data).forEach(key => {
        if (!data[key]) {
          message = validateInfo[key]
        }
      })
      const isNull = isNullObject(data, validateArr)
      if (!isNull) {
        this.$Message.error(message)
        return
      }
      // deletePropertyFromObject(event,)
      if (this.formsTitle.includes('编辑')) {
        data.id = event.id
        const res = await editAgent(data)
        if (res.data.success) {
          this.$Message.info(res.data.message)
          this.getTableData(this.pageParams, this.queryParams)
          this.formsVisible = false
        } else {
          this.$Message.error(res.data.message)
        }
      }
      if (this.formsTitle.includes('添加')) {
        const res = await addAgents(data)
        if (res.data.success) {
          this.$Message.info(res.data.message)
          this.getTableData(this.pageParams, this.queryParams)
          this.formsVisible = false
        } else {
          this.$Message.error(res.data.message)
        }
      }
    },
    onFormsCancel () {
      this.formsVisible = false
    }
  },
  mounted () {
    this.getTableData(this.pageParams, this.queryParams)
  }
}
</script>

<style>

</style>
