import express from 'express'
import jwt from 'jsonwebtoken'

import dummyKhateebs from '../dummyKhateebs.js'
import dummyDataMonths from '../dummyDataMonths.js'

const router = express.Router()

const JWT_SECRET = 'secret'

router.post('/new-announcement', (req, res) => {
    const unauthorized = 401
    const notAcceptable = 406
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        if (!req.body.payload) {
            res.status(notAcceptable)
            res.json('No data was sent')
        } else {
            console.log(req.body)
            res.json('Successfully added announcement!')
        }
    }
    catch {
        res.json({data: null, msg: 'Unauthorized'})
        res.status(unauthorized)
    }
})

router.post('/scheduler', (req, res) => {
    const unauthorized = 401
    const notAcceptable = 406
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        if (req.body.month) {
            if(!dummyDataMonths[req.body.month]) {
                res.json({ data: null, msg: "No data recorded for given month"})
            } else res.json({data: dummyDataMonths[req.body.month], msg:'Data Found' })
        } else {
            res.status(notAcceptable)
            res.json({ data: null, msg: "You're missing required data for request!" })
        }
    }
    catch {
        res.status(unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

// for database storage, not finished yet
router.post('/update-schedule', (req, res) => {
    const unauthorized = 401
    const notAcceptable = 406
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        if (!req.body.updatedSchedule || !req.body.originalSchedule) {
            res.status(notAcceptable)
            res.json('No data was sent')
        } else {
            // api will then compare changes between original and updated
            // at some point
            console.log('success!')
            res.json('Successfully updated schedule!')
        }
    }
    catch {
        res.status(unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

router.post('/khateebs', (req, res) => {
    const unauthorized = 401
    try {
        const token = req.body.token
        console.log(token)
        jwt.verify(token, JWT_SECRET)
        res.json(dummyKhateebs)
    }
    catch {
        res.status(unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

export {router as adminRoutes}