<template>
<div>
  <Modal
    v-model="visible"
    :title="formsTitle"
    :mask-closable="false"
    @on-ok="ok"
    :closable="false"
    @on-cancel="cancel"
  >
  <!--  -->
    <Form ref="formInline" :model="formsData" :label-width="calcFromWidth">
      <FormItem
        v-for="(item,index) in formsColumns"
        :prop="item.key"
        :key="index"
        :label="item.label"
        :style="{'display':item.hidden?'none':''}"
      >
        <!-- checkBox -->
        <CheckboxGroup v-if="item.type== 'checkboxGroup'" v-model="formsData[item.key]">
          <Checkbox
            v-for="checkbox in item.checkboxGroupData"
            :key="checkbox.label"
            :label="checkbox.value"
          >{{checkbox.label}}</Checkbox>
        </CheckboxGroup>
        <!-- radio -->
        <RadioGroup v-else-if="item.type == 'radioGroup'" v-model="formsData[item.key]">
          <Radio
            v-for="radio in item.radioGroupData"
            :key="radio.label"
            :label="radio.value"
          >{{radio.label}}</Radio>
        </RadioGroup>
        <!-- select -->
        <Row v-if="item.type == 'select'">
          <Col span="11">
            <Select
              v-model="selfFormData[item.key]"
              :multiple="item.multiple"
              clearable
              :max-tag-count="1"
              @on-change="item.multiple?onSelectChange_multiple(item.key,$event,item.selectData):onSelectChange(item.key,$event,item)"
              :disabled="openType == 'view'"
            >
              <Option
                v-for="select in item.selectData"
                :value="select.value"
                :label="select.label"
                :key="select.value"

              ></Option>
            </Select>
          </Col>
          <Col v-if="item.multiple" span="5" style="margin-left:10px">
            <i-switch
              @on-change="onSwitchChange(item.key,$event,item.selectData)"
              v-model="selectAllSwitch[item.key]"
              :disabled="openType == 'view'"
            />
            <span style="margin-left:5px">全选</span>
          </Col>
        </Row>
        <!-- upload -->
        <div v-else-if="item.type == 'upload'">
          <!-- <Button v-if="selfUploderVisible[item.key]" icon="ios-eye" @click="previewImg($event,item.key)" >预览图片</Button> -->
          <!-- <Uploader
        :maxNum="item.maxNum"
        @on-uploadSuccess="onUploadSuccess($event,item.key)"
        /> -->
        <uploader1
        ref="uploader"
        :maxNum="item.maxNum"
        @on-uploadSuccess="onUploadSuccess($event,item.key)"
         :default-list="defaultList[item.key]"
        />

        </div>

        <!-- input -->
        <!-- 输入格式的限制 -->
        <Input v-else
         :type="item.inputType||'text'"
         :readonly="openType == 'view'"
         v-model="formsData[item.key]"
         />
      </FormItem>
    </Form>
    <div  slot="footer">
        <Button  size="large" @click="cancel">取消</Button>
        <Button v-if="openType!=='view'" type="primary" size="large" @click="ok">确定</Button>
      </div>
  </Modal>
  </div>
</template>

<script>

import Uploader1 from './uploader1'
export default {
  data () {
    return {
      selectAllSwitch: {},
      forms: {},
      // 全选
      selfFormData: {},
      oldSelectValue: [[]],
      visible: this.formsVisible,
      calcFromWidth: 0,
      hasImage: false,
      value: '',
      selfUploderVisible: {

      },
      defaultList: {}
    }
  },
  methods: {

    onUploadSuccess (e, key) {
      // this.selfUploderVisible = Object.assign({},this.selfUploderVisible,{key,true})
      this.selfFormData[key] = e
    },
    ok () {
      if (this.openType.toLowerCase() === 'view') return
      let data = { ...this.formsData, ...this.selfFormData }

      this.$emit('on-formsSubmit', { ...data })
    },
    cancel () {
      this.$emit('on-formsCancel')
    },
    onSelectChange_multiple (key, value, options) {
      this.selectAllSwitch[key] = value.length === options.length
    },
    onSwitchChange (key, value, options) {
      const allVals = options.map(item => { return item.value })
      this.selfFormData[key] = value ? allVals : []
    },
    onSelectChange (key, value, item) {
      this.selfFormData[key] = value
      this.$emit('on-selectChange', { key: key, value: value })
    },
    getFromWidth () {
      const arr = [...this.formsColumns]
      arr.sort((a, b) => { return (a.label.length - b.label.length) })
      return (arr[arr.length - 1].label.length) * 12
    }
  },
  props: {
    formsTitle: {
      type: String,
      default: '2323'
    },
    formsData: {
      type: Object,
      default () {
        return {}
      }
    },
    formsVisible: {
      type: Boolean,
      default: true
    },
    formsColumns: {
      type: Array,
      default () {
        return []
      }
    },
    // 查看方式
    openType: {
      type: String,
      default: 'view'
    }
  },
  watch: {
    formsVisible (newVal, oldVal) {
      // this.formsColumns.forEach(column => {
      //   if (column.type === 'upload') {
      //     this.selfUploderVisible[column.key] = false
      //   }
      // })
      if (!newVal) {
        // 清空上传组件的文件
        try {
          this.$refs.uploader.forEach(item => {
            item.handleClearFile()
          })
        } catch (error) {

        }

        this.defaultList = []
        this.selfFormData = {}
        this.selfUploderVisible = {}
        this.$emit('update:formsData', {})
      }
      this.calcFromWidth = this.getFromWidth() + 12
      this.visible = newVal
    },
    formsData (newVal) {
      if (Object.keys(newVal).length === 0) return

      // 拿到key columns的type为select的数据
      // for (const key in newVal) {
      //   console.log(key);
      // }
      this.formsColumns.forEach(column => {
        Object.keys(newVal).forEach(key => {
          // 单选
          if (column.key === key && column.type === 'select') {
            console.log('1')
            this.selfFormData[key] = this.formsData[key]
          }
          //  多选
          if (column.key === key && column.type === 'select' && column.multiple) {
            console.log('2')
            const selectVal = this.formsData[key]
            if (selectVal.length > 1) {
              this.selfFormData[key] = selectVal.split(',').map(Number)
            } else {
              this.selfFormData[key] = Number(this.formsData[key])
            }
          }
          if (column.key === key && column.type === 'upload') {
            this.selfFormData[key] = this.formsData[key]
            const images = this.selfFormData[key].split(',')
            if (images.length > 1) {
              this.defaultList[key] = []
              images.forEach(image => {
                this.defaultList[key].push({
                  name: Date.now(),
                  url: image
                })
              })
            } else {
              this.defaultList[key] = [
                {
                  name: key,
                  url: this.selfFormData[key]
                }
              ]
            }
          }
        })
      })
    }
  },
  computed: {
  },
  components: {
    Uploader1
  }
}
</script>
