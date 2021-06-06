const testInstitution = require($rootDir + "/database/childModels/testInstitution.js")

function testInstitutionExists() {
    return testInstitution
        .findOne({})
        .exec()
}

function create(entry={}) {
    return new testInstitution(entry).save()
}

module.exports = {
    testInstitutionExists,
    create
}