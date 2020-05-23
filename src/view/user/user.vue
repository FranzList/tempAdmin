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
      ></tables>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAppUsers } from '@/api/user'
export default {
  name: 'user',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '手机号', key: 'phone', align: 'center' },
        { title: '邀请码', key: 'inviteCode', align: 'center' },
        { title: '邀请人数', key: 'inviteCount', align: 'center' },
        { title: '创建时间', key: 'createTime', align: 'center' }
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
        { label: '手机号', key: 'phone' }
      ]

    }
  },
  methods: {
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
    async getTableData (pager,querys) {
      const res = await getAppUsers(pager,querys)
      this.tableData = res.data.data.records
      this.pageTotal = Number(res.data.data.total)
    },
    filterData (data) {
      data.forEach(item => {
        console.log(item)
      })
      return data
    }
  },
  mounted () {
    this.getTableData(this.pageParams, this.queryParams)
  }
}
</script>

<style>

</style>
