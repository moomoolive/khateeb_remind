import mongoose from 'mongoose'

import schema from './schematics/index.js'

const helpers = {
    fillSchemaField(dataType, mixed = {}) {
        let x = null
        switch(dataType) {
            case 'String':
                x = ''
                break;
            case 'Number':
                x = '0'
                break;
            case 'Mixed':
                x = mixed
                break;
            case 'Array':
                x = []
                break;
        }
        return x
    },
    createEmptyParentSchema(parent, child) {
        const schemaObject = child.schema.obj
        if (Array.isArray(parent)) {
            parent.push(schemaObject)
        } else parent = [schemaObject]
    },
    fetchSchemaModels(schemaName) {
        return {
            parent: models.emptySchema(schemaName),
            child: schema[schemaName].schema.childSchemas
        }
    },
    fillInChild(keys, parent, field, child) {
        let childSchemaField = parent[0] ? parent[0] : parent
        for (let x = 0; x < keys.length; x++) {
            const finalLevel = x + 1 === keys.length
            if (finalLevel) {
                let dataType = child.schema.paths[field].instance
                if (dataType !== 'ObjectID') {
                    if (keys[x] === 'AMorPM')  childSchemaField[keys[x]] = 'PM'
                    else if (keys[x] === 'hour')  childSchemaField[keys[x]] = 12
                    else if (keys[x] === 'minutes')  childSchemaField[keys[x]] = '00'
                    else childSchemaField[keys[x]] = this.fillSchemaField(dataType)
                }
            } else {
                childSchemaField = childSchemaField[keys[x]]
            }
        }
    },
    createEmptyChildSchema(parent, child) {
        const schemaDetails = child.schema.paths
        for (let field in schemaDetails) {
            const arrayOfKeys = field.split('.')
            const onlyOneKeyDeep =  arrayOfKeys.length === 1
            const childSchemaExists = schemaDetails[field].schema
            if (onlyOneKeyDeep && childSchemaExists) {
                let deeperParent = Array.isArray(parent) ? parent[0][arrayOfKeys[0]] : parent[arrayOfKeys[0]]
                deeperParent.pop()
                let deeperChild = schemaDetails[arrayOfKeys[0]]
                this.createEmptySchema(deeperParent, deeperChild)
            } else {
                this.fillInChild(arrayOfKeys, parent, field, child)
            }
        }
    },
    createEmptySchema(parent, child) {
        this.createEmptyParentSchema(parent, child)
        this.createEmptyChildSchema(parent, child)
    },
    findChildSchemas(topLevelParent) {
        let CSchemas = []
        const parentParams = schema[topLevelParent].schema.paths
        for (let field in parentParams) {
            if (parentParams[field].caster) {
                CSchemas.push(field)
            }
        }
        return CSchemas
    }
}

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
            console.log(fullSchemaParams)
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