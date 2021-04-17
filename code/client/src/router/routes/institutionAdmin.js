const adminRoutes = [
    {
        path: '/institutionAdmin',
        name: 'institutionAdminMain',
        component: () => import( '@/views/institutionAdmin/main.vue'),
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
                component: () => import('@/views/institutionAdmin/subroutes/settings.vue'),
                meta: {
                  auth: { min: 2, max: 3 }
                }
              }
        ],
        meta: {
            auth: { min: 2, max: 3 }
        }
    },
    {
      path: '/institutionAdmin/locations-and-timings',
      name: 'locationsAndTimings',
      component: () => import('@/views/institutionAdmin/locationsAndTimings.vue'),
    }
]

export default adminRoutes