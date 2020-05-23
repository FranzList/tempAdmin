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
import { getNotices, addNotice, editNotice, deleteNotice } from '@/api/notice'
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
        { title: '公告标题',
          key: 'title',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h(
              'span', {
                class: 'maxLength'
              },
              params.row.title
            )
          }
        },
        { title: '公告内容',
          key: 'content',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h(
              'span', {
                class: 'maxLength'
              },
              params.row.content
            )
          }
        },
        { title: '创建时间', key: 'createTime', align: 'center' },
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
                    _self.formsTitle = '编辑'
                    _self.openType = 'edit'
                    _self.formsData = params.row
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
                        deleteNotice({ id: params.row.id }).then(res => {
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
        size: 10,
        type: 1
      },
      //   分页总数
      pageTotal: 0,
      // 搜索
      queryParams: {},
      searchColumns: [
        { label: '公告标题', key: 'title' }
      ],
      // 动态表单数据
      formsTitle: '',
      formsData: {},
      formsVisible: false,
      formsColumns: [
        { label: '公告标题', key: 'title' },
        { label: '公告内容', key: 'content' }
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
      const res = await getNotices(pager, querys)
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
    async onFormsSubmit (event) {
      let data = {
        title: event.title,
        content: event.content
      }
      // deletePropertyFromObject(event,)
      if (this.formsTitle.includes('编辑')) {
        data.id = event.id
        const res = await editNotice(data)
        this.$Message.info(res.data.message)
        this.getTableData(this.pageParams, this.queryParams)
        this.formsVisible = false
      }
      if (this.formsTitle.includes('添加')) {
        const res = await addNotice(data)
        this.$Message.info(res.data.message)
        this.getTableData(this.pageParams, this.queryParams)
        this.formsVisible = false
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
.maxLength{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
