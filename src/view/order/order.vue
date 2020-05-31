<template>
  <div>
    <Modal v-model="proVisible" title="返还计划" footer-hide width="1200">
      <Table size="small" border :columns="proColumns" :data="proTableData">
        <template slot-scope="{ row }" slot="proType">
            <span v-if="row.proType === 1">普通商品</span>
            <span v-if="row.proType === 2">计划商品</span>
            <span v-if="row.proType === 3">抽奖商品</span>
        </template>
        <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 1">生产中</span>
            <span v-if="row.status === 2">已完成</span>
        </template>
        <template slot-scope="{ row }" slot="proImage">
            <img style="width:100px;height:100px" :src="row.proImage"></img>
        </template>
        <template slot-scope="{ row }" slot="action">
            <Button size="small" type="primary" @click="viewSuborders(row)">查看子订单</Button>
        </template>
      </Table>
    </Modal>
     <Modal v-model="suborderVisible" title="子订单" footer-hide width="1200">
      <Table height="400" size="small" border :columns="suborderColumns" :data="suborderTableData">   
        <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 0">待返</span>
            <span v-if="row.status === 1">已返</span>
        </template>
      </Table>
    </Modal>
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
import { getOrders, findOrder } from '@/api/order'
export default {
  name: 'product',
  components: {
    Tables,
    Forms
  },
  data () {
    let _self = this
    return {
      proVisible: false,
      proColumns: [
        { title: '商品名称', key: 'proName', align: 'center' },
        { title: '价格', key: 'proPrice', align: 'center' },
        { title: '购买数量', key: 'proSum', align: 'center' },
        { title: '返利期数', key: 'profitCount', align: 'center' },
        { title: '每期返利', key: 'periodicProfit', align: 'center' },
        { title: '总价', key: 'proMoney', align: 'center' },
        { title: '商品类型', key: 'proType', align: 'center' },
        { title: '订单状态', slot: 'status', align: 'center' },
        { title: '产品图片', slot: 'proImage', align: 'center' },
        { title: '创建时间', key: 'createTime', align: 'center' },
        { title: '操作', slot: 'action', align: 'center' }
      ],
      proTableData: [],
      suborderVisible: false,
      suborderColumns: [
        { title: '返利', key: 'proProfit', align: 'center' },
        { title: '生产时间', key: 'proTime', align: 'center' },
        // { title: '实返时间', key: 'realTime', align: 'center' },
        { title: '创建时间', key: 'createTime', align: 'center' },
        { title: '返利状态', slot: 'status', align: 'center' }
      ],
      suborderTableData: [],
      columns: [
        { title: '商品数量', key: 'productCount', align: 'center' },
        { title: '订单编号', key: 'orderNo', align: 'center' },
        { title: '订单金额', key: 'orderMoney', align: 'center' },
        { title: '创建时间', key: 'createTime', align: 'center' },
        { title: '支付时间', key: 'productCount', align: 'center' },
        { title: '支付方式', key: 'paymentText', align: 'center' },
        { title: '送货地址', key: 'address', align: 'center' },
        { title: '创建时间', key: 'createTime', align: 'center' },
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
                    _self.proVisible = true
                    findOrder({
                      orderId: 229,
                      orderProId: 25
                    }).then(res => {
                      _self.proTableData = res.data.data
                    })
                  }
                }
              }, '返还计划')
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
        { label: '订单编号', key: 'orderNo' },
        { label: '返利状态',
          key: 'profitOrder',
          type: 'select',
          selectData: [
            { label: '未返利', value: 'false' },
            { label: '已返利', value: 'true' }
          ] }

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
    viewSuborders (row) {
      this.suborderVisible = true
      this.suborderTableData = row.proSubOrders
      this.suborderTableData = this.suborderTableData.concat(row.proSubOrders)
    },
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
      if (this.queryParams.profitOrder) {
        this.queryParams.profitOrder = this.queryParams.profitOrder.includes('true')
      }

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
      const typeStaus = ['', '支付宝', '微信', '银联']
      data.forEach(item => {
        item.paymentText = typeStaus[item.payment]
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
