const helpers = require('./helpers.js')

const findUpcomingFridayDBFormat = () => {
    const friday = new Date(helpers.findUpcomingFriday().toISOString())
    friday.setUTCHours(12, 0, 0, 0)
    return friday
}

module.exports = {
    findUpcomingFriday: helpers.findUpcomingFriday,
    findUpcomingFridayDBFormat
}