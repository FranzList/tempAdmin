<template>
  <div>
    <!-- <Card>
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
    </Card>-->

    <Form size="small" :model="formsData" :label-width="150">
      <FormItem label="佣金提现最小额度">
        <Input v-model="formsData.minCommissionCash"></Input>
      </FormItem>
      <FormItem label="佣金每天提现次数">
        <Input v-model="formsData.commissionCashTimes"></Input>
      </FormItem>
      <FormItem label="每月提取次数">
        <Input v-model="formsData.amountCashOutTimes"></Input>
      </FormItem>
      <FormItem label="最小提现金额">
        <Input v-model="formsData.minAmountCashOut"></Input>
      </FormItem>
      <FormItem label="最大提现金额">
        <Input v-model="formsData.maxAmountCashOut"></Input>
      </FormItem>
      <FormItem label="平台补偿代理商返点">
        <Input v-model="formsData.agent2AgentReturnRate"></Input>
      </FormItem>
      <FormItem label="代理商与会员之间的返点">
        <Input v-model="formsData.agentMemberReturnRate"></Input>
      </FormItem>
      <FormItem label="会员间的推荐返点">
        <Input v-model="formsData.member2MemberRate"></Input>
      </FormItem>
      <FormItem label="商品推广佣金">
        <Input v-model="formsData.productMemberRate"></Input>
      </FormItem>
      <FormItem label="代理商体现收取比率">
        <Input v-model="formsData.agentCashOutRate"></Input>
      </FormItem>
      <FormItem label="开户名">
        <Input v-model="formsData.accountName"></Input>
      </FormItem>
      <FormItem label="开户银行">
        <Input v-model="formsData.accountBank"></Input>
      </FormItem>
      <FormItem label="开户账号">
        <Input v-model="formsData.accountNo"></Input>
      </FormItem>
      <FormItem label="支付宝账号">
        <Input v-model="formsData.alipayNo"></Input>
      </FormItem>
      <FormItem label="支付宝开户人名称">
        <Input v-model="formsData.alipayAccountName"></Input>
      </FormItem>
      <FormItem>
        <Button @click="onFormsSubmit(formsData)" type="primary">保存</Button>
      </FormItem>
    </Form>
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
import { getPlatformOptions, editPlatformOptions } from '@/api/platform'
import { isNullObject, deletePropertyFromObject } from '@/libs/tools'
export default {
  name: 'platform',
  components: {
    Tables,
    Forms
  },
  data () {
    let _self = this
    return {
      columns: [
        { title: '商品名称', key: 'name', align: 'center' },
        { title: '商品价格', key: 'price', align: 'center' },
        { title: '返利期数', key: 'profitCount', align: 'center' },
        { title: '商品类型', key: 'typeText', align: 'center' },
        { title: '库存', key: 'stock', align: 'center' },
        { title: '批发价', key: 'tradePrice', align: 'center' },
        { title: '采购价', key: 'purchasePrice', align: 'center' },
        {
          title: '操作',
          key: 'zz',
          align: 'center',
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
                      detailProduct({ productId: params.row.id }).then(res => {
                        _self.formsData = res.data.data
                        _self.formsVisible = true
                        _self.formsTitle = '查看'
                        if (params.row.type !== 2) {
                          const deleteKeys = [
                            'profitCount',
                            'periodicProfit',
                            'profitType'
                          ]
                          _self.formsColumns.forEach(item => {
                            deleteKeys.forEach(key => {
                              if (item.key === key) {
                                // const index = this.formsColumns.indexOf(item)
                                item.hidden = true
                              }
                            })
                          })
                        }
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
                        content: '确定下架吗？',
                        loading: true,
                        onOk: () => {
                          offProduct({ productId: params.row.id }).then(res => {
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
                '下架'
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
        { label: '商品名称', key: 'name' },
        {
          label: '商品名称',
          key: 'type',
          type: 'select',
          selectData: [
            { label: '普通商品', value: 1 },
            { label: '计划商品', value: 2 },
            { label: '抽奖商品', value: 3 }
          ]
        }
      ],
      // 动态表单数据
      formsTitle: '',
      formsData: {},
      formsVisible: false,
      formsColumns: [
        { label: '商品名称', key: 'name' },
        { label: '商品价格', key: 'price' },
        { label: '库存', key: 'stock' },
        { label: '批发价', key: 'tradePrice' },
        { label: '采购价', key: 'purchasePrice' },
        { label: '返利期数', key: 'profitCount' },
        { label: '每期返利', key: 'periodicProfit' },
        {
          label: '返利周期单位',
          key: 'profitType',
          type: 'select',
          selectData: [
            { label: '天', value: '天' },
            { label: '月', value: '月' },
            { label: '周', value: '周' }
          ]
        },
        {
          label: '产品类型',
          key: 'type',
          type: 'select',
          selectData: [
            { label: '普通商品', value: 1 },
            { label: '计划商品', value: 2 },
            { label: '抽奖商品', value: 3 }
          ]
        },
        { label: '商品图片', key: 'image', type: 'upload' },
        { label: '详情图片', key: 'intro', type: 'upload', maxNum: 9 }
      ],
      openType: 'view'
    }
  },
  methods: {
    // 选择事件--用来动态删除表单元素
    onSelectChange (e) {
      // this.formsColumns = [
      //   // { label: '每期返利', key: 'periodicProfit' },
      // ]

      if (e.key === 'type' && e.value === 2) {
        // 要删除的表单
        const deleteKeys = ['profitCount', 'periodicProfit', 'profitType']
        this.formsColumns.forEach(item => {
          deleteKeys.forEach(key => {
            if (item.key === key) {
              // const index = this.formsColumns.indexOf(item)
              item.hidden = true
            }
          })
        })
      } else {
        this.formsColumns.forEach(item => {
          item.hidden = false
        })
      }
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
      this.pageParams.current = 1
      this.getTableData(this.pageParams, this.queryParams)
    },
    handleDelete (params) {
      console.log(params)
    },
    async getTableData (pager, querys) {
      const res = await getPlatformOptions()
      this.formsData = res.data.data
      console.log(res)
    //   this.tableData = this.filterData(res.data.data.records)
    //   this.pageTotal = Number(res.data.data.total)
    },
    filterData (data) {
      const typeStaus = ['', '普通商品', '计划商品', '抽奖商品']
      data.forEach(item => {
        item.typeText = typeStaus[item.type]
      })
      const arr = data.filter(item => item.isDel === 0)

      console.log(arr)
      return arr
    },
    // 表单提交
    async onFormsSubmit (event) {
      let data = { ...event }
      this.formsTitle = '添加'
      //   if (data.type != 2) {
      //     deletePropertyFromObject(data, ['profitType', 'periodicProfit', 'profitCount'])
      //   }

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
        const res = await editProduct(data)
        this.$Message.info(res.data.message)
        this.getTableData(this.pageParams, this.queryParams)
        this.formsVisible = false
      }
      if (this.formsTitle.includes('添加')) {
        const res = await editPlatformOptions(data)
        this.$Message.info(res.data.message)
        // this.getTableData(this.pageParams, this.queryParams)
        // this.formsVisible = false
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
