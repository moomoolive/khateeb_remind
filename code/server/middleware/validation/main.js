const validator = require('express-validator')

const validateRequest = (validators=[], section="body") => {
    return [
        ...validators,
        (req, res, next) => {

            const errors = validator.validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json(errors.array())
            }
            req[section] = validator.matchedData(req, { includeOptionals: false })
            next()
            
        }
    ]
}

module.exports = {
    validateRequest
}