export default {
    saveDateOfEntry(toBeSaved) {
        toBeSaved.savedOn = new Date().toUTCString()
    }
}