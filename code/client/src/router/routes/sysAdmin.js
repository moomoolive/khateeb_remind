export default [
    {
        path: '/sysAdmin',
        name: "rootMain",
        component: () => import('@/views/sysAdmin/dashboard.vue'),
        children: [
            {
                path: 'cli',
                component: () => import('@/views/sysAdmin/subroutes/cli.vue'),
                meta: {
                    requireAuthorization: true,
                    auth: { min: 4, max: 5 }
                }
            },
            {
                path: 'roaming',
                component: () => import('@/views/sysAdmin/subroutes/roaming.vue'),
                meta: {
                    requireAuthorization: true,
                    auth: { min: 4, max: 5 }
                }
            }
        ],
        meta: {
            requireAuthorization: true,
            auth: { min: 4, max: 5 }
        }
    }
]