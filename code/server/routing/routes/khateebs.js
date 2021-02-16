const express = require('express')

const router = express.Router()

const restrictions = {
    get: {
        khateeb: ["title", "firstName", "lastName", "institutionID"],
        institutionAdmin: ['-password', '-username'],
        rootInstitutionAdmin: ['-password', '-username']
    }
}

const CRUD = require($DIR + '/middleware/CRUD/main.js')

CRUD.GET(router, 'khateebs', 1 , restrictions)

module.exports = router