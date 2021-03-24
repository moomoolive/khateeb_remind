const { cronWrapper } = require(global.$dir + '/libraries/cron/main.js')
const scripts = require(global.$dir + '/libraries/scripts/main.js')

module.exports = cronWrapper({ job: scripts.createTestInstitution })