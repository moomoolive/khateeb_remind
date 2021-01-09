module.exports = {
    expirationDate(expiresAfter) {
        const secsPerMin = 60
        const minPerHour = 60
        const hourPerDay = 24
        const decoded = expiresAfter.split('-')
        let expirationDate
        switch(decoded[1]) {
            case 'days':
                expirationDate = decoded[0] * secsPerMin * minPerHour * hourPerDay
                break
            case 'minutes':
                expirationDate = decoded[0] * secsPerMin
                break
        }
        return expirationDate
    }
}