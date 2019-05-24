import Layout from '@/views/layout/Layout'

export default {
  path: '/client',
  component: Layout,
  redirect: '/client/index',
  name: 'Client',
  meta: { title: '客户端', icon: 'example' },
  children: [
    {
      path: 'client',
      name: 'Client',
      component: () => import('@/views/client/clientList'),
      meta: { title: '客户端管理', icon: 'table' }
    },
    {
      path: 'permission',
      name: 'Permission',
      component: () => import('@/views/client/index'),
      meta: { title: '权限管理', icon: 'lock' }
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/roles/index'),
      meta: { title: '角色管理', icon: 'user' }
    },
    {
      path: 'resource',
      name: 'Resource',
      component: () => import('@/views/resource/index'),
      meta: { title: '资源管理', icon: 'nested' }
    }/*,
    {
      path: 'clientRoleList',
      name: 'ClientRoleList',
      component: () => import('@/views/client/clientRoleList'),
      meta: { title: 'ClientRoleList', icon: 'table' }
    } */
  ]
}
