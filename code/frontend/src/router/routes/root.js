export default [
    {
        path: '/root',
        name: "rootMain",
        component: () => import('@/views/root/dashboard.vue'),
        children: [
            {
                path: 'cli',
                component: () => import('@/views/root/cli.vue'),
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