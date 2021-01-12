const mongoose = require('mongoose')

module.exports = {
    admin: new mongoose.Schema({
        options: {
            firstName: String,
            lastName: String,
            phoneNumber: String
        }
    }),
    locationAndTiming: new mongoose.Schema({
        options: [
            {
                info: {
                    name: String,
                    address: String
                },
                timings:[Date]
            }
        ]
    }),
    password: new mongoose.Schema({
        options: String
    }),
    textPhone: new mongoose.Schema({
        options: {
            phoneNumber: String
        }
    }),
    textAPI: new mongoose.Schema({
        options: {
            user: String,
            key: String
        }
    }),
    timezone: new mongoose.Schema({
        options: {
            name: String
        }
    })
}