const queries = {
    parse(requestParams, queryTypeOptions={}, queryFilterOptions={}) {
        const queryOptions = {
            type: {},
            fields: {}
        }
        const splitParameters = this.splitQueryTypeAndQueryFieldParams(requestParams)
        queryOptions.type = this.loopOverFieldsAndValues(splitParameters.type, queryTypeOptions)
        queryOptions.fields = this.loopOverFieldsAndValues(splitParameters.fields, queryFilterOptions)
        return queryOptions
    },
    splitQueryTypeAndQueryFieldParams(requestParams) {
        const split = requestParams.query.split('$')
        return {
            type: split[0],
            fields: split[1]
        }
    },
    loopOverFieldsAndValues(parameters, parseOptions) {
        const queryConstructed = {}
        if (!parameters || parameters.length < 1)
            return queryConstructed
        const seperateQueryParams = parameters.split('&')
        seperateQueryParams.forEach(queryParam => {
            const query = this.splitQueryFieldAndValue(queryParam)
            if (!this.allowedParameter(query, parseOptions))
                return
            const isArrayType = query.value[0] === '[' && query.value.slice(-1) === ']'
            const isObjectType = query.value.split(';').length > 1
            const isComplexQueryValue = isArrayType || isObjectType
            const queryValueOperation = isComplexQueryValue ? this.complexQueryCompiler(query.value, isArrayType) : this.queryValueCaster(query.value)
            queryConstructed[query.field] = queryValueOperation
        })
        return queryConstructed
    },
    allowedParameter(parameter, parseOptions) {
        if (!parseOptions.allowedParameters || parseOptions.allowedParameters.length < 1)
            return true
        else if (parseOptions.allowedParameters === 'none')
            return false
        else 
            return parseOptions.allowedParameters.find(param => param === parameter.field)    
    },
    splitQueryFieldAndValue(fieldAndValue) {
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
    async operation(query, request, operationOptions={}) {
        try {
            const mongooseOperator = this.mongooseCRUDMapping(query.type.many, request.method)
            const mongooseOperationInfo = this.mongooseOperationOptions(mongooseOperator, operationOptions)
            const mongooseRes = await this.mongooseOperation(mongooseOperationInfo, request.headers.targetCollection, query)
            return mongooseRes
        } catch(err) {
            console.log(err)
        }
    },
    mongooseCRUDMapping(operationOnManyDocuments, routeMethod) {
        switch(routeMethod) {
            case 'GET':
                return `find${operationOnManyDocuments ? '' : 'One'}`
            case 'DELETE':
                return `delete${operationOnManyDocuments ? 'Many' : 'One'}`
            case 'POST':
                if (operationOnManyDocuments)
                    return 'insertMany'
                else
                    return 'create'
            case 'PUT':
                if (operationOnManyDocuments)
                    return 'update'
                else
                    return 'findOneAndUpdate'
        }
    },
    mongooseOperation(operationInfo, targetCollection, query) {
        query.fields = { ...query.fields, ...operationInfo.extraQueryFilters }
        switch(operationInfo.method) {
            case 'find':
            case 'findOne':
                return $db.models[targetCollection][operationInfo.method](query.fields).select(operationInfo.select).exec()
            case 'deleteOne':
            case 'deleteMany':
                return $db.models[targetCollection][operationInfo.method](query.fields)
            case 'insertMany':
            case 'create':
                return $db.models[targetCollection][operationInfo.method](query.fields)
            // this one still needs work
            case 'update':
                return $db.models[targetCollection][operationInfo.method](query.query, query.fields)
            case 'findOneAndUpdate':
                return $db.models[targetCollection][operationInfo.method](query.fields._id, query.fields, operationInfo.updateOptions).select(["-password", "-username"])
        }
    },
    mongooseOperationOptions(mongooseOperator, options) {
        let mongooseOptions = {}
        mongooseOptions.method = mongooseOperator
        switch(mongooseOperator) {
            case 'find':
            case 'findOne':
                mongooseOptions = { ...mongooseOptions, select: options.select ? options.select : [] }
                break
            case 'findOneAndUpdate':
                mongooseOptions = { ...mongooseOptions, updateOptions: { new: true } }
                break
            default:
                break
        }
        mongooseOptions.extraQueryFilters = options.extraQueryFilters || {}
        return mongooseOptions
    }
}

const postHook = {
    querySpecified(data, queryOptions) {
        if (!queryOptions.type["post-hook"])
            return data
        const isArray = Array.isArray(data)
        const infoFromAllHooks = { originalData: _.deepCopy(data) }
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
        return hardCodedPostHook(hookTransformations, queryOptions) || hookTransformations
    },
    default(data) {
        return data
    }
}

const validator = require('express-validator')

const bodyValidation = {
    isValid(request) {
        const errors = validator.validationResult(request)
        if (!errors.isEmpty())
            return { passed: false, errors: errors.array() }
        else {
            // remove any extra fields from request body
            request.body = validator.matchedData(request, { includeOptionals: true })
            return { passed: true }
        }
    }
}


const middleware = require($DIR + '/middleware/main.js')
const routes = {
    defaultCRUDRouteOptions(options) {
        return {
            authLevel: options.authLevel || 0,
            postHook: options.postHook || postHook.default,
            extraMiddleware: options.extraMiddleWare || [],
        }
    },
    // auth is always first, followed by identification of target model,
    // any extra middleware, then the crud middleware
    middlewarePipleine(options) {
        return [
            middleware.auth(options.authLevel),
            (request, res, next) => {
                request.headers.targetCollection = request.baseUrl.replace('/', '')
                next()
            },
            ...options.extraMiddleware
        ]
    },
}

const commit = {
    options(data, targetInfo) {
        const commitOptions = {
            type: {},
            fields: {}
        }
        if (targetInfo === 'body')
            commitOptions.fields = data
        else {
            commitOptions.fields = data[targetInfo]
            commitOptions.fullData = data
        }
        if (Array.isArray(commitOptions.fields))
            commitOptions.type.many = true
        return commitOptions
    }
}

module.exports = {
    CRUD,
    queries,
    postHook,
    routes,
    bodyValidation,
    commit
}