export default [
    {
        path: '/user',
        name: 'userHome',
        component: () => import('@/views/user/home.vue'),
        meta: {
            auth: { min: 1 }
        }
    },
    {
        path: '/notification-subscriptions',
        name: 'notificationSubscriptions',
        component: () => import('@/views/user/notificationSubscriptions.vue'),
        meta: {
            auth: { min: 1 }
        }
    },
    {
        path: '/authorizations',
        name: 'userAuthorizations',
        component: () => import('@/views/user/authorizations.vue'),
        meta: {
            auth: { level: 1 }
        }
    }
]