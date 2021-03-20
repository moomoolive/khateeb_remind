export default {
    namespaced: true,
    state: () => ({
        display: {
            show: false,
            type: 'alert',
            options: {
                msg: 'none has been set yet',
                textSize: 'small',
                icon: 'exclamation',
                color: 'yellow'
            } 
        },
        queue: [],
        userPrompted: [],
        fromServer: [],
    }),
    mutations: {
        stashServerNotifications(state, { notifications }) {
            state.fromServer = notifications
        },
        display(state, { type, options }) {
            state.display.show = true
            state.display.type = type,
            state.display.options = options
        },
        close(state) {
            state.display.show = false
            state.queue.shift()
            // notifications without an origin are treated as user prompted
            if (state.display.options.notificationOrigin === undefined)
                state.userPrompted.shift()
        },
        addToQueue(state, notificationInfo) {
            state.queue.push(notificationInfo)
        },
        registerUserPromptedNotification(state, notificationInfo) {
            state.queue.push('__USER__')
            state.userPrompted.push(notificationInfo)
        },
        updateTargetNotification(state, { index, updatedNotification }) {
            state.fromServer[index] = updatedNotification
        }
    },
    actions: {
        updateOne({ commit }, updatedNotification) {
            const index = this.state.notifications.fromServer.findIndex(note => note._id === updatedNotification._id)
            commit('updateTargetNotification', { index, updatedNotification })
        },
        create({ commit }, notificationInfo) {
            if (notificationInfo.options.notificationOrigin !== undefined)
                return commit('addToQueue', notificationInfo)
            // user prompted notifications are special because they can only
            // put one notification on the queue at once, and after the notfication
            // is closed then they can prompt another one
            if (this.state.notifications.userPrompted.length === 0)
                commit('registerUserPromptedNotification', notificationInfo)
        }
    },
    getters: {
        unseen({ fromServer }) {
            return fromServer.filter(note => !note.seen)
        },
        urgent(state, { unseen }) {
            return unseen.filter(note => note.actionPerformed !== undefined && !note.actionPerformed)
        }
    }
}