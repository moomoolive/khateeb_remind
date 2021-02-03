export default [
    {
        path: '/user',
        name: 'userHome',
        component: () => import('@/views/user/home.vue'),
        meta: {
            requireAuthorization: true,
            authLevel: 1
        }
    },
    {
        path: '/user/notifications',
        name: 'userHome',
        component: () => import('@/views/user/notifications.vue'),
        meta: {
            requireAuthorization: true,
            authLevel: 1
        }
    }
]