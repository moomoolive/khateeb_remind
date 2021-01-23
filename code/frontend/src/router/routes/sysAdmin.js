const sysAdminExt = '/sysAdmin'

export default [
    {
        path: sysAdminExt + '/',
        name: "sysAdminDashboard",
        component: () => import('@/views/sysAdmin/dashboard.vue')
    },
    {
        path: sysAdminExt + '/cli',
        name: 'cloudCLI',
        component: () => import('@/views/sysAdmin/cli.vue')
    }
]