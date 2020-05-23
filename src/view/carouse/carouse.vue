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
import { getCarouses, editCarouses } from '@/api/carouse'
import { isNullObject } from '@/libs/tools'
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
        { title: 'ID', key: 'id', align: 'center' },
        { title: '跳转地址', key: 'h5', align: 'center' },
        { title: '轮播图',
          key: 'imageUrl',
          align: 'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imageUrl,
                width: 200,
                height: 100
              }
            })
          }
        },
        { title: '操作',
          key: 'zz',
          align: 'center',
          render: (h, params) => {
            return h('div', [

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
              }, '编辑')
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
      ],
      // 动态表单数据
      formsTitle: '',
      formsData: {},
      formsVisible: false,
      formsColumns: [
        { label: '跳转链接', key: 'h5' },
        { label: '轮播图', key: 'imageUrl', type: 'upload' }
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
      const res = await getCarouses(pager, querys)
      this.tableData = this.filterData(res.data.data)
      this.pageTotal = Number(res.data.data.total)
    },
    filterData (data) {
      data.forEach(item => {
      })

      return data
    },
    // 表单提交
    async onFormsSubmit (event) {
      let validateInfo = {
        h5: '请输入跳转链接',
        imageUrl: '请上传轮播图'
      }
      let data = {}
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
        const res = await editCarouses(data)
        this.$Message.info(res.data.message)
        this.onFormsCancel()
      }
    },
    onFormsCancel () {
      this.getTableData(this.pageParams, this.queryParams)
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
