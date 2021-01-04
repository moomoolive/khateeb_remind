import express from 'express'

const router = express.Router()

router.post('/hub', express.urlencoded({extended: true}),(req, res) => {
    console.log(req.body)
})

export { router as text }