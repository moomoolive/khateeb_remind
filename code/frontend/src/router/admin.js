const adminRoutes = [
    {
        path: '/admin/:institute',
        name: 'admin',
        component: () => import('../views/adminPages/admin.vue'),
        children: [
              {
                path: 'dashboard',
                component: () => import('../views/adminPages/adminDashboard.vue')
              },
              {
                path: 'schedule',
                component: () => import('../views/adminPages/scheduleSetter.vue')
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
                path: 'location-settings',
                component: () => import('../views/adminPages/locationSettings.vue')
              }
        ],
        meta: {
            requireAuthorization: true
        }
    }
]

export default adminRoutes