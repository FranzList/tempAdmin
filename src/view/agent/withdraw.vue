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
import { getAgentAmountsByWithdraw, detailAgentAmountByWithdraw, checkAgentAmountByWithdraw } from '@/api/agent'
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
        { title: '用户名', key: 'userName', align: 'center' },
        { title: '电话', key: 'phone', align: 'center' },
        { title: '操作人', key: 'operator', align: 'center' },
        { title: '提现金额', key: 'cashAmount', align: 'center' },
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
                        checkAgentAmountByWithdraw({ id: params.row.id, status: 2 }).then(res => {
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
                        checkAgentAmountByWithdraw({ id: params.row.id, status: 3 }).then(res => {
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
        { label: '平台补贴总金额', key: 'platformSubsidyAmount' },
        { label: '代理等级', key: 'level' },
        { label: '押金', key: 'deposit' },
        { label: '货款', key: 'goodsAmount' },
        { label: '每月补贴', key: 'monthlySubsidy' },
        { label: '上对下代理的提成率', key: 'commissionRate' }
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
      const res = await getAgentAmountsByWithdraw(pager, querys)
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
