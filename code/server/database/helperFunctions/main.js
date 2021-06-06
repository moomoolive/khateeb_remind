const users = require($rootDir + "/database/models/users.js")
const sysAdmins = require($rootDir + "/database/childModels/sysAdmins.js")
const rootUser = require($rootDir + "/database/childModels/rootUser.js")

function dynamicUserModel(modelName="users") {
    switch(modelName) {
        case "root":
            return rootUser
        case "sysAdmins":
            return sysAdmins
        default:
            return users
    }
}

module.exports = {
    dynamicUserModel
}