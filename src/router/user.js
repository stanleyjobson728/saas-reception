import Layout from '@/views/layout/Layout'

export default {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'User',
  meta: { title: '用户', icon: 'peoples' },
  children: [
    {
      path: 'list',
      name: 'User',
      component: () => import('@/views/user/list'),
      meta: { title: '用户管理', icon: 'people' }
    },
    {
      path: 'tree',
      name: 'Tree',
      component: () => import('@/views/tree/index'),
      meta: { title: 'Tree', icon: 'tree' }
    }
  ]
}
