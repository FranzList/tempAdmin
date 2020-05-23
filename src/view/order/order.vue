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
import { getOrders } from '@/api/order'
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
        { title: '创建时间', key: 'createTime', align: 'center' }
        // { title: '操作',
        //   key: 'zz',
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('div', [

        //       h('Button', {
        //         props: {
        //           type: this.$config.colors.view,
        //           size: 'small'
        //         },
        //         style: {

        //         },
        //         on: {
        //           click () {
        //             _self.formsVisible = true
        //             _self.formsTitle = '查看'
        //             _self.formsData = params.row
        //             console.log(_self.formsData)
        //           }
        //         }
        //       }, '查看'),
        //       h('Button', {
        //         props: {
        //           type: this.$config.colors.edit,
        //           size: 'small'
        //         },
        //         style: {
        //         },
        //         on: {
        //           click () {

        //           }
        //         }
        //       }, '编辑'),
        //       h('Button', {
        //         props: {
        //           type: this.$config.colors.other1,
        //           size: 'small'
        //         },
        //         style: {

        //         },
        //         on: {
        //           click () {
        //           }
        //         }
        //       }, '上架'),
        //       h('Button', {
        //         props: {
        //           type: this.$config.colors.delete,
        //           size: 'small'
        //         },
        //         style: {

        //         },
        //         on: {
        //           click () {
        //           }
        //         }
        //       }, '删除')
        //     ])
        //   }
        // }
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
        { label: '订单编号', key: 'orderNo' }
      ],
      // 动态表单数据
      formsTitle: '',
      formsData: {},
      formsVisible: false,
      formsColumns: [
        { label: '商品名称', key: 'name' },
        { label: '返利天数', key: 'days' },
        { label: '商品价格', key: 'price' },
        { label: '商品返利', key: 'profit' },
        { label: '已售数量', key: 'soldNum' },
        { label: '产品类型',
          key: 'type',
          type: 'select',
          selectData: [
            { label: '热销', value: 1 },
            { label: '爆款', value: 2 },
            { label: '抢单', value: 3 }
          ]
        },
        { label: '创建时间', key: 'createTime' },
        { label: '商品图片', key: 'image', type: 'upload', maxNum: 1 },
        { label: '详情图片', key: 'intro', type: 'upload', maxNum: 1 }

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
