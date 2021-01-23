import login from '@/views/auth/main.vue'

export default [
    {
        path: "/",
        name: "login",
        component: login
    },
    {
        path: "/institutions",
        name: "institutionSignUp",
        component: () => import('@/views/auth/institutions.vue')
    },
    {
        path: "/root",
        name: "createRoot",
        component: () => import('@/views/auth/root.vue')
    }
]