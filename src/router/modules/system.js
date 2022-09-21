// Routing table for Settings
import Layout from '@/layout/Default'

const systemRouter = {
  path: '/settings',
  component: Layout,
  redirect: 'noredirect',
  name: 'Settings',
  meta: {
    title: '系统设置',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'sysusers',
      component: () => import('@/views/system/users/index'),
      name: 'SysUserList',
      meta: { title: '系统用户', icon: 'el-icon-user-solid', roles: ['admin'] }
    },
    {
      path: 'sysroles',
      component: () => import('@/views/system/roles/index'),
      name: 'SysRoleList',
      meta: { title: '系统角色', icon: 'el-icon-s-management', roles: ['admin'] }
    },
    {
      path: 'syspermissions',
      component: () => import('@/views/system/permissions/index'),
      name: 'SysPermissionList',
      meta: { title: '系统权限', icon: 'el-icon-s-ticket', roles: ['admin'] }
    },
    {
      path: 'options',
      component: () => import('@/views/system/settings/index'),
      name: 'OptionSetting',
      meta: { title: '参数设置', icon: 'el-icon-s-operation', roles: ['admin'] }
    },
    {
      path: 'version',
      component: () => import('@/views/system/version'),
      name: 'VersionInfo',
      meta: { title: '版本信息', icon: 'el-icon-c-scale-to-original' }
    }]
}

export default systemRouter
