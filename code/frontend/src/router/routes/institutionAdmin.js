const adminRoutes = [
    {
        path: '/institutionAdmin',
        name: 'institutionAdminMain',
        component: () => import('@/views/institutionAdmin/main.vue'),
        /*children: [
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
                component: () => import('@/views/admin/subroutes/settings/main.vue')
              }
        ],*/
        meta: {
            requireAuthorization: true,
            authLevel: 2
        }
    }
]

export default adminRoutes