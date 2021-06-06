const mongoose = require('mongoose')

const user = require('./schemas/user.js')

// discriminators --> basically a schema that inherits and extends any of the
// above schemas

// users
const root = require('./discriminators/rootUser.js')
const sysAdmin = require('./discriminators/sysAdmin.js')

const models = {
    users: mongoose.model('user', user)
}

const userDiscriminators = {
    root: models.users.discriminator('root', root),
    sysAdmins: models.users.discriminator('sysAdmin', sysAdmin),
}

module.exports = { 
    ...models, 
    ...userDiscriminators
}