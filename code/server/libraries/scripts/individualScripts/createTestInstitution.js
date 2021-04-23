const randomNamegenerate = require('project-name-generator')

const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')

const createTestInstitution = async () => {
    try {
        
        let testInstitution = await $db.institutions.findOne({ name: "test" }).exec()
        if (testInstitution)
            console.log('Test institution already exists')
        else
            testInstitution = await new $db.institutions({
                name: "test",
                abbreviatedName: "__TEST__",
                confirmed: true,
                ...global.CONFIG.testInstitutionInitialization.institution,
            }).save()
        
        let testInstitutionRootAdmin = await $db.rootInstitutionAdmins.findOne({ institutionID: testInstitution._id.toString() }).exec()
        if (testInstitutionRootAdmin)
            console.log('Test institution admin already exists')
        else
            await testInstitution.createRootAdministrator({
                institutionID: testInstitution._id.toString(),
                ...global.CONFIG.testInstitutionInitialization.rootAdmin,
                password: process.env.DEFAULT_TEST_USER_PASS || "123456",
                email: "none@khateeb-remind.com",
                confirmed: true
            })
        
        let testInstitutionLocations = await $db.locations.find({ institutionID: testInstitution._id.toString() })
        if (testInstitutionLocations.length === global.CONFIG.testInstitutionInitialization.locationCount)
            console.log(`Test Institution already has ${global.CONFIG.testInstitutionInitialization.locationCount} locations`)
        else {
            const ids = []
            for (let i = testInstitutionLocations.length; i < global.CONFIG.testInstitutionInitialization.locationCount; i++) {
                try {
                    const location = await new $db.locations({
                        name: randomNamegenerate().dashed,
                        address: `${randomNamegenerate().dashed} Street`,
                        institutionID: testInstitution._id.toString()
                    }).save()
                    ids.push(location._id)
                    
                    let hour = 13
                    let minute = 20
                    // locations by default create an associated timing, so we'll skip right to index 1
                    for (let t = 1; t < global.CONFIG.testInstitutionInitialization.timingsPerLocation; t++) {
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
            console.log(`Created ${global.CONFIG.testInstitutionInitialization.locationCount - testInstitutionLocations.length} locations for test institution. Ids: ${ids.reduce((total, i) => `${total}, ${i}`)}`, '')
        }

        let testInstitutionKhateebs = await $db.khateebs.find({ institutionID: testInstitution._id.toString() }).exec()
        if (testInstitutionKhateebs.length === global.CONFIG.testInstitutionInitialization.khateebCount)
            return console.log(`Test institution already has ${global.CONFIG.testInstitutionInitialization.khateebCount} khateebs`)
        else {
            const ids = []
            const testInstitutionTimings = await $db.timings.find({ institutionID: testInstitution._id.toString() })
            const date = scheduleHelpers.findUpcomingFridayDBFormat()
            const vCalendarId = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            for (let i = testInstitutionKhateebs.length; i < global.CONFIG.testInstitutionInitialization.khateebCount; i++) {
                try {
                    const khateeb = await new $db.khateebs({
                        username: `${global.CONFIG.testInstitutionInitialization.khateebs.baseUsername}${i + 1}`,
                        password: process.env.DEFAULT_TEST_USER_PASS || "123456",
                        confirmed: true,
                        handle: randomNamegenerate().dashed,
                        firstName: randomNamegenerate().dashed,
                        lastName: randomNamegenerate().dashed,
                        email: "none@khateeb-remind.com",
                        institutionID: testInstitution._id.toString(),
                        title: i % 3 === 0 ? 'shiekh' : i % 2 === 0 ? 'imam' : 'none',
                        availableTimings: i % 2 === 0 ? [] : testInstitutionTimings[i] ? [testInstitutionTimings[i]._id.toString()] : [],
                        unavailableDates: i % 2 === 0 ? [{ vCalendarId, date }] : []
                    }).save()
                    ids.push(khateeb._id)
                } catch(err) {
                    ids.push(`Error occured creating khateeb #${i + 1}. Err trace: ${err}`)
                }
            }
            console.log(`Created ${global.CONFIG.testInstitutionInitialization.khateebCount - testInstitutionKhateebs.length} khateebs for test institution. Ids: ${ids.reduce((total, i) => `${total}, ${i}`)}`, '')
        }
    } catch(err) {
        console.log(err)
        console.log(`Couldn't create test school`)
    }
}

module.exports = createTestInstitution