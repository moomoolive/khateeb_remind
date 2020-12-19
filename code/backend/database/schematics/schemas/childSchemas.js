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
                timings:[
                    {
                        hour: String,
                        minutes: String,
                        AMorPM: String
                    }
                ]
            }
        ]
    }),
    password: new mongoose.Schema({
        options: String
    })
}