<template>
  <div>
    <Card>
      <tables
      ref="tables"
      v-model="tableData"
      :columns="columns"
      pageable
      searchable
      search-place="top"
      :pageTotal="pageTotal"
      @on-pageChane="onPageChange"
      :searchColumns="searchColumns"
      @on-search="onSearch"
      @on-add="onAdd"
      addable
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
import { getAgentAmounts, detailAgentAmount, checkAgentAmount, freezeAgentAmount, activeAgentAmount } from '@/api/agent'
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
        { title: '手机号', key: 'phone', align: 'center' },
        { title: '周期押金', key: 'deposit', align: 'center' },
        { title: '周期货款', key: 'goodsAmount', align: 'center' },
        { title: '每月返还金额', key: 'monthlySubsidy', align: 'center' },
        { title: '代理等级', key: 'agentLevel', align: 'center' },
        // { title: '平台补贴总金额', key: 'platformSubsidyAmount', align: 'center' },
        { title: '账户可用余额', key: 'usableAmount', align: 'center' },
        // { title: '历史总额', key: 'total', align: 'center' },
        // { title: '货款周期是否激活状态', key: 'buyMoneyReturnStatus', align: 'center' },
        // { title: '平台返还周期是否激活状态', key: 'platformReturnStatus', align: 'center' },
        // { title: '账户是否冻结', key: 'freezed', align: 'center' },
        // { title: '提现中的金额', key: 'currentCashOutAmount', align: 'center' },
        // { title: '用户充值的总货款', key: 'totalGoodsAmount', align: 'center' },
        // { title: '状态', key: 'status', align: 'center' },
        // { title: '是否是代理商账户', key: 'agentType', align: 'center' },
        // { title: '冻结账户余额', key: 'freezeAmount', align: 'center' },
        { title: '操作',
          key: 'zz',
          align: 'center',
          width: '300',
          render: (h, params) => {
            return h('div', [

              h('Button', {
                props: {
                  type: this.$config.colors.view,
                  size: 'small'
                },
                style: {
                },
                on: {
                  click () {
                    detailAgentAmount({ phone: params.row.phone, userId: params.row.userId }).then(res => {
                      console.log('detail', res)
                      _self.formsData = res.data.data
                      _self.formsVisible = true
                      _self.formsTitle = '查看'
                      _self.openType = 'view'
                    })
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: params.row.freezed ? this.$config.colors.other1 : this.$config.colors.add,
                  size: 'small'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click () {
                    // 冻结
                    const modalText = params.row.freezed ? '解冻' : '冻结'
                    const config = {
                      title: '提示',
                      content: `确定${modalText}账户吗?`,
                      loading: true,
                      onOk: () => {
                        if (params.row.freezed) {
                          activeAgentAmount({ id: params.row.id }).then(res => {
                            _self.$Modal.remove()
                            _self.$Message.info(res.data.message)
                            _self.getTableData(_self.pageParams, _self.queryParams)
                          })
                        } else {
                          freezeAgentAmount({ id: params.row.id }).then(res => {
                            _self.$Modal.remove()
                            _self.$Message.info(res.data.message)
                            _self.getTableData(_self.pageParams, _self.queryParams)
                          })
                        }
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
              }, params.row.freezed ? '解冻' : '冻结'),
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
                        checkAgentAmount({ id: params.row.id, status: 2 }).then(res => {
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
                        checkAgentAmount({ id: params.row.id, status: 3 }).then(res => {
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
              }, '审核不通过')
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
        { label: '手机号', key: 'phone', align: 'center' },
        { label: '周期押金', key: 'deposit', align: 'center' },
        { label: '周期货款', key: 'goodsAmount', align: 'center' },
        { label: '每月返还金额', key: 'monthlySubsidy', align: 'center' },
        { label: '代理等级', key: 'agentLevel', align: 'center' },
        { label: '平台补贴总金额', key: 'platformSubsidyAmount', align: 'center' },
        { label: '账户可用余额', key: 'usableAmount', align: 'center' },
        { label: '历史总额', key: 'total', align: 'center' },
        // { label: '货款周期是否激活状态', key: 'buyMoneyReturnStatus', align: 'center' },
        // { label: '平台返还周期是否激活状态', key: 'platformReturnStatus', align: 'center' },
        // { label: '账户是否冻结', key: 'freezed', align: 'center' },
        { label: '提现中的金额', key: 'currentCashOutAmount', align: 'center' },
        { label: '用户充值的总货款', key: 'totalGoodsAmount', align: 'center' },
        // { label: '状态', key: 'status', align: 'center' },
        // { label: '是否是代理商账户', key: 'agentType', align: 'center' },
        { label: '冻结账户余额', key: 'freezeAmount', align: 'center' }
        // { label: '平台补贴总金额', key: 'platformSubsidyAmount' },
        // { label: '代理等级', key: 'level' },
        // { label: '押金', key: 'deposit' },
        // { label: '货款', key: 'goodsAmount' },
        // { label: '每月补贴', key: 'monthlySubsidy' },
        // { label: '上对下代理的提成率', key: 'commissionRate' }
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
      const res = await getAgentAmounts(pager, querys)
      console.log(res)
      this.tableData = this.filterData(res.data.data.records)
      this.pageTotal = Number(res.data.data.total)
    },
    filterData (data) {
      data.forEach(item => {
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
        this.$Message.info(res.data.message)
        this.getTableData(this.pageParams, this.queryParams)
        this.formsVisible = false
      }
      if (this.formsTitle.includes('添加')) {
        const res = await addAgents(data)
        this.$Message.info(res.data.message)
        this.getTableData(this.pageParams, this.queryParams)
        this.formsVisible = false
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
