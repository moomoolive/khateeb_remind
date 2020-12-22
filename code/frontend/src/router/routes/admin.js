const adminRoutes = [
    {
        path: '/admin/:institute',
        name: 'admin',
        component: () => import('@/views/admin/admin.vue'),
        children: [
              {
                path: 'dashboard',
                component: () => import('@/views/admin/dashboard.vue')
              },
              {
                path: 'schedule',
                component: () => import('@/views/admin/schedule.vue')
              },
              {
                path: 'announcements',
                component: () => import('@/views/admin/announcements.vue')
              },
              {
                path: 'khateebs',
                component: () => import('@/views/admin/khateebs.vue')
              },
              {
                path: 'settings',
                component: () => import('@/views/admin/settings.vue')
              }
        ],
        meta: {
            requireAuthorization: true
        }
    }
]

export default adminRoutes