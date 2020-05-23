<template>
  <div>
    <Card>
      <tables
      ref="tables"
      search-place="top"
      v-model="tableData"
      :columns="columns"
      pageable
      :pageTotal="pageTotal"
      @on-pageChane="onPageChange"
      searchable
      searchPlace="top"
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
import { getBills, dontCheck, checkBill2 } from '@/api/bill'
export default {
  name: 'product',
  components: {
    Tables,
    Forms
  },
  data () {
    let _self = this
    return {
      columns: [
        { title: '订单编号', key: 'orderNo', align: 'center' },
        { title: '用户名', key: 'username', align: 'center' },
        { title: '手机号', key: 'phone', align: 'center' },
        { title: '提现方式', key: 'chargeType', align: 'center' },
        { title: '提现金额', key: 'money', align: 'center' },
        { title: '操作',
          key: 'zz',
          align: 'center',
          render: (h, params) => {
            const { status } = params.row
            const statusText = ['', '通过', '不通过']
            const statusColors = ['#000', '#19be6b', '#ed4014']
            return h('div', [

              h('Button', {
                props: {
                  type: this.$config.colors.other1,
                  size: 'small'
                },
                style: {
                  'display': status === 0 ? '' : 'none'
                },
                on: {
                  click () {
                    const config = {
                      title: '提示',
                      content: '确定审核通过吗？',
                      loading: true,
                      onOk: () => {
                        checkBill2({ id: params.row.id }).then(res => {
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
              }, '通过'),
              h('Button', {
                props: {
                  type: this.$config.colors.delete,
                  size: 'small'
                },
                style: {
                  'margin-left': '5px',
                  'display': status === 0 ? '' : 'none'
                },
                on: {
                  click () {
                    const config = {
                      title: '提示',
                      content: '确定审核不通过吗？',
                      loading: true,
                      onOk: () => {
                        dontCheck({ id: params.row.id }).then(res => {
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
              }, '不通过'),
              h('span', {
                props: {
                  type: this.$config.colors.delete,
                  size: 'small'
                },
                style: {
                  'display': status !== 0 ? '' : 'none',
                  'color': statusColors[status]
                }
              }, statusText[status])

            ])
          }
        }
      ],
      tableData: [],
      //  分页
      pageParams: {
        current: 1,
        size: 10,
        type: 2
      },
      //   分页总数
      pageTotal: 0,
      // 搜索
      queryParams: {},
      searchColumns: [
        { label: '订单编号', key: 'orderNo' }
      ],
      // 动态表单数据
      formsTitle: '',
      formsData: {},
      formsVisible: false,
      formsColumns: [
        { label: '商品名称', key: 'proName' },
        { label: '返利天数', key: 'proDays' },
        { label: '商品价格', key: 'proPrice' },
        { label: '商品返利', key: 'proProfit' },
        { label: '已售数量', key: 'proSum' },
        { label: '产品类型',
          key: 'proType',
          type: 'select',
          selectData: [
            { label: '热销', value: 1 },
            { label: '爆款', value: 2 },
            { label: '抢单', value: 3 }
          ]
        }
        // { label: '创建时间', key: 'createTime' },
        // { label: '商品图片', key: 'image', type: 'upload', maxNum: 1 },
        // { label: '详情图片', key: 'intro', type: 'upload', maxNum: 1 }

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
      const res = await getBills(pager, querys)
      this.tableData = this.filterData(res.data.data.records)
      this.pageTotal = Number(res.data.data.total)
    },
    filterData (data) {
      const methodsType = ['', '支付宝', '银行卡']
      data.forEach(item => {
        item.chargeType = methodsType[item.method]
      })
      return data
    },
    // 表单提交
    onFormsSubmit (event) {
      console.log(event)
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
