module.exports = {
    fillSchemaField(dataType, mixed = {}) {
        let x = null
        switch(dataType) {
            case 'String':
                x = ''
                break
            case 'Number':
                x = '0'
                break
            case 'Mixed':
                x = mixed
                break
            case 'Array':
                x = []
                break
            case 'Boolean':
                x = true
                break
            case "Date": 
                x = new Date()
        }
        return x
    },
    createEmptyParentSchema(parent, child) {
        const schemaObject = child.schema.obj
        if (Array.isArray(parent)) {
            parent.push(schemaObject)
        } else parent = [schemaObject]
    },
    fillInChild(keys, parent, field, child) {
        let childSchemaField = parent[0] ? parent[0] : parent
        for (let x = 0; x < keys.length; x++) {
            const finalLevel = x + 1 === keys.length
            if (finalLevel) {
                let dataType = child.schema.paths[field].instance
                if (dataType !== 'ObjectID') {
                    if (dataType === 'Array') {
                        const arrayOf = child.schema.paths[field].caster.instance
                        const firstEntry = this.fillSchemaField(arrayOf)
                        childSchemaField[keys[x]] = [firstEntry]
                    } else {
                        childSchemaField[keys[x]] = this.fillSchemaField(dataType)
                    }
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
    }
}