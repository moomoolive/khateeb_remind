import home from '@/views/khateebs/schedule.vue'
import confirm from '@/views/khateebs/jummahConfirm.vue'

export default [
    {
        path: '/khateeb',
        name: 'khateeb-home',
        component: home,
        meta: {
            requireAuthorization: true,
            authLevel: 1
        }
    },
    {
        path: '/khateeb/announcements',
        name: 'announcements',
        component: () => import ('@/views/khateebs/announcements.vue'),
        meta: {
            requireAuthorization: true,
            authLevel: 1
        }
    }, 
    {
        path: '/jummah/confirm/:jummahID/:notificationID',
        component: confirm,
        meta: {
            requireAuthorization: true,
            authLevel: 1
        }
    }
]