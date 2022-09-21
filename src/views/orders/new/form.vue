<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收件人：">
          <el-input v-model="form.fullname" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="电 话：">
          <el-input v-model="form.phone" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="行政区域：">
          <address-editor v-model="form.region" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="详细地址：">
          <el-input v-model="form.address" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="商品明细：">
          <el-table
            :data="form.products"
            :show-header="true"
            :summary-method="getSummaries"
            show-summary
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="商品名称"
              min-width="240"
              align="center"
            />
            <el-table-column
              prop="num"
              label="数 量"
              width="80"
              align="center"
            />
            <el-table-column
              prop="sum"
              label="金 额"
              width="120"
              align="right"
            />
            <el-table-column
              prop=""
              label="操 作"
              width="60"
              align="center"
            >
              <template>
                <el-button type="text" size="small" icon="el-icon-edit" />
                <el-button type="text" size="small" icon="el-icon-delete" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item align="right">
      <el-button type="warning">重 置</el-button>
      <el-button type="primary" @click="onSubmit">创 建</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import AddressEditor from '@/components/AddressEditor'
export default {
  components: { AddressEditor },
  data() {
    return {
      form: {
        fullname: '',
        region: '',
        address: '',
        phone: '',
        amount: 0,
        products: [{ name: '智能门锁-1', num: 2, sum: 300 }, { name: '智能门锁-2', num: 1, sum: 200 }, { name: '智能门锁-3', num: 1, sum: 400 }]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ' / '
        }
      })

      return sums
    }
  }
}
</script>
