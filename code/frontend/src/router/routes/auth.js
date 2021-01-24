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
        path: "/create/root",
        name: "createRoot",
        component: () => import('@/views/auth/root.vue')
    },
    {
        path: "/create/khateebs",
        name: "khateebsSignup",
        component: () => import('@/views/auth/khateebs.vue')
    }
]