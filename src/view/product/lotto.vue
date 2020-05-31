<template>
  <div>
    <Modal v-model="resultVisible" title="抽奖结果" footer-hide width="1200">
      <Table size="small" border :columns="resultColumns" :data="resultTableData">
        <template slot-scope="{ row }" slot="productURL">
            <img style="width:100px;height:100px" :src="row.productURL"></img>
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
      @on-selectChange="onSelectChange"
    ></forms>
  </div>
</template>

<script>
import Tables from '_c/tables'
import Forms from '_c/forms'
import {
  getLottos,
  addLotto,
  editLotto,
  detailLotto,
  deletelLotto,
  getProducts,
  getLottoResult
} from '@/api/product'
import { isNullObject, deletePropertyFromObject } from '@/libs/tools'
export default {
  name: 'lotto',
  components: {
    Tables,
    Forms
  },
  data () {
    let _self = this
    return {
      resultVisible: false,
      columns: [
        { title: '商品名称', key: 'name', align: 'center' },
        { title: '商品价格', key: 'price', align: 'center' },
        { title: '商品原价', key: 'originalPrice', align: 'center' },
        { title: '订单数', key: 'orderTotal', align: 'center' },
        { title: '每笔订单下降额度', key: 'declineAmount', align: 'center' },
        { title: '抽奖商品剩余金额', key: 'orderAmount', align: 'center' },
        { title: '成交订单数量', key: 'surplusOrderTotal', align: 'center' },
        { title: '执行顺序', key: 'sorting', align: 'center' },
        { title: '奖品数量', key: 'prizesNum', align: 'center' },
        // { title: '奖品期数', key: 'status', align: 'center' },
        {
          title: '操作',
          key: 'zz',
          align: 'center',
          width: '300',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: this.$config.colors.view,
                    size: 'small'
                  },
                  style: {},
                  on: {
                    click () {
                      detailLotto({ id: params.row.id }).then(res => {
                        _self.formsData = res.data.data
                        _self.formsVisible = true
                        _self.formsTitle = '查看'
                        _self.openType = 'view'
                      })
                    }
                  }
                },
                '查看'
              ),
              h(
                'Button',
                {
                  props: {
                    type: this.$config.colors.edit,
                    size: 'small'
                  },
                  style: {
                    margin: '0 5px'
                  },
                  on: {
                    click () {
                      _self.formsVisible = true
                      _self.formsData = params.row
                      console.log(params.row)
                      _self.formsTitle = '编辑'
                      _self.openType = 'edit'
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: this.$config.colors.add,
                    size: 'small'
                  },
                  style: {
                    margin: '0 5px'
                  },
                  on: {
                    click () {
                      // _self.formsVisible = true
                      // _self.formsData = params.row

                      getLottoResult({
                        current: 1,
                        size: 500,
                        goodsId: params.row.id
                      }).then(res => {
                        _self.resultTableData = res.data.data.records
                        _self.resultVisible = true
                      })
                    }
                  }
                },
                '抽奖结果'
              ),
              h(
                'Button',
                {
                  props: {
                    type: this.$config.colors.delete,
                    size: 'small'
                  },
                  style: {
                    display: `${params.row.isDel == 0}?'':'none'`
                  },
                  on: {
                    click () {
                      const config = {
                        title: '提示',
                        content: '确定删除吗？',
                        loading: true,
                        onOk: () => {
                          deletelLotto({ id: params.row.id }).then(res => {
                            _self.$Modal.remove()
                            _self.$Message.info(res.data.message)
                            _self.getTableData(
                              _self.pageParams,
                              _self.queryParams
                            )
                          })
                        },
                        onCancel: () => {
                          console.log('cacel')
                        }
                      }
                      _self.$Modal.confirm(config)
                    }
                  }
                },
                '删除'
              )
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
      resultColumns: [
        { title: '地址', key: 'address', width: 200 },
        { title: '电话', key: 'phone', width: 200 },
        { title: '中奖码', key: 'code', width: 200 },
        // { title: '运单号', key: 'expressNo', width: 200 },
        // { title: '发货时间', key: 'deliverTime', width: 200 },
        { title: '中奖人名称', key: 'userName', width: 200 },
        { title: '商品名称', key: 'productName', width: 200 },
        { title: '商品图片', slot: 'productURL', width: 200 }

      ],
      resultTableData: [],
      // 抽奖商品数据
      formsColumns: [
        { label: '抽奖商品名称', key: 'name' },
        { label: '选择商品', key: 'productId', type: 'select', selectData: [] },
        { label: '商品价格', key: 'price' },
        { label: '商品原价', key: 'originalPrice' },
        { label: '订单数', key: 'orderTotal' },
        { label: '每笔订单下降额度', key: 'declineAmount' },
        { label: '抽奖商品剩余金额', key: 'orderAmount' },
        { label: '成交订单数量', key: 'surplusOrderTotal' },
        { label: '执行顺序', key: 'sorting' },
        { label: '奖品数量', key: 'prizesNum' },
        { label: '商品图片', key: 'imageUrl', type: 'upload' },
        { label: '详情图片', key: 'detail', type: 'upload', maxNum: 9 }
      ],
      openType: 'view'
    }
  },
  methods: {
    // 获取商品里的抽奖商品
    async getGoodsForLotto () {
      // 要当成抽奖商品的模版
      const res1 = await getProducts({ current: 1, size: 500, type: 3 })
      const tempGoods = res1.data.data.records
      this.formsColumns.forEach(item => {
        if (item.label === '选择商品') {
          tempGoods.forEach(good => {
            item.selectData.push({
              label: good.name,
              value: good.id
            })
          })
        }
      })
    },
    // 选择事件--用来动态删除表单元素
    onSelectChange (e) {},
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
      const res = await getLottos(pager, querys)
      console.log(res)
      this.tableData = this.filterData(res.data.data.records)
      this.pageTotal = Number(res.data.data.total)
      this.dynimacFormsColumns = this.formsColumns
    },
    filterData (data) {
      const typeStaus = ['', '普通商品', '计划商品', '抽奖商品']
      data.forEach(item => {})
      return data
    },
    // 表单提交
    async onFormsSubmit (event) {
      let data = { ...event }

      deletePropertyFromObject(data, ['_index', 'initRowIndex', '_rowKey'])

      // let validateInfo = {
      //   name: '请输入商品名称',
      //   price: '请输入商品价格',
      //   profitCount: '请输入返利期数',
      //   intro: '请上传详情图片',
      //   type: '请输入商品类型',
      //   image: '请上传商品图片'
      // }
      // let data = {}
      // let validateArr = []
      // Object.keys(validateInfo).forEach(key => {
      //   data[key] = event[key]
      //   validateArr.push(key)
      // })
      // let message = ''
      // Object.keys(data).forEach(key => {
      //   if (!data[key]) {
      //     message = validateInfo[key]
      //   }
      // })
      // const isNull = isNullObject(data, validateArr)
      // if (!isNull) {
      //   this.$Message.error(message)
      //   return
      // }
      // deletePropertyFromObject(event,)
      if (this.formsTitle.includes('编辑')) {
        data.id = event.id
        const res = await editLotto(data)
        if (res.data.code === 200) {
          this.$Message.info(res.data.message)
          this.getTableData(this.pageParams, this.queryParams)
          this.formsVisible = false
        } else {
          this.$Message.error(res.data.message)
        }
      }
      if (this.formsTitle.includes('添加')) {
        const res = await addLotto(data)
        if (res.data.code === 200) {
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
    this.getGoodsForLotto()
  }
}
</script>

<style>
</style>
