import login from '@/views/auth/main.vue'

export default [
    {
        path: "/",
        name: "login",
        component: login
    },
    {
        path: "/create/institutions",
        name: "institutionSignup",
        component: () => import('@/views/auth/institutions.vue')
    },
    {
        path: "/create/khateebs",
        name: "khateebsSignup",
        component: () => import('@/views/auth/khateebs.vue')
    },
    {
        path: "/forgot/:type",
        name: "accountRecovery",
        component: () => import('@/views/auth/accountRecovery.vue')
    }
]