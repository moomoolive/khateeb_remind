module.exports = {
    isNumeric(value) {
        return /^\d+$/.test(value)
    },
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    },
    deepCopy(object) {
        return JSON.parse(JSON.stringify(object))
    },
    generateRandomNumber(numberOfDigits=6) {
        const x = numberOfDigits === 1 ? 0 : numberOfDigits;
        return Math.round(Math.random() * Math.pow(10, x)) 
    },
    cronTime(secs="*", mins="*", hours="*", date="*", month="*", dayOfWeek="*") {
        const time = {
            secs,
            mins,
            hours,
            date,
            month,
            dayOfWeek
        }
        const cronTime = []
        for (const [key, value] of Object.entries(time)) {
            let splitVal = value.toString().split(' ')
            splitVal = splitVal.map(val => {
                if (key === 'dayOfWeek' || key === 'month')
                    return this.cronDayOfWeekMonth(val, key)
                else return this.toCronSyntax(val)
            })
            splitVal.forEach((elem, index) => {
                if (elem === '-') {
                    const beforeVal = parseInt(splitVal[index - 1])
                    const afterVal = parseInt(splitVal[index + 1])
                    console.log(beforeVal, afterVal)
                    if (beforeVal > afterVal)
                        [splitVal[index - 1], splitVal[index + 1]] = [splitVal[index + 1], splitVal[index - 1]]
                }
            })
            cronTime.push(splitVal.reduce((total, elem) => total + elem))
        }
        return cronTime.reduce((total, elem) => `${total} ${elem}`)
    },
    cronDayOfWeekMonth(value, key) {
        if (typeof(value) !== 'string')
            return value
        const x = this[key + 'StringToNumber'](value)
        return x !== -1 ? x : this.toCronSyntax(value)
    },
    toCronSyntax(value) {
        switch(value) {
            case 'to':
                return '-'
            case 'every':
                return '*/'
            case 'and':
                return ','
            case 'all':
                return '*'
            default:
                return value
        } 
    }
}