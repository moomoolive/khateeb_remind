export default [
    {
        path: '/root',
        name: "rootMain",
        component: () => import('@/views/root/dashboard.vue'),
        children: [
            {
                path: 'cli',
                component: () => import('@/views/root/subroutes/cli.vue'),
                meta: {
                    requireAuthorization: true,
                    authLevel: 4
                }
            },
            {
                path: 'roaming',
                component: () => import('@/views/root/subroutes/roaming.vue'),
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