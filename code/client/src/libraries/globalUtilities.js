import stringHelpers from '@/libraries/stringOperations/main.js'
import dateTimeHelpers from '@/libraries/dateTime/main.js'

export default {
    deepCopy(item) {
        return JSON.parse(JSON.stringify(item))
    },
    stringFormat(string, format='camel', outputCase='title', raw=false) {
        const casedArray = stringHelpers[format + `CaseToArray`](string)
        return stringHelpers.arrayToString(casedArray, outputCase, raw)
    },
    isNumeric(value) {
        return /^\d+$/.test(value)
    },
    dynamicDisplayDate(date) {
        const displayDate = new Date(date)
        const base = displayDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        if (displayDate.getTime() > dateTimeHelpers.daysInThePast(0).getTime())
            return base
        if (displayDate.getTime() > dateTimeHelpers.daysInThePast(1).getTime())
            return `Yesterday ${base}`
        if (displayDate.getTime() > dateTimeHelpers.daysInThePast(5).getTime())
            return `${displayDate.toLocaleString('en-US', { weekday: 'short' })} ${base}`
        return `${displayDate.toLocaleDateString('en-US')} ${base}`
    }
}