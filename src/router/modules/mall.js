// Routing table for Billing
import Layout from '@/layout/Default'

const mallRouter = {
  path: '/mall',
  component: Layout,
  redirect: 'noredirect',
  name: 'Mall',
  meta: {
    title: '商品管理',
    icon: 'el-icon-office-building',
    roles: ['manager']
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/mall/category/index'),
      name: 'ProductCategory',
      meta: { title: '分类管理', icon: 'el-icon-s-fold', roles: ['manager'] }
    },
    {
      path: 'products',
      component: () => import('@/views/mall/products/index'),
      name: 'ProductIndex',
      meta: { title: '商品目录', icon: 'el-icon-goods', roles: ['manager'] }
    }]
}

export default mallRouter
