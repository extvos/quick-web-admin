// Routing table for Orders
import Layout from '@/layout/Default'

const orderRouter = {
  path: '/orders',
  component: Layout,
  redirect: 'noredirect',
  name: 'Orders',
  meta: {
    title: '订单管理',
    icon: 'el-icon-collection',
    roles: ['operator']
  },
  children: [
    {
      path: 'audit',
      component: () => import('@/views/orders/audit/index'),
      name: 'OrderAudit',
      meta: { title: '订单审核', icon: 'el-icon-finished', roles: ['operator'] }
    },
    {
      path: 'delivery',
      component: () => import('@/views/orders/delivery/index'),
      name: 'OrderDelivery',
      meta: { title: '订单发货', icon: 'el-icon-receiving', roles: ['operator'] }
    },
    {
      path: 'logistic',
      component: () => import('@/views/orders/logistic/index'),
      name: 'OrderLogistic',
      meta: { title: '物流跟踪', icon: 'el-icon-truck', roles: ['operator'] }
    },
    {
      path: 'service',
      component: () => import('@/views/orders/service/index'),
      name: 'OrderService',
      meta: { title: '售后服务', icon: 'el-icon-headset', roles: ['operator'] }
    },
    {
      path: 'refound',
      component: () => import('@/views/orders/refound/index'),
      name: 'OrderRefound',
      meta: { title: '退换管理', icon: 'el-icon-notebook-1', roles: ['operator'] }
    }]
}

export default orderRouter
