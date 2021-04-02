import datetime from '@/libraries/dateTime/main.js'

const timingDisplay = ({ minute=50, hour=12 }) => {
    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit' })
}

const chronTiming = ({ dayofWeek=3, minute=50, hour=12 }) => {
    let date = new Date()
    date = datetime.setDayOfWeek(date, dayofWeek)
    date.setHours(hour, minute, 0, 0)
    return date
}

export default {
    timingDisplay,
    chronTiming
}