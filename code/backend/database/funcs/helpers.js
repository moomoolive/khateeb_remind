module.exports = {
    saveDateOfEntry(toBeSaved) {
        toBeSaved.savedOn = new Date().toUTCString()
    }
}