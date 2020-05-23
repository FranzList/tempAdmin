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
import { getCategories, addCategory,deleteCategory } from '@/api/product'
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
        { title: '分类名称', key: 'name', align: 'center' },
        { title: '大图',
          key: 'url',
          align: 'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.url,
                width: 50,
                height: 50
              }
            })
          } },
        { title: '小图',
          key: 'icon',
          align: 'center',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.icon,
                width: 50,
                height: 50
              }
            })
          } },
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
                  'margin-left': '5px'
                },
                on: {
                  click () {
                    const config = {
                      title: '提示',
                      content: '确定删除吗？',
                      loading: true,
                      onOk: () => {
                        deleteCategory({ id: params.row.id }).then(res => {
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

      ],
      // 动态表单数据
      formsTitle: '',
      formsData: {},
      formsVisible: false,
      formsColumns: [
        { label: '分类名称', key: 'name' },
        { label: '大图', key: 'url', type: 'upload' },
        { label: '小图', key: 'icon', type: 'upload' }
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
      const res = await getCategories(pager, querys)
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
    async onFormsSubmit (event) { 
      let validateInfo = {
        url: '请上传大图',
        icon: '请上传小图',
        name: '请填写分类名'
      }

      let data = {
        url: event.url,
        icon: event.icon,
        name: event.name
      }
      let message = ''
      Object.keys(data).forEach(key => {
        if (!data[key]) {
          message = validateInfo[key]
        }
      })
      const isNull = isNullObject(data, ['url', 'icon', 'name'])
      if (!isNull) {
        this.$Message.error(message)
        return
      }
      // deletePropertyFromObject(event,)
      if (this.formsTitle.includes('编辑')) {
        data.id = event.id
        const res = await addCategory(data)
        this.$Message.info(res.data.message)
        this.getTableData(this.pageParams, this.queryParams)
        this.formsVisible = false
      }
      if (this.formsTitle.includes('添加')) {
        const res = await addCategory(data)
        this.$Message.info(res.data.message)
        this.formsVisible = false
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
