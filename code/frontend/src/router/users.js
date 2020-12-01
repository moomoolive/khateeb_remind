import Home from '../views/Home.vue'

export default [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        component: () => import ('../views/about.vue')
    },
    {
        path: '/announcements',
        name: 'announcements',
        component: () => import ('../views/announcements.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import ('../views/login.vue')
    }
]