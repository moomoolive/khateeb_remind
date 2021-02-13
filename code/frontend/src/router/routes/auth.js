import login from '@/views/auth/main.vue'

const commonMeta = {
    meta: {
        noSiteBanner: true
    }
}

export default [
    {
        path: "/",
        name: "login",
        component: login,
        ...commonMeta
    },
    {
        path: "/create/institutions",
        name: "institutionSignup",
        component: () => import('@/views/auth/institutions.vue'),
        ...commonMeta
    },
    {
        path: "/create/khateebs",
        name: "khateebsSignup",
        component: () => import('@/views/auth/khateebs.vue'),
        ...commonMeta
    },
    {
        path: "/forgot/:type",
        name: "accountRecovery",
        component: () => import('@/views/auth/accountRecovery.vue'),
        ...commonMeta
    }
]