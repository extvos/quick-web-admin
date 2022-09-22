// Routing table for Information
import Layout from '@/layout/Default'

const schoolRouter = {
  path: '/school',
  component: Layout,
  redirect: 'noredirect',
  name: '校园管理',
  meta: {
    title: '校园管理',
    icon: 'el-icon-school',
    roles: ['operate']
  },
  children: [
    {
      path: 'grade',
      component: () => import('@/views/schools/grades/index'),
      name: 'GradeIndex',
      meta: { title: '班级管理', icon: 'el-icon-house', roles: ['operate'] },
      children: [
        {
          path: 'edit/:id',
          component: () => import('@/views/schools/grades/edit'),
          name: 'GradeEdit',
          meta: { title: '班级编辑', icon: 'el-icon-house', roles: ['operate'], noTab: true },
          hidden: true
        }
      ]
    },
    {
      path: 'list',
      component: () => import('@/views/schools/students/index'),
      name: 'StudentList',
      meta: { title: '学生管理', icon: 'el-icon-user', roles: ['operate'] }
    }]
}

export default schoolRouter
