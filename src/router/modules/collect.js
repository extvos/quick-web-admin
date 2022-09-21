// Routing table for Orders
import Layout from '@/layout/Default'

const collectRouter = {
  path: '/collect',
  component: Layout,
  redirect: '/new',
  children: [
    {
      path: 'new',
      component: () => import('@/views/orders/new/index'),
      name: 'CollectNew',
      meta: { title: '订单录入', icon: 'el-icon-edit-outline', roles: ['operator'] }
    }
  ]
}

export default collectRouter
