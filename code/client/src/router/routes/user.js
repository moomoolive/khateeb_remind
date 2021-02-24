export default [
    {
        path: '/user',
        name: 'userHome',
        component: () => import('@/views/user/home.vue'),
        meta: {
            auth: { greaterThanOrEqual: 1 }
        }
    },
]