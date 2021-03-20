const job = async () => {
    try {
        
        console.log(`Set jummah notifications!`)
    } catch(err) {
        console.log(err)
        console.log(`Couldn't set notifications!`)
    }
}

const cronWrapper = require(global.$dir + '/cron/cronWrapper.js')

// every wednesday and thursday 6AM
const cron = (time='00 00 6 * * 3-4', syncWithTimezone=true) => {
    const options = {
        time, 
        syncWithTimezone,
        job
    }
    return cronWrapper(options)
}

module.exports = cron