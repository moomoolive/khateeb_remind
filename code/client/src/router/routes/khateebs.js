import home from '@/views/khateebs/schedule.vue'

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
    }
]