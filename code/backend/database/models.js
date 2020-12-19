import mongoose from 'mongoose'

const schemas = {   
    scheduleEntry: new mongoose.Schema({
        month: String,
        data: Object,
        savedOn: Date
    }),
    khateeb: new mongoose.Schema({
        firstName: String,
        lastName: String,
        phoneNumber: String,
        active: String,
        email: String,
        dropouts: String,
        savedOn: Date
    }),
    announcement: new mongoose.Schema({
        headline: String,
        content: String,
        important: String,
        urgent: String,
        savedOn: Date
    }),
    setting: new mongoose.Schema({
        name: String,
        options: mongoose.Schema.Types.Mixed,
        savedOn: Date
    }),
    locationInfo: new mongoose.Schema({
        info: Object,
        timings: Array
    }),
    locationMeta: new mongoose.Schema({
        name: String,
        address: String
    }),
    timingTemplate: new mongoose.Schema({
        hour: String,
        minutes: String,
        AMorPM: String
    }),
    location: new mongoose.Schema({
        info: Object,
        timings: Array,
        monthlySchedule: Object
    }),
    prayerSlot: new mongoose.Schema({
        _id: String,
        firstName: String,
        lastName: String,
        savedOn: Date
    }),
    admin: new mongoose.Schema({
        firstName: String,
        lastName: String,
        phoneNumber: String,
        email: String,
        savedOn: Date
    }),
    locationAndTiming: new mongoose.Schema({
        options: [
            {
                info: {
                    name: String,
                    address: String
                },
                timings:[
                    {
                        hour: String,
                        minutes: String,
                        AMorPM: String
                    }
                ]
            }
        ]
    })
 }

 const discriminators = {
    settings: mongoose.model('setting', schemas.setting)
 }

 const models = {
    settings: mongoose.model('setting', schemas.setting),
    locationAndTimings: discriminators.settings.discriminator(
        'locationAndTimings',
        schemas.locationAndTiming
    ),
    x: schemas.locationAndTiming,
    announcements: mongoose.model('announcement', schemas.announcement),
    monthlySchedules: mongoose.model('monthlySchedule', schemas.scheduleEntry),
    khateebs: mongoose.model('khateeb', schemas.khateeb),
    locationDetails: mongoose.model('locationDetail', schemas.locationInfo),
    timingTemplates: mongoose.model('timingTemplate', schemas.timingTemplate),
    locationMetas: mongoose.model('locationMeta', schemas.locationMeta),
    locationTemplate: mongoose.model('template', schemas.location),
    prayerSlot: mongoose.model('prayerSlot', schemas.prayerSlot),
    admin: mongoose.model('admin', schemas.admin),
    schemaParams(schemaName, full=false) {
        const fullSchemaParams = Object.keys(this[schemaName].schema.paths)
        if (!full) {
            for (let param in fullSchemaParams) {
                let x = fullSchemaParams[param]
                if (x == '__v' || x == 'savedOn') {
                    fullSchemaParams.splice(param, 1)
                }
            }
            const IDParam = fullSchemaParams.pop()
        }
        return fullSchemaParams
    },
    emptySchema(schemaName, mixed = {}) {
        const fullSchemaParams = this[schemaName].schema.paths
        let schema = {}
        for (let param in fullSchemaParams) {
            let paramObject = fullSchemaParams[param]
            if (param !== '__v' && param !== '_id' && param !== 'savedOn') {
                schema[param] = this.fillSchemaField(paramObject.instance)
            }
        }
        return schema
    },
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
            parent: this.emptySchema(schemaName),
            child: this[schemaName].schema.childSchemas
        }
    },
    fillInChild(keys, parent, field, child) {
        let childSchemaField = parent[0] ? parent[0] : parent
        for (let x = 0; x < keys.length; x++) {
            const finalLevel = x + 1 === keys.length
            if (finalLevel) {
                let dataType = child.schema.paths[field].instance
                if (dataType !== 'ObjectID') {
                    childSchemaField[keys[x]] = this.fillSchemaField(dataType)
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
                this.createEmptySchema(parent, child)
            }
        }
        if (typeof(schemas.parent.__t) === 'string') schemas.parent.__t = schemaName
        return schemas.parent
    }
}

export default models