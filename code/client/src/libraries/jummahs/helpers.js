const createPrayerPreferences = () => {
    const preferences = []
    const prayerSlot = {
        notified: false,
        confirmed: false,
        responded: false,
        khateebID: 'TBD'
    }
    const maxKhateebPreferences = 3
    for (let i = 0; i < maxKhateebPreferences; i++)
        preferences.push({ ...prayerSlot })
    return preferences
}

const createJummah = (location={}, timing={}, date=new Date()) => {
    const utcDate = new Date(date)
    utcDate.setUTCHours(12, 0, 0, 0)
    const khateebPreference = createPrayerPreferences()
    return {
        institutionID: location.institutionID,
        locationID: location._id,
        timingID: timing._id,
        date: utcDate.toISOString(),
        confirmed: false,
        khateebPreference
    }

}

export default {
    createJummah
}