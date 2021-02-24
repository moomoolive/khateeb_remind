const adminRoutes = [
    {
        path: '/institutionAdmin',
        name: 'institutionAdminMain',
        component: () => import('@/views/institutionAdmin/main.vue'),
        children: [
              {
                path: 'schedule',
                component: () => import('@/views/institutionAdmin/subroutes/schedule.vue'),
                meta: {
                  auth: { min: 2, max: 3 }
                }
              },
              {
                path: 'create-others',
                component: () => import('@/views/rootInstitutionAdmin/institutionAdminViewer.vue'),
                meta: {
                  auth: { level: 3 }
                }
              },
              {
                path: 'announcements',
                component: () => import('@/views/institutionAdmin/subroutes/announcements.vue'),
                meta: {
                    auth: { min: 2, max: 3 }
                }
              },
              {
                path: 'khateebs',
                component: () => import('@/views/institutionAdmin/subroutes/khateebs.vue'),
                meta: {
                    auth: { min: 2, max: 3 }
                }
              },
              {
                path: 'settings',
                component: () => import('@/views/institutionAdmin/subroutes/settings/main.vue'),
                meta: {
                  auth: { min: 2, max: 3 }
                }
              }
        ],
        meta: {
            auth: { min: 2, max: 3 }
        }
    }
]

export default adminRoutes