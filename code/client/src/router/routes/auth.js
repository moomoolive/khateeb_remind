import login from '@/views/auth/main.vue'

const commonMeta = {
    meta: {
        noSiteBanner: true
    }
}

export default [
    {
        path: "/login",
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
        path: "/forgot/username",
        name: "forgotUsername",
        component: () => import('@/views/auth/forgotUsername.vue'),
        ...commonMeta
    },
    {
        path: "/forgot/password",
        name: "forgotPassword",
        component: () => import('@/views/auth/forgotPassword.vue'),
        ...commonMeta
    },
    {
        path: "/institution-selection",
        name: "institutionSelection",
        component: () => import('@/views/auth/institutionSelection.vue'),
        ...commonMeta
    }
]