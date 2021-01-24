export default [
    /*
    {
        path: khateebsExt + '/',
        name: 'home',
        component: Home
    }, */
    {
        path: '/khateeb/', // temp
        name: 'announcements',
        component: () => import (/* webpackPrefetch: true */ '@/views/khateebs/announcements.vue'),
        meta: {
            requireAuthorization: true,
            authLevel: 1
        }
    }
]