const mongoose = require('mongoose')

const schema = require('./schematics/index.js')
const helpers = require('./helpers.js')

const models = {
    jummahs: mongoose.model('jummah', schema.jummah),
    institutions: mongoose.model('institution', schema.institution),
    timings: mongoose.model('timing', schema.timing),
    locations: mongoose.model('location', schema.location),
    users: mongoose.model('user', schema.user),
    profiles: mongoose.model('profile', schema.profile),

    //old models
    settings: mongoose.model('setting', schema.setting),
    locationAndTimings: schema.settings.discriminator(
        'locationAndTimings',
        schema.locationAndTiming
    ),
    password: schema.settings.discriminator(
        'password',
        schema.password
    ),
    textPhone: schema.settings.discriminator(
        'textPhone',
        schema.textPhone
    ),
    adminProfile: schema.settings.discriminator(
        'adminProfile',
        schema.admin
    ),
    textAPI: schema.settings.discriminator(
        'textAPI',
        schema.textAPI
    ),
    timezone: schema.settings.discriminator(
        'timezone',
        schema.timezone
    ),
    textFunctionality: schema.settings.discriminator(
        'textFunctionality',
        schema.textFunctionality
    ),
    textHub: mongoose.model('textHub', schema.textHub),
    announcements: mongoose.model('announcement', schema.announcement),
    schemaParams(schemaName, full=false) {
        const fullSchemaParams = Object.keys(this[schemaName].schema.paths)
        if (!full) {
            const notFull = fullSchemaParams.filter((param) => {
                return param !== '__v' && param !== '_id' && param !== 'savedOn'
            })
            return notFull
        } else return fullSchemaParams
    },
    emptySchema(schemaName) {
        const fullSchemaParams = this[schemaName].schema.paths
        let schema = {}
        for (let param in fullSchemaParams) {
            if (param !== '__v' && param !== '_id' && param !== 'savedOn') {
                const paramList = param.split('.')
                const paramObject = fullSchemaParams[param]
                console.log(paramObject)
                if (paramList.length > 1) {
                    if (!schema[paramList[0]]) schema[paramList[0]] = {}
                    schema[paramList[0]][paramList[1]] = helpers.fillSchemaField(paramObject.instance)
                } else {
                    if (paramObject.defaultValue)
                        schema[param] = paramObject.defaultValue
                    else 
                        schema[param] = helpers.fillSchemaField(paramObject.instance)
                }
            }
        }
        return schema
    },
    fetchSchemaModels(schemaName) {
        return {
            parent: this.emptySchema(schemaName),
            child: this[schemaName].schema.childSchemas
        }
    },
    findChildSchemas(topLevelParent) {
        let CSchemas = []
        const parentParams = this[topLevelParent].schema.paths
        for (let field in parentParams) {
            if (parentParams[field].caster) {
                CSchemas.push(field)
            }
        }
        return CSchemas
    },
    schemasPlus(schemaName) {
        let schemas = this.fetchSchemaModels(schemaName)
        const CSchemas = this.findChildSchemas(schemaName)
        if (schemas.child.length > 0) {
            for (let x = 0; x < CSchemas.length; x++) {
                const parent = schemas.parent[CSchemas[x]]
                const child = schemas.child[0]
                helpers.createEmptySchema(parent, child)
            }
        }
        if (typeof(schemas.parent.__t) === 'string') schemas.parent.__t = schemaName
        return schemas.parent
    },
    previousEntriesAndEmptySchema(schemaName, fields='all', specialEmptySchema=null) {
        if (fields === 'all')
            fields = null
        return new Promise((resolve, reject) => {
            this[schemaName].find({}, (err, previousEntries) => {
                if (err) {
                    console.log(err)
                    reject()
                } else {
                    const emptySchema = specialEmptySchema ? specialEmptySchema() : this.schemasPlus(schemaName)
                    resolve({
                        emptySchema,
                        previousEntries
                    }) 
                }
            }).select(fields)
        })
    }
}

const discriminators = {
    khateebs: models.profiles.discriminator('khateeb', schema.khateeb),
    sysAdmins: models.profiles.discriminator('sysAdmin', schema.sysAdmin),
    institutionAdmins: models.profiles.discriminator('institutionAdmin', schema.institutionAdmin)
}

const schemas = {
    emptyEntry(modelName) {
        const emptySchema = {}
        let schemaData
        try {
            schemaData = models[modelName].schema.paths
        } catch {
            schemaData = schema[modelName].paths
        }
        for (let [fieldName, details] of Object.entries(schemaData)) {
            if (typeof details.defaultValue !== 'undefined' || fieldName !== '_id')
                emptySchema[fieldName] = details.defaultValue
        }
        return emptySchema
    }
}

module.exports = { ...models, ...schemas, ...discriminators }