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
                component: () => import ('../views/adminPages/scheduleSetter.vue')
              }
        ],
        meta: {
            requireAuthorization: true
        }
    }
]

export default adminRoutes