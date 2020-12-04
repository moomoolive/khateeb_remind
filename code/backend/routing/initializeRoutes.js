import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../index.js'
import schemas from '../databaseSchemas/index.js'
import httpCodes from '../utils/httpCodes.js'

// routes use for app initialization

const router = express.Router()
const JWT_SECRET = 'secret'
const columnData = ['Timing', 'Khateeb'] 

router.post('/location-timing', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        const setting = db.model('setting', schemas.settings)
        setting.findOne({name: 'locations&Timing'}, (err, locationAndTiming) => {
            if (err) console.log(err)
            else {
                if (locationAndTiming) {
                    const weeksThisMonth = req.body.payload.fridayDates
                    const tableData = locationAndTiming.options
                    const firstSchedule = { }
                    for (let location in tableData) {
                        firstSchedule[location] = {
                            info: { },
                            timing: [],
                            monthlySchedule: { }
                        }
                        firstSchedule[location].info = tableData[location].info
                        const toBeDecidedIndicator = 'TBD'
                        let timingsArray = []
                        let emptyKhateebsArray = []
                        for (let timing in tableData[location].timings) {
                            const hour = tableData[location].timings[timing].hour
                            const minutes = tableData[location].timings[timing].minutes
                            const AMorPM = tableData[location].timings[timing].timing
                            const completeTiming = `${hour}:${minutes}${AMorPM}`
                            timingsArray.push(completeTiming)
                            emptyKhateebsArray.push(toBeDecidedIndicator)
                        }
                        firstSchedule[location].timing = timingsArray
                        for (let week of weeksThisMonth) {
                            firstSchedule[location].monthlySchedule[week] = emptyKhateebsArray
                        }
                    }
                    const responseData = {
                        columnData,
                        rows: firstSchedule
                    }
                    res.json({data: responseData, msg: 'Your first table'})
                } else res.json('No locations or timings have been found!')
            }
        })
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

export { router as initializeRoutes }