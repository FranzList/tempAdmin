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
import { getOrders, shippingOrder } from '@/api/order'
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
        { title: '订单金额', key: 'orderMoney', align: 'center' },
        { title: '创建时间', key: 'createTime', align: 'center' },
        { title: '操作',
          key: 'zz',
          align: 'center',
          render: (h, params) => {
            return h('div', [

              h('Button', {
                props: {
                  type: this.$config.colors.other1,
                  size: 'small'
                },
                style: {

                },
                on: {
                  click () {
                    const config = {
                      title: '提示',
                      content: '确定要发货吗？',
                      loading: true,
                      onOk: () => {
                        shippingOrder({ id: params.row.id }).then(res => {
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
              }, '发货'),
              h('Button', {
                props: {
                  type: this.$config.colors.view,
                  size: 'small'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click () {
                    _self.formsTitle = '查看'
                    _self.openType = 'view'
                    _self.formsVisible = true
                    _self.formsData = params.row.orders[0]
                  }
                }
              }, '详情')

            ])
          }
        }
      ],
      tableData: [],
      //  分页
      pageParams: {
        current: 1,
        size: 10,
        wlStatus: 1
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
        { label: '商品价格', key: 'proPrice' },
        { label: '已售数量', key: 'proSum' },
        { label: '商品总价', key: 'proMoney' },
        { label: '产品类型',
          key: 'proType',
          type: 'select',
          selectData: [
            { label: '热销', value: 1 },
            { label: '爆款', value: 2 },
            { label: '抢单', value: 3 }
          ]
        },
        { label: '商品图片', key: 'proImage', type: 'upload' }
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
      const res = await getOrders(pager, querys)
      this.tableData = this.filterData(res.data.data.records)
      this.pageTotal = Number(res.data.data.total)
    },
    filterData (data) {
      const typeStaus = ['', '普通商品', '计划商品', '抽奖商品']
      data.forEach(item => {
        item.typeText = typeStaus[item.type]
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
