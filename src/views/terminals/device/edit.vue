<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    :before-close="handleCancel"
    width="500px"
  >
    <el-form
      ref="editForm"
      :model="editObj"
      :rules="rules"
      label-position="right"
      label-width="120px"
    >
      <el-row
        :gutter="10"
      >
        <el-col :span="24">
          <el-form-item
            label="标 识"
            prop="identity"
          >
            <el-input
              v-model="editObj.identity"
              size="mini"
              placeholder="设备标识"
              style="width: 300px;"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row
        :gutter="10"
      >
        <el-col :span="24">
          <el-form-item
            label="型 号"
            prop="model"
          >
            <el-input
              v-model="editObj.model"
              size="mini"
              placeholder="设备型号"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        :gutter="10"
      >
        <el-col :span="24">
          <el-form-item
            label="设备类型"
            prop="kind"
          >
            <el-autocomplete
              v-model="editObj.kind"
              :fetch-suggestions="querySearchAsync"
              size="mini"
              placeholder="设备类型"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="标 签"
        prop="tags"
      >
        <tag
          ref="tags"
          v-model="editObj.tags"
          class="filter-item"
          size="mini"
        />
      </el-form-item>

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="分 组"
            prop="groupId"
          >
            <el-cascader v-model="editObj.groupId" :props="props" size="mini" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button size="mini" @click="handleCancel">取 消</el-button>
      <el-button
        type="primary"
        icon="el-icon-check"
        size="mini"
        @click="handleSave"
      >保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Device, Group } from '../api.js'
import Tag from '@/components/Tag'
export default {
  name: 'ClientDeviceEdit',
  components: { Tag },
  props: {
    object: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editObj: {},
      origObj: {},
      defaultObj: {
        // id: '',
        identity: '',
        model: '',
        kind: '',
        groupId: '',
        tags: []
      },
      dialogTitle: '',
      groupId: '',
      updateBeforeIdentity: '',
      rules: {
        identity: [
          { required: true, message: '请填写标识', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择分组', trigger: 'blur' }
        ],
        kind: [{ required: true, message: '请填写类型', trigger: 'blur' }],
        model: [
          { required: true, message: '请填写型号', trigger: 'blur' }
        ]
        // duration: [{type: 'number', required: true, message: '请输入数值', trigger: 'change'}],
        // type: [{required: true, message: '请选择类型', trigger: 'change'}],
        // price: [{type: 'number', required: true, message: '请输入数值', trigger: 'change'}],
        // trial: [{type: 'number', required: true, message: '请输入数值', trigger: 'change'}],
        // flag: [{required: true, message: '请上传图片'}],
        // image: [{required: true, message: '请上传图片'}],
        // enabled: [{type: 'boolean', required: true, message: '请输入数值', trigger: 'change'}],
        // title: [{required: true, message: '请填写标题', trigger: 'blur'}],
        // description: [{required: true, message: '请填写描述', trigger: 'blur'}]
      },
      props: {
        lazy: true,
        checkStrictly: true,
        emitPath: false,
        lazyLoad(node, resolve) {
          let list = []
          const query = { parent: '', __order_by: 'updated,created' }
          if (node && node.data) {
            query.parent = node.data.id
          }
          Group.list(query).then(res => {
            if (res.data.data) {
              const groups = res.data.data
              groups.forEach(o => {
                o.value = o.id
                o.label = o.name
                if (o.parentId !== '00000000-0000-0000-0000-000000000000') {
                  o.leaf = true
                } else {
                  o.leaf = false
                }
              })
              list = groups
            } else {
              list = []
            }
            if (resolve) {
              return resolve(list)
            } else {
              node.childNodes = []
              node.doCreateChildren(list)
            }
          })
        }
      }
    }
  },
  computed: {},
  watch: {
    object: function(newVal, oldVal) {
      // console.log('object:>', oldVal, newVal)
      if (newVal) {
        this.origObj = Object.assign({}, this.defaultObj, newVal)
        this.editObj = Object.assign({}, this.defaultObj, newVal)
      } else {
        this.origObj = Object.assign({}, this.defaultObj)
        this.editObj = Object.assign({}, this.defaultObj)
      }
    },
    visible: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.origObj = Object.assign({}, this.defaultObj, this.object)
        this.editObj = Object.assign({}, this.defaultObj, this.object)
      }
    }
  },
  created() {
    this.origObj = Object.assign({}, this.defaultObj)
    this.editObj = Object.assign({}, this.defaultObj)
  },
  updated() {
    if (this.editObj.id) {
      this.dialogTitle = '编辑设备：' + this.editObj.identity
    } else {
      this.dialogTitle = '新增设备'
    }
  },
  methods: {
    handleSave() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.editObj.id) {
            const params = Object.assign({}, this.editObj)
            delete params.id
            delete params.created
            delete params.updated
            Device.update(this.editObj.id, params).then(() => {
              this.$emit('accept', true)
            })
          } else {
            Device.create(this.editObj).then(() => {
              this.$emit('accept', true)
            })
          }
        } else {
          this.$message.error('数据填写错误，请校正后提交')
          return false
        }
      })
    },
    handleCancel() {
      this.$refs.editForm.resetFields()
      this.$emit('cancel', '')
    },
    querySearchAsync(k, cb) {
      Request('apis/devices/kinds').get({ kw: k }).then(res => {
        const kinds = []
        res.data.forEach(v => {
          kinds.push({ value: v })
        })
        cb(kinds)
      })
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

</style>
