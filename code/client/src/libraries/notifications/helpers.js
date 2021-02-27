import store from '@/store/index.js'

const createNotification = (info) => {
    return store.dispatch('notifications/create', info)
}

export default {
    createNotification
}