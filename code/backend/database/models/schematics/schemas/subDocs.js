const mongoose = require('mongoose')

const subDocs = {
    khateebData: new mongoose.Schema({
        firstName: {
            type: String,
            default: 'TBD'
        },
        lastName: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: 'none'
        }
    }),
    textData: new mongoose.Schema({
        state: {
            type: Boolean,
            default: false
        },
        responded: {
            type: Boolean,
            default: false
        }
    }),
    locationInfo:new mongoose.Schema({
        name: {
            type: String,
            default: 'Name Not Specified'
        },
        address: {
            type: String,
            default: 'Unknown'
        }
    })
}

module.exports = {
    locationTemplate: new mongoose.Schema({
        info: subDocs.locationInfo,
        monthlySchedule: [
            {   
                weekOf: {
                    type: 'Date',
                    default: new Date()
                },
                prayers: {
                    timing: {
                        type: Date,
                        default: new Date()
                    },
                    data: subDocs.khateebData,
                    confirm: subDocs.textData,
                    savedOn: Date
                }
            }
        ]
    })
}

