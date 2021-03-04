const mongoose = require('mongoose')

const institution = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    abbreviatedName: {
        type: String,
        required: false,
        default: '__NO-ABBREVIATED-NAME__'
    },
    timezone: {
        type: String,
        required: true,
        minlength: 1
    },
    confirmed: {
        type: Boolean,
        required: false,
        default: false
    },
    country: {
        type: String,
        required: true,
        minlength: 1
    },
    state: {
        type: String,
        required: false,
        minlength: 1
    }
},
{ timestamps: true })

institution.methods.deleteDependencies = async function() {
    const deleteRes = {}
    try {
        const models = Object.keys($db)
        for (let i = 0; i < models.length; i++) {
            const model = models[i]
            if (model === 'institutions')
                continue
            deleteRes[model] = await $db[model].deleteMany({ institutionID: req.headers.institutionid })
        }
    } catch(err) {
        console.log(err)
    }
    return deleteRes
}

institution.methods.createRootAdministrator = async function(administratorInfo) {
    administratorInfo.institutionID = this._id.toString()
    try {
        const adminEntry = await new $db.rootInstitutionAdmins(administratorInfo).save()
        return adminEntry
    } catch(err) {
        console.log(err)
    }
}

module.exports = institution