const timingDisplay = ({ minute=50, hour=12 }) => {
    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit' })
}

export default {
    timingDisplay
}