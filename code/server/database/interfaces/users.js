const mongoose = require("mongoose")

const users = require($rootDir + "/database/models/users.js")
const userScheduleRestrictions = require($rootDir + "/database/models/userScheduleRestrictions.js")

const helpers = require($rootDir + "/database/helperFunctions/main.js")

function findKhateebs(institutionId="1234", khateebAuthorization="1234", query={}) {
    return users.aggregate([
        // get users that have the 'khateeb' authorization key for 
        // requesting institution
        { 
            $match: { "authorizations.authId": khateebAuthorization._id } 
        },
        { $unwind: "$authorizations" },
        // perform "join" on the "authorization" field
        {
            $lookup: {
                from: "authorizations",
                localField: "authorizations.authId",
                foreignField: "_id",
                as: "authorizations.info"
            }
        },
        { $unwind: "$authorizations.info" },
        // filter out authorizations that aren't relavent to 
        // being a khateeb at this institution
        {
            $match: { 
                "authorizations.info.institution": mongoose.Types.ObjectId(institutionId),
                "authorizations.info.role": "khateeb"
            }
        },
        // perform "join" on the "scheduleRestriction" field
        {
            $lookup: {
                // aggregate won't find model unless the model name
                // is all lowercase and will NOT work with camel case
                from: "userschedulerestrictions",
                localField: "scheduleRestrictions",
                foreignField: "_id",
                as: "schedule"
            }
        },
        { $unwind: '$schedule' },
        // filter out schedule restrictions and that aren't 
        // related to requesting institution
        { 
            $match: { "schedule.institution": mongoose.Types.ObjectId(institutionId), } 
        },
        // cast khateebs to desired data structure
        {
            $project: {
                _id: "$_id",
                handle: "$handle",
                email: "$email",
                title: "$title",
                firstName: "$firstName",
                lastName: "$lastName",
                lastLogin: "$lastLogin",
                createdAt: "$authorizations.createdAt",
                updatedAt: "$authorizations.updatedAt",
                availableTimings: "$schedule.availableTimings",
                unavailableDates: "$schedule.unavailableDates",
                confirmed: "$authorizations.confirmed",
                authorizationId: "$authorizations._id",
                active: "$active",
                __t: 'khateeb'
            }
        },
        // now filter khateebs based on query
        {
            $match: query
        }
    ]).exec()
}

async function getUserScheduleRestrictionsAssociatedWithInstitution(userId="1234", institutionId="1234") {
    try {
        const scheduleRestrictions = await userScheduleRestrictions
            .find({ user: userId, institution: institutionId })
            .exec()
        return scheduleRestrictions.map(sR => sR._id)
    } catch(err) {
        console.error(err)
        return []
    }
}

function findInstitutionAdmins(institutionId="1234", institutionAdminAuthorization="1234", query={}) {
    return users.aggregate([
        // find users that have the 'institutionAdmin' key
        // for requesting institution
        { 
            $match: { "authorizations.authId": institutionAdminAuthorization._id }
        },
        { $unwind: "$authorizations" },
        // perform "join" on the "authorization" field
        {
            $lookup: {
                from: "authorizations",
                localField: "authorizations.authId",
                foreignField: "_id",
                as: "authorizations.info"
            }
        },
        { $unwind: "$authorizations.info" },
        // filter out authorizations that aren't relavent to 
        // being an institutionAdmin at this institution
        {
            $match: { 
                "authorizations.info.institution": mongoose.Types.ObjectId(institutionId),
                "authorizations.info.role": "institutionAdmin"
            }
        },
        // cast institution admins to desired data structure
        {
            $project: {
                _id: "$_id",
                handle: "$handle",
                email: "$email",
                title: "$title",
                firstName: "$firstName",
                lastName: "$lastName",
                lastLogin: "$lastLogin",
                createdAt: "$authorizations.createdAt",
                updatedAt: "$authorizations.updatedAt",
                confirmed: "$authorizations.confirmed",
                authorizationId: "$authorizations._id",
                active: "$active",
                __t: 'institutionAdmin'
            }
        },
        // filter by request query
        {
            $match: query
        }
    ]).exec()
}

function query(options={}) {
    const filter = options.filter || {}
    const populate = options.populate || ""
    return users
        .find(filter)
        .populate(populate)
        .exec()
}

function findEntry(options={}) {
    const targetModel = helpers.dynamicUserModel(options.targetModel)
    const filter = options.filter || {}
    const dataShape = options.dataShape || []
    const populate = options.populate || ""
    return targetModel
        .findOne(filter)
        .populate(populate)
        .select(dataShape)
        .exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return new users(entry).save()
}

function updateEntryAndReturnOldCopy(options={}) {
    const filter = options.filter || {}
    const updates = options.updates || {}
    const returnOptions = options.returnOptions
    return users
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

function addAuthorizationKey(userId="1234", authorizationid="1234", confirmed) {
    return users.update(
            { _id: userId },
            {
                $push: {
                    authorizations: { authId: authorizationid, confirmed }
                }
            }
        )
}

async function delegateRootInstitutionAdminAuthorization(toBeDelegatedUserId, delegatingUserId, institutionAuthorizations) {
    try {
        const rootInstitutionAdminAuthorization = institutionAuthorizations.find(a => a.role === 'rootInstitutionAdmin')
        const institutionAdminAuthorization = institutionAuthorizations.find(a => a.role === 'institutionAdmin')
        const newRootAdmin = await users.bulkWrite([
            // add root admin authorization to target user
            {
                updateOne: {
                    filter: { _id: toBeDelegatedUserId },
                    update: {
                        $push: {
                            authorizations: { authId: rootInstitutionAdminAuthorization._id, confirmed: true }
                        },
                    }
                }
            },
            // remove their institution admin authorizations if they exist
            {
                updateOne: {
                    filter: { _id: toBeDelegatedUserId },
                    update: {
                        $pull: {
                            authorizations: { authId: institutionAdminAuthorization._id }
                        }
                    }
                }
            },
        ])
        const delegatingUser = await users.update(
            { _id: delegatingUserId },
            {
                $pull: {
                    authorizations: { authId: rootInstitutionAdminAuthorization._id }
                }
            }
        )
        return { newRootAdmin, delegatingUser }
    } catch(err) {
        throw err
    }
}

function confirmAuthorization(userAuthId="1234", confirmed) {
    return users.update(
        { "authorizations._id": userAuthId },
        { $set: { "authorizations.$.confirmed": confirmed } }
    )
}

function removeAuthorization(userId="1234", userAuthorizationId="1234", extraOperations={}) {
    let options = {}
    if (extraOperations.removeAssociatedSchedules) {
        options.$pull = { scheduleRestrictions: { $in: extraOperations.scheduleIds } }
    }
    return users.bulkWrite([
        {
            updateOne: {
                filter: { _id: userId },
                update: { $pull: { "authorizations" : { _id : userAuthorizationId } } }
            }
        },
        {
            updateOne: {
                filter: { _id: userId },
                update: options
            }
        }
    ])
}

function populateScheduleRestrictionsAndAuthorizations(userId="1234") {
    return users
        .find({ _id: userId })
        .populate("authorizations.authId")
        .populate("scheduleRestrictions")
        .exec()
}

function findEntryRelatedAuthorizations(userId="1234") {
    return findEntry({
        filter: { _id: userId },
        populate: { 
            path: 'authorizations.authId',
            select: { __v: 0 },
            populate: {
                path: 'institution',
                select: {
                    settings: 0,
                    __v: 0
                }
            }
        },
        dataShape: ["-__v", "-statuses", "-password"]
    })
} 

function addAuthorization(userId="1234", userAuthId="1234", confirmed, extraOperations={}) {
    const options = {}
    if (extraOperations.addScheduleRestriction) {
        options.$push = { scheduleRestrictions: extraOperations.scheduleRestrictionId }
    }
    return users.bulkWrite([
        {
            updateOne: {
                filter: { _id: userId },
                update: { 
                    $push: { 
                        authorizations: { 
                            authId: userAuthId, 
                            // system administrators can never be autoconfirmed
                            // only khateebs can be if administrator turns on that setting
                            confirmed
                        }
                    },
                }
            }
        },
        {
            updateOne: {
                filter: { _id: userId },
                update: { ...options }
            }
        }
    ])
}

// the reason why I use updateOne and then findOne instead of
// findOneAndUpdate is because there are 'pre update' hooks for
// the user schema that won't work with findOneAndUpdate
async function updateEntry(options={}) {
    try {
        const targetModel = helpers.dynamicUserModel(options.targetModel)
        const filter = options.filter || {}
        const updates = options.updates || {}
        await targetModel.updateOne(filter, updates)
        const dataShape = options.dataShape || []
        return targetModel
            .findOne(filter)
            .select(dataShape)
            .exec()
    } catch(err) {
        throw err
    }
}

async function deleteEntry(options={}) {
    try {
        const targetModel = helpers.dynamicUserModel(options.targetModel)
        const filter = options.filter || {}
        const user = await users.findEntry({ filter, targetModel })
        const dependantsRes = await user.deactivateAccount(options.postHook)
        const userUpdateRes = await users.updateOne(
            filter,
            { 
                active: false , 
                scheduleRestrictions: [],
                // remove username - refer to explanation in schema section
                $unset: { username: "" } 
            }
        )
        return { dependantsRes, userUpdateRes }
    } catch(err) {
        throw err
    }
}

function findAuthorizationHolders(authorizations=[]) {
    return query({
        filter: {
            "authorizations.authId": { $in: authorizations } 
        }
    })
}

function confirmAuthorizationByKey(key="1234", confirmed) {
    return users.update(
        { "authorizations.authId": key },
        { $set: { "authorizations.$.confirmed": confirmed } }
    )
}

function findEntryByAuthorizationKey(authId) {
    return findEntry({ 
        filer: { "authorizations.authId": authId },
        dataShape: ["authorizations"] 
    })
}

module.exports = {
    findKhateebs,
    getUserScheduleRestrictionsAssociatedWithInstitution,
    findInstitutionAdmins,
    query,
    findEntry,
    createEntry,
    updateEntry,
    addAuthorizationKey,
    delegateRootInstitutionAdminAuthorization,
    confirmAuthorization,
    removeAuthorization,
    populateScheduleRestrictionsAndAuthorizations,
    findEntryRelatedAuthorizations,
    addAuthorization,
    findAuthorizationHolders,
    deleteEntry,
    confirmAuthorizationByKey,
    updateEntryAndReturnOldCopy,
    findEntryByAuthorizationKey
}