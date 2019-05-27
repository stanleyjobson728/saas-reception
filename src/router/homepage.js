import Layout from '@/views/layout/Layout'

export default {
  path: '/homepage',
  component: Layout,
  redirect: '/homepage/index',
  name: 'Homepage',
  meta: { title: '首页', icon: 'homepage' },
  children: [
    {
      path: 'homepage',
      name: 'Homepage',
      component: () => import('@/views/homepage/homepage'),
      meta: { title: '首页', icon: 'table' }
    }
  ]
}
