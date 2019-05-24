import Layout from '@/views/layout/Layout'

export default {
  path: '/program',
  component: Layout,
  redirect: '/program/index',
  name: 'Program',
  meta: { title: '应用管理', icon: 'example' },
  children: [
    {
      path: 'program',
      name: 'Program',
      component: () => import('@/views/program/programList'),
      meta: { title: '应用管理', icon: 'table' }
    }
  ]
}
