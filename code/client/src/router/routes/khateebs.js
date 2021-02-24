import home from '@/views/khateebs/schedule.vue'
import confirm from '@/views/khateebs/jummahConfirm.vue'

export default [
    {
        path: '/khateeb',
        name: 'khateeb-home',
        component: home,
        meta: {
            auth: { min: 1, max: 3 }
        }
    },
    {
        path: '/khateeb/announcements',
        name: 'announcements',
        component: () => import ('@/views/khateebs/announcements.vue'),
        meta: {
            auth: { min: 1, max: 3 }
        }
    }, 
    {
        path: '/jummah/confirm/:jummahID/:notificationID',
        component: confirm,
        meta: {
            auth: { min: 1, max: 3 }
        }
    }
]