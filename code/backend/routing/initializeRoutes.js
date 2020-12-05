import express from 'express'
import dbModels from '../database/models.js'
import { middleware } from '../utils/middleware.js'
import scheduleFunctions from '../utils/montlySchedule.js'

const router = express.Router()
const columnData = ['Timing', 'Khateeb'] 

router.post('/location-timing', middleware.authAdmin,
(req, res) => {
    dbModels.settings.findOne({name: 'locations&Timing'}, (err, locationAndTiming) => {
        if (err) console.log(err)
        else {
            if (locationAndTiming) {
                const newSchedule = scheduleFunctions.createNewScheduleFromSettings(
                    req.body.payload.fridayDates,
                    locationAndTiming
                )
                const responseData = {
                    columnData,
                    rows: newSchedule
                }
                res.json({data: responseData, msg: 'Your first table'})
            } else res.json('No locations or timings have been found!')
        }
    })
})

export { router as initializeRoutes }