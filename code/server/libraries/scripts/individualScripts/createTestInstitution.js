const randomNamegenerate = require('project-name-generator')

const scheduleHelpers = require($rootDir + '/libraries/schedules/main.js')
const { initConfig } = require($rootDir + '/Server.config.js')

const { 
    timings, 
    locations, 
    testInstitution: testInstitutionInterfaces,
    authorizations: authorizationsInterfaces,
    userScheduleRestrictions,
    users 
} = require($rootDir + "/database/public.js")

const createTestInstitution = async () => {
    try {
        
        // check if test institution exists if not create it
        let testInstitution = await testInstitutionInterfaces.testInstitutionExists()
        if (testInstitution) {
            console.log('Test institution already exists')
        } else {
            testInstitution = await testInstitutionInterfaces.create(initConfig.testInstitution.institution)
        }

        const authorizations = await authorizationsInterfaces.query({ filter: { institution: testInstitution._id } })
        // check if test institution root admin exists if not create it
        const rootInstitutionAdminAuthorization = authorizations.find(a => a.role === 'rootInstitutionAdmin')
        let testInstitutionRootAdmin = await users.findEntry({ 
            filter: { "authorizations.authId": rootInstitutionAdminAuthorization._id }
        })
        if (testInstitutionRootAdmin) {
            console.log('Test root institution admin already exists')
        } else {
            testInstitutionRootAdmin = await users.createEntry({
                entry: {
                    ...initConfig.testInstitution.rootAdmin,
                    authorizations: [{ authId: rootInstitutionAdminAuthorization._id, confirmed: true }]
                }
            })
            console.log(`Created root admin for test institution, id: ${testInstitutionRootAdmin._id}`)
        }

        // check one institution admin 
        // for test institution exists if not create it
        const institutionAdminAuthorization = authorizations.find(a => a.role === 'institutionAdmin')
        let testInstitutionAdmin = await users.findEntry({ 
            filter: { "authorizations.authId": institutionAdminAuthorization._id }
        })
        if (testInstitutionAdmin) {
            console.log('Test institution already has one institution admin')
        } else {
            testInstitutionAdmin = await await users.createEntry({
                entry: {
                    ...initConfig.testInstitution.institutionAdmin,
                    handle: randomNamegenerate().dashed,
                    firstName: randomNamegenerate().dashed,
                    lastName: randomNamegenerate().dashed,
                    authorizations: [{ authId: institutionAdminAuthorization._id, confirmed: false }]
                }
            })
            console.log(`Created institution admin for test institution, id: ${testInstitutionAdmin._id}`)
        }
        
        // check if test institution has as many locations as specified in
        // "Server.config.js" file, if not create enough to fulfill that
        // quota
        let testInstitutionLocations = await locations.query({ filter: { institutionID: testInstitution._id } })
        if (testInstitutionLocations.length === initConfig.testInstitution.locationCount)
            console.log(`Test Institution already has ${initConfig.testInstitution.locationCount} locations`)
        else {
            const ids = []
            for (let i = testInstitutionLocations.length; i < initConfig.testInstitution.locationCount; i++) {
                try {
                    const location = await locations.createEntry({
                        entry: {
                            name: randomNamegenerate().dashed,
                            address: `${randomNamegenerate().dashed} Street`,
                            institutionID: testInstitution._id.toString()
                        }
                    })
                    ids.push(location._id)
                    
                    let hour = 13
                    let minute = 20
                    // locations by default create an associated timing, so we'll skip right to index 1
                    for (let t = 1; t < initConfig.testInstitution.timingsPerLocation; t++) {
                        minute += 10
                        if (minute > 59) {
                            minute = 0
                            hour++
                        }
                        if (hour > 23)
                            hour = 0
                        await location.createAssociatedTiming(minute, hour)
                    }
                } catch(err) {
                    ids.push(`Error occured creating khateeb #${i + 1}. Err trace: ${err}`)
                }
            }
            console.log(`Created ${initConfig.testInstitution.locationCount - testInstitutionLocations.length} locations for test institution. Ids: ${ids.reduce((total, i) => `${total}, ${i}`)}`, '')
        }

        // check if test institution has as many khateebs as specified in
        // "Server.config.js" file, if not create enough to fulfill that
        // quota
        const khateebAuthorization = authorizations.find(a => a.role === 'khateeb')
        let testInstitutionKhateebs = await users.findAuthorizationHolders([khateebAuthorization._id])
        if (testInstitutionKhateebs.length === initConfig.testInstitution.khateebCount) {
            return console.log(`Test institution already has ${initConfig.testInstitution.khateebCount} khateebs`)
        } else {
            const ids = []
            const testInstitutionTimings = await timings.query({ filter: { institutionID: testInstitution._id } })
            const date = scheduleHelpers.findUpcomingFridayDBFormat()
            const vCalendarId = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            const institutionID = testInstitution._id.toString()
            for (let i = testInstitutionKhateebs.length; i < initConfig.testInstitution.khateebCount; i++) {
                try {
                    const khateeb = await users.createEntry({
                        entry: {
                            username: `${initConfig.testInstitution.khateebs.baseUsername}${i + 1}`,
                            ...initConfig.testInstitution.khateebs.info,
                            handle: randomNamegenerate().dashed,
                            firstName: randomNamegenerate().dashed,
                            lastName: randomNamegenerate().dashed,
                            title: i % 3 === 0 ? 'shiekh' : i % 2 === 0 ? 'imam' : 'none',
                            authorizations: [{ authId: khateebAuthorization._id.toString(), confirmed: i % 5 !== 0 }]
                        }
                    })
                    ids.push(khateeb._id)

                    // create fake schedule restrictions for each khateeb
                    // that is somewhat random
                    const scheduleRestriction = await userScheduleRestrictions.createEntry({
                        entry : {
                            institution: institutionID,
                            user: khateeb._id,
                            availableTimings: i % 2 === 0 ? [] : testInstitutionTimings[i] ? [testInstitutionTimings[i]._id.toString()] : [],
                            unavailableDates: i % 2 === 0 ? [{ vCalendarId, date }] : [],
                        }
                    })
                    
                    await users.updateEntry({
                        filter: { _id: khateeb._id },
                        updates: { scheduleRestrictions: [scheduleRestriction._id] }
                    })

                } catch(err) {
                    ids.push(`Error occured creating khateeb #${i + 1}. Err trace: ${err}`)
                }
            }
            console.log(`Created ${initConfig.testInstitution.khateebCount - testInstitutionKhateebs.length} khateebs for test institution. Ids: ${ids.reduce((total, i) => `${total}, ${i}`)}`, '')
        }
    } catch(err) {
        console.error(`Couldn't create test school`, err)
    }
}

module.exports = createTestInstitution