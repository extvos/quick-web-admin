// Routing table for Settings
import Layout from '@/layout/Default'

const settingsRouter = {
  path: '/settings',
  component: Layout,
  redirect: 'noredirect',
  name: 'Settings',
  meta: {
    title: '系统设置',
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: [
    {
      path: 'sysusers',
      component: () => import('@/views/settings/user/index'),
      name: 'SysUserList',
      meta: { title: '系统用户', icon: 'el-icon-user', roles: ['admin'] }
    },
    {
      path: 'sysroles',
      component: () => import('@/views/settings/role/index'),
      name: 'SysRoleList',
      meta: { title: '系统角色', icon: 'el-icon-paperclip', roles: ['admin'] }
    },
    {
      path: 'recognize-type',
      component: () => import('@/views/settings/reseller/index'),
      name: 'Reseller',
      meta: { title: '经销商管理', icon: 'el-icon-c-scale-to-original', roles: ['admin'] }
    },
    {
      path: 'version',
      component: () => import('@/views/settings/version/index'),
      name: 'VersionInfo',
      meta: { title: '版本信息', icon: 'el-icon-star-off' }
    }]
}

export default settingsRouter
