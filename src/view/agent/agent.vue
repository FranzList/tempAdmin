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
import { getAgents, detailAgent, addAgents, editAgent, deleteAgent } from '@/api/agent'
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
        { title: '平台补贴总金额', key: 'platformSubsidyAmount', align: 'center' },
        { title: '代理等级', key: 'level', align: 'center' },
        { title: '押金', key: 'deposit', align: 'center' },
        { title: '货款', key: 'goodsAmount', align: 'center' },
        { title: '每月补贴', key: 'monthlySubsidy', align: 'center' },
        { title: '上对下代理的提成率', key: 'commissionRate', align: 'center' },
        { title: '总金额', key: 'totalAmount', align: 'center' },
        { title: '操作',
          key: 'zz',
          align: 'center',
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
                    detailAgent({ id: params.row.id }).then(res => {
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
                  type: this.$config.colors.edit,
                  size: 'small'
                },
                style: {
                  'margin': '0 5px'
                },
                on: {
                  click () {
                    _self.formsVisible = true
                    _self.formsData = params.row
                    _self.formsTitle = '编辑'
                    _self.openType = 'edit'
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: this.$config.colors.delete,
                  size: 'small'
                },
                style: {

                },
                on: {
                  click () {
                    const config = {
                      title: '提示',
                      content: '确定删除吗？',
                      loading: true,
                      onOk: () => {
                        deleteAgent({ id: params.row.id }).then(res => {
                          _self.$Message.info(res.data.message)
                          _self.$Modal.remove()
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
      const res = await getAgents(pager, querys)
      this.tableData = this.filterData(res.data.data)
      console.log(this.tableData)
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
