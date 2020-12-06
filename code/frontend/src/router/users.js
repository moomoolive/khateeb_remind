import Home from '../views/userPages/Home.vue'

export default [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        component: () => import ('../views/userPages/about.vue')
    },
    {
        path: '/announcements',
        name: 'announcements',
        component: () => import (/* webpackPrefetch: true */ '../views/userPages/announcements.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import ('../views/userPages/login.vue')
    }
]