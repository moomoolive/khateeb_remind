import state from './state'

export default {
    urgentNotifications() {
        return state.notificationsFromServer.filter(note => !note.seen || note.actionPerformed === false) //should be actions performed
    }
}