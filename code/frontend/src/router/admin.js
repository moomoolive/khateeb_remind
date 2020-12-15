const adminRoutes = [
    {
        path: '/admin/:institute',
        name: 'admin',
        component: () => import('../views/adminPages/admin.vue'),
        children: [
              {
                path: 'dashboard',
                component: () => import('../views/adminPages/dashboard.vue')
              },
              {
                path: 'schedule',
                component: () => import('../views/adminPages/schedule.vue')
              },
              {
                path: 'announcements',
                component: () => import('../views/adminPages/announcements.vue')
              },
              {
                path: 'khateebs',
                component: () => import('../views/adminPages/khateebs.vue')
              },
              {
                path: 'settings',
                component: () => import('../views/adminPages/settings.vue')
              }
        ],
        meta: {
            requireAuthorization: true
        }
    }
]

export default adminRoutes