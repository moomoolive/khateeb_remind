import home from '@/views/khateebs/schedule.vue'

export default [
    {
        path: '/khateeb',
        name: 'khateebHome',
        component: home,
        meta: {
            auth: { level: 1 }
        }
    },
    {
        path: '/khateeb/announcements',
        name: 'khateebAnnouncements',
        component: () => import('@/views/khateebs/announcements.vue'),
        meta: {
            auth: { level: 1 }
        }
    },
    {
        path: '/khateeb/my-khutbahs',
        name: 'myKhutbahs',
        component: () => import('@/views/khateebs/myKhutbahs.vue'),
        meta: {
            auth: { level: 1 }
        }
    },
    {
        path: '/khateeb/availability',
        name: 'khateebAvailability',
        component: () => import('@/views/khateebs/availability.vue'),
        meta: {
            auth: { level: 1 }
        }
    }
]