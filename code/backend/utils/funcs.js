const friday = 5

const JSdateRef = {
    daysOfWeek: [
        "Sunday","Monday","Tuesday","Wednesday",
        "Thursday","Friday","Saturday"
    ],
    months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
}

module.exports = {
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    },
    deepCopy(object) {
        return JSON.parse(JSON.stringify(object))
    },
    stringsToSentence(...strings) {
        return strings.reduce((total, elem) => {
            const x = total.split('\n')
            const lastCharacterIsNewline = !x[x.length - 1]
            if (lastCharacterIsNewline)
                return `${total}${elem}`
            return `${total} ${elem}`
        })
    },
    dateStringToAMPM(dateString) {
        const date = new Date(dateString)
        const hour = this.intHoursToString(date.getHours())
        const min = this.intMinsToString(date.getMinutes())
        const AMorPM = this.intHoursToAMorPM(date.getHours())
        return `${hour}:${min}${AMorPM}`
    },
    intMinsToString(intMins) {
        return intMins < 10 ? '0' + intMins : `${intMins}`
    },
    intHoursToString(intHours) {
        return intHours < 12 ? `${intHours}` : `${intHours - 12}`
    },
    intHoursToAMorPM(intHours) {
        return intHours < 12 ? 'AM' : `PM`
    },
    monthStringToNumber(monthString) {
        const x = this.capitalize(monthString)
        let returnIndex = -1
        JSdateRef.months.forEach((month, index) => {
            if (x === month || x === month.slice(0, 3))
                returnIndex = index
        })
        return returnIndex
    },
    dayOfWeekStringToNumber(dayOfWeekString) {
        const x = this.capitalize(dayOfWeekString)
        let returnIndex = -1
        JSdateRef.daysOfWeek.forEach((dayOfWeek, index) => {
            if (x === dayOfWeek || x === dayOfWeek.slice(0, 3)) 
                returnIndex = index
        })
        return returnIndex
    },
    generateRandomNumber(numberOfDigits=6) {
        const x = numberOfDigits === 1 ? 0 : numberOfDigits;
        return Math.round(Math.random() * Math.pow(10, x)) 
    },
    findUpcomingFriday(date=new Date()) {
        while (date.getDay() !== friday) {
            date.setDate(date.getDate() + 1)
        }
        return date
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