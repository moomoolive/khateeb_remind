export default [
    {
        path: '/sysAdmin',
        name: "rootMain",
        component: () => import('@/views/sysAdmin/dashboard.vue'),
        children: [
            {
                path: 'institutions',
                name: 'sysAdminInstitutionViewer',
                component: () => import('@/views/sysAdmin/subroutes/institutions.vue'),
                meta: {
                    auth: { min: 5, max: 6 }
                }
            },
            {
                path: 'settings',
                name: 'rootInstitutionSettings',
                component: () => import('@/views/sysAdmin/subroutes/settings.vue'),
                meta: {
                    auth: { min: 5, max: 6 }
                }
            }
        ],
        meta: {
            auth: { min: 5, max: 6 }
        }
    }
]