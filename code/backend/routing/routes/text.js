import express from 'express'

const router = express.Router()

router.post('/hub', express.urlencoded({extended: true}),(req, res) => {
    console.log(req.body) //TBD to process text and send them to relevant places
})

export { router as text }