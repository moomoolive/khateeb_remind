import login from '@/views/auth/main.vue'
import institutionSignUp from '@/views/auth/institutions.vue'

export default [
    {
        path: "/",
        name: "login",
        component: login
    },
    {
        path: "/institutions",
        name: "institutionSignUp",
        component: institutionSignUp
    }
]