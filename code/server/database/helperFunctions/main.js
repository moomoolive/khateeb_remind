const mongoose = require('mongoose')

const removeAuthorizationFromUserCommand = (authorizationId="1234") => {
    return {
        $pull: {
            authorizations: { _id: authorizationId }
        }
    }
}

const getUserScheduleRestrictionsAssociatedWithInstitution = async (userId="1234", institutionId="1234") => {
    try {
        const scheduleRestrictions = await $db.userScheduleRestrictions
            .find({ user: userId, institution: institutionId })
            .exec()
        return scheduleRestrictions.map(sR => sR._id)
    } catch(err) {
        console.error(err)
        return []
    }
}

const getKhateebs = (institutionId="1234", khateebAuthorization="1234", query={}) => {
    return $db.users.aggregate([
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
                "authorizations.info.institution": institutionId,
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

module.exports = {
    removeAuthorizationFromUserCommand,
    getUserScheduleRestrictionsAssociatedWithInstitution,
    getKhateebs
}