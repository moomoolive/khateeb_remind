import Home from '@/views/users/Home.vue'

export default [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/announcements',
        name: 'announcements',
        component: () => import (/* webpackPrefetch: true */ '@/views/users/announcements.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import ('@/views/users/login.vue')
    }
]