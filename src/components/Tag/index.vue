<template>
  <el-form-item :label="label">
    <el-tag
      v-for="tag in tags"
      :key="tag"
      :disable-transitions="false"
      closable
      @close="handleClose(tag)"
    >{{ tag }}</el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag"
      size="mini"
      @click="showInput"
    >+ 新标签</el-button>
  </el-form-item>
</template>

<script>
export default {
  name: 'Tag',

  props: {
    value: {
      type: Array,
      default: function() {
        return []
      }
    },
    label: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      inputVisible: false,
      inputValue: '',
      tags: null
    }
  },
  computed: {
  },

  watch: {
    value: function(newVal, oldVal) {
      if (newVal) {
        this.tags = newVal.slice(0)
      }
    }
  },

  created() {
    if (this.value == null) {
      this.tags = []
    } else {
      this.tags = this.value.slice(0)
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
      this.$emit('input', this.tags)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      for (const i in this.value) {
        if (this.value[i] === inputValue) {
          this.$message.error('请勿输入重复的标签')
          this.inputVisible = false
          this.inputValue = ''
          return
        }
      }
      if (inputValue) {
        if (this.tags) {
          this.tags.push(inputValue)
        } else {
          this.tags = [inputValue]
        }
      }
      this.$emit('input', this.tags)
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.el-tag + .button-new-tag {
  margin-left: 10px;
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
