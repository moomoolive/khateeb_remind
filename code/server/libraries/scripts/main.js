const randomNamegenerate = require('project-name-generator')

const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')

const createRootInstitutionAndUser = async () => {
    try {
        let rootInstitution = await $db.institutions.findOne({ name: '__ROOT__' }).exec()
        if (!rootInstitution)
            rootInstitution = await new $db.institutions({
                name: "__ROOT__",
                abbreviatedName: "__ROOT__",
                timezone: global.APP_CONFIG.cron.timezone,
                confirmed: true,
                country: 'none',
                settings: {
                    ...global.APP_CONFIG.rootInstitution.settingsInitial
                }
            }).save()
        else
            console.log(`Root institution already exists`)
        const rootAdmin = await $db.root.findOne({}).exec()
        if (!rootAdmin)
            await rootInstitution.createRootSystemAdmin({
                ...global.APP_CONFIG.rootUserInitialization,
                institutionID: rootInstitution._id.toString(),
                password: process.env.DEFAULT_ROOT_PASS || '123456',
                confirmed: true,
                phoneNumber: 999_999_9999
            })
        else
            console.log(`Root user already exists`)
    } catch(err) {
        console.log(err)
        console.log(`Root user couldn't be created!`)
    }
}

const createTestInstitution = async () => {
    try {
        
        let testInstitution = await $db.institutions.findOne({ name: "__TEST__" }).exec()
        if (testInstitution)
            console.log('Test institution already exists')
        else
            testInstitution = await new $db.institutions({
                name: "__TEST__",
                abbreviatedName: "__TEST__",
                confirmed: true,
                ...global.APP_CONFIG.testInstitutionInitialization.institution,
            }).save()
        
        let testInstitutionRootAdmin = await $db.rootInstitutionAdmins.findOne({ institutionID: testInstitution._id.toString() }).exec()
        if (testInstitutionRootAdmin)
            console.log('Test institution admin already exists')
        else
            await testInstitution.createRootAdministrator({
                institutionID: testInstitution._id.toString(),
                ...global.APP_CONFIG.testInstitutionInitialization.rootAdmin,
                phoneNumber: 100_000_0000,
                confirmed: true
            })
        
        let testInstitutionLocations = await $db.locations.find({ institutionID: testInstitution._id.toString() })
        if (testInstitutionLocations.length === global.APP_CONFIG.testInstitutionInitialization.locationCount)
            console.log(`Test Institution already has ${global.APP_CONFIG.testInstitutionInitialization.locationCount} locations`)
        else {
            const ids = []
            for (let i = testInstitutionLocations.length; i < global.APP_CONFIG.testInstitutionInitialization.locationCount; i++) {
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
                    for (let t = 1; t < global.APP_CONFIG.testInstitutionInitialization.timingsPerLocation; t++) {
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
            console.log(`Created ${global.APP_CONFIG.testInstitutionInitialization.locationCount - testInstitutionLocations.length} locations for test institution. Ids: ${ids.reduce((total, i) => `${total}, ${i}`)}`, '')
        }

        let testInstitutionKhateebs = await $db.khateebs.find({ institutionID: testInstitution._id.toString() }).exec()
        if (testInstitutionKhateebs.length === global.APP_CONFIG.testInstitutionInitialization.khateebCount)
            return console.log(`Test institution already has ${global.APP_CONFIG.testInstitutionInitialization.khateebCount} khateebs`)
        else {
            const ids = []
            const testInstitutionTimings = await $db.timings.find({ institutionID: testInstitution._id.toString() })
            const date = scheduleHelpers.findUpcomingFridayDBFormat()
            const vCalendarId = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            for (let i = testInstitutionKhateebs.length; i < global.APP_CONFIG.testInstitutionInitialization.khateebCount; i++) {
                try {
                    const khateeb = await new $db.khateebs({
                        username: `${global.APP_CONFIG.testInstitutionInitialization.khateebs.baseUsername}${i + 1}`,
                        password: global.APP_CONFIG.testInstitutionInitialization.khateebs.password,
                        confirmed: true,
                        handle: randomNamegenerate().dashed,
                        firstName: randomNamegenerate().dashed,
                        lastName: randomNamegenerate().dashed,
                        phoneNumber: 100_000_0000,
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
            console.log(`Created ${global.APP_CONFIG.testInstitutionInitialization.khateebCount - testInstitutionKhateebs.length} khateebs for test institution. Ids: ${ids.reduce((total, i) => `${total}, ${i}`)}`, '')
        }
    } catch(err) {
        console.log(err)
        console.log(`Couldn't create test school`)
    }
}


module.exports = {
    createRootInstitutionAndUser,
    createTestInstitution
}