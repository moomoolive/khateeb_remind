const queries = {
    parse(requestParams) {
        const queryOptions = {
            type: {},
            fields: {}
        }
        const splitParameters = this.splitQueryTypeAndQueryFieldParams(requestParams)
        queryOptions.type = this.loopOverFieldsAndValues(splitParameters.type)
        queryOptions.fields = this.loopOverFieldsAndValues(splitParameters.fields)
        return queryOptions
    },
    splitQueryTypeAndQueryFieldParams(requestParams) {
        // query type parameters and query field parameters are separated by $
        // queryTypeParam=value1$queryFieldParam=value2, many=true$age=10
        const split = requestParams.query.split('$')
        return {
            type: split[0],
            fields: split[1]
        }
    },
    loopOverFieldsAndValues(parameters) {
        // queries are seperated by &
        // example query1=value1&query2=value2, name=mo&age=10
        const seperateQueryParams = parameters.split('&')
        const queryConstructed = {}
        seperateQueryParams.forEach(queryParam => {
            const query = this.splitQueryFieldAndValue(queryParam)
            const isArrayType = query.value[0] === '[' && query.value.slice(-1) === ']'
            const isObjectType = query.value.split(';').length > 1
            const isComplexQueryValue = isArrayType || isObjectType
            const queryValueOperation = isComplexQueryValue ? this.complexQueryCompiler(query.value, isArrayType) : this.queryValueCaster(query.value)
            queryConstructed[query.field] = queryValueOperation
        })
        return queryConstructed
    },
    splitQueryFieldAndValue(fieldAndValue) {
        // generally query field and value are seperated by =
        // example field=value, age=10
        const queryParamNameAndValue = fieldAndValue.split('=')
        return {
            field: queryParamNameAndValue[0],
            value: queryParamNameAndValue[1]
        }
    },
    complexQueryCompiler(complexValue, isArrayType) {
        if (isArrayType)
            return this.queryValueToArray(complexValue)
        else
            return this.queryValueToObject(complexValue)
    },
    queryValueToArray(queryValue) {
        const arrayValues = queryValue.slice(1, -1).split(',')
        return arrayValues.map(value => this.queryValueCaster(value))
    },
    queryValueToObject(queryValue) {
        const splitComplexValue = queryValue.split(';')
        // removes last item, which in this case is an empty string
        splitComplexValue.pop()
        const constructedComplexQueryValue = {}
        splitComplexValue.forEach(value => {
            // within complex queries values are denoted by a colon
            const queryValueConstraintAndValue = value.split(':')
            const queryValueConstraint = queryValueConstraintAndValue[0]
            const queryValue = queryValueConstraintAndValue[1]
            const queryField = this.complexQueryFieldToMongooseQueryField(queryValueConstraint)
            constructedComplexQueryValue[queryField] = this.queryValueCaster(queryValue) 
        })
        return constructedComplexQueryValue
    },
    complexQueryFieldToMongooseQueryField(queryField) {
        switch(queryField) {
            case 'min':
                return '$gte'
            case 'max':
                return '$lte'
            default:
                return queryField
        }
    },
    queryValueCaster(value) {
        // cast to number if applicable
        if (_.isNumeric(value))
            value = parseInt(value)
        switch(value) {
            // cast to boolean if it is boolean, which means true and false are
            // reserved keywords
            case 'true':
            case 'false':
                return value === 'true'
            default:
                return value
        }
    }
}

const CRUD = {
    async operation(query, request, targetCollection, operationOptions, info=null) {
        try {
            const mongooseOperator = this.mongooseCRUDMapping(query.type.many, request.method)
            const mongooseOperationInfo = this.mongooseOperationOptions(mongooseOperator, operationOptions)
            const mongooseRes = await this.mongooseOperation(mongooseOperationInfo, targetCollection, query, info)
            return mongooseRes
        } catch(err) {
            console.log(err)
        }
    },
    mongooseCRUDMapping(operationOnManyDocuments, routeMethod) {
        switch(routeMethod) {
            case 'GET':
                return `find${operationOnManyDocuments ? '' : 'One'}`
        }
    },
    mongooseOperation(operationInfo, targetCollection, query, info) {
        switch(operationInfo.method) {
            case 'find':
            case 'findOne':
                return $db.models[targetCollection][operationInfo.method](query.fields).select(operationInfo.select).exec()
        }
    },
    mongooseOperationOptions(mongooseOperator, options) {
        switch(mongooseOperator) {
            case 'find':
            case 'findOne':
                return {
                    method: mongooseOperator,
                    select: options.select ? options.select : []
                }
        }
    }
}

const postHook = {
    querySpecified(data, queryOptions) {
        const infoFromAllHooks = { originalData: _.deepCopy(data) }
        if (!queryOptions.type["post-hook"])
            return infoFromAllHooks
        const isArray = Array.isArray(data)
        queryOptions["post-hook"].forEach(hook => {
            // all query specificed post hooks are mongoose model methods, 
            // that take no arguments and return objects
            try {
                if (isArray && data.length < 1)
                    return
                const hookInfo = isArray ? data[0][hook]() : data[hook]()
                infoFromAllHooks = { infoFromAllHooks, ...hookInfo }
            } catch(err) {
                console.log(err)
                console.log(`You probably referenced a mongoose method that isn't associated with the model`)
                return infoFromAllHooks
            }
        })
        return infoFromAllHooks
    },
    execute(data, queryOptions, hardCodedPostHook) {
        // query specified hooks take precedent
        const hookTransformations = this.querySpecified(data, queryOptions)
        return hardCodedPostHook(hookTransformations, queryOptions)
    },
    default(data) {
        return data
    }
}

module.exports = {
    CRUD,
    queries,
    postHook
}