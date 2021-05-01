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
        meta: {
            noSiteBanner: true,
            auth: { level: 1 }
        }
    },
    {
        path: "/create/user",
        name: "khateebsSignup",
        component: () => import('@/views/auth/users.vue'),
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
        meta: {
            noSiteBanner: true,
            auth: { level: 1 }
        }
    }
]