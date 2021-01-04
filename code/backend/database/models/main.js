import mongoose from 'mongoose'

import schema from '../schematics/index.js'
import helpers from './helpers.js'

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
    announcements: mongoose.model('announcement', schema.announcement),
    monthlySchedules: mongoose.model('monthlySchedule', schema.scheduleEntry),
    khateebs: mongoose.model('khateeb', schema.khateeb),
    locationTemplate: mongoose.model('template', schema.location),
    prayerSlot: mongoose.model('prayerSlot', schema.prayerSlot),
    schemaParams(schemaName, full=false) {
        console.log(schemaName)
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
    schemasPlus(schemaName) {
        let schemas = helpers.fetchSchemaModels(schemaName)
        const CSchemas = helpers.findChildSchemas(schemaName)
        if (schemas.child.length > 0) {
            for (let x = 0; x < CSchemas.length; x++) {
                const parent = schemas.parent[CSchemas[x]]
                const child = schemas.child[0]
                helpers.createEmptySchema(parent, child)
            }
        }
        if (typeof(schemas.parent.__t) === 'string') schemas.parent.__t = schemaName
        return schemas.parent
    }
}

export default models