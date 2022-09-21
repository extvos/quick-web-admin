// Routing table for Billing
import Layout from '@/layout/Default'

const organizationRouter = {
  path: '/billing',
  component: Layout,
  redirect: 'noredirect',
  name: 'Billing',
  meta: {
    title: '对账管理',
    icon: 'el-icon-office-building',
    roles: ['operator']
  },
  children: [
    {
      path: 'overview',
      component: () => import('@/views/billing/overview/index'),
      name: 'BillingOverview',
      meta: { title: '对账统计', icon: 'el-icon-data-analysis', roles: ['operator'] }
    },
    {
      path: 'orders',
      component: () => import('@/views/billing/orders/index'),
      name: 'BillingOrders',
      meta: { title: '账单列表', icon: 'el-icon-notebook-2', roles: ['operator'] }
    }]
}

export default organizationRouter
