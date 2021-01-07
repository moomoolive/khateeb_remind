import mongoose from 'mongoose'

export default {
    admin: new mongoose.Schema({
        options: {
            firstName: String,
            lastName: String,
            phoneNumber: String,
            email: String
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
    })
}