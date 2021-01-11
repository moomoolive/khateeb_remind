const mongoose = require('mongoose')

const schema = require('./schematics/index.js')
const helpers = require('./helpers.js')

const models = {
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
    announcements: mongoose.model('announcement', schema.announcement),
    monthlySchedules: mongoose.model('monthlySchedule', schema.scheduleEntry),
    khateebs: mongoose.model('khateeb', schema.khateeb),
    locationTemplate: mongoose.model('template', schema.location),
    prayerSlot: mongoose.model('prayerSlot', schema.prayerSlot),
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
                if (paramList.length > 1) {
                    if (!schema[paramList[0]]) schema[paramList[0]] = {}
                    schema[paramList[0]][paramList[1]] = helpers.fillSchemaField(paramObject.instance)
                } else {
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

module.exports = models