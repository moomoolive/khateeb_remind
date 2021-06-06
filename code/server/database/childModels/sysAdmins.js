const mongoose = require('mongoose')

const users = require($rootDir + "/database/models/users.js")

const sysAdmin = new mongoose.Schema(
    {}
, { timestamps: true })

module.exports = users.discriminator('sysAdmin', sysAdmin)