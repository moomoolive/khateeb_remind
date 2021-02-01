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
                    authLevel: 4
                }
            },
            {
                path: 'roaming',
                component: () => import('@/views/sysAdmin/subroutes/roaming.vue'),
                meta: {
                    requireAuthorization: true,
                    authLevel: 4
                }
            }
        ],
        meta: {
            requireAuthorization: true,
            authLevel: 4
        }
    }
]