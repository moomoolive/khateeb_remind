const adminRoutes = [
    {
        path: '/admin/:institute',
        name: 'admin',
        component: () => import('@/views/admin/main.vue'),
        children: [
              {
                path: 'dashboard',
                component: () => import('@/views/admin/subroutes/dashboard.vue')
              },
              {
                path: 'schedule',
                component: () => import('@/views/admin/subroutes/schedule.vue')
              },
              {
                path: 'announcements',
                component: () => import('@/views/admin/subroutes/announcements.vue')
              },
              {
                path: 'khateebs',
                component: () => import('@/views/admin/subroutes/khateebs.vue')
              },
              {
                path: 'settings',
                component: () => import('@/views/admin/subroutes/settings.vue')
              }
        ],
        meta: {
            requireAuthorization: true
        }
    }
]

export default adminRoutes