const express = require("express")
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const { restTokens } = require($rootDir + "/database/public.js")

const router = express.Router()

router.get("/", 
    authMiddleware.authenticate({ min: 3, max: 4 }),
    async (req, res) => {
        try {
            const data = await restTokens.query({
                filter: { institution: req.headers.institutionid }
            })
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: [], msg: `Couldn't get rest tokens ${err}`  })
        }
})

router.post("/", 
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.body("tag").isString().isLength({ min: 1 })
    ]),
    async (req, res) => {
        try {
            const data = await restTokens.createEntry({ 
                entry: { ...req.body, institution: req.headers.institutionid } 
            })
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: [], msg: `Couldn't get rest tokens ${err}`  })
        }
})

router.delete("/",
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength($config.consts.mongooseIdLength).isString()
    ], "query"),
    async (req, res) => {
        try {
            const [target] = await restTokens.query({ filter: req.query._id })
            const instituionDoesNotOwnData = target.institution.toString() !== req.headers.institutionid
            if (!target || instituionDoesNotOwnData) {
                return res.status(403).json({ data: {}, msg: `You're not allow to delete requested data` })
            }
            const data = await restTokens.deleteEntry({ filter: req.query._id })
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: {}, msg: "Couldn't delete auth token" })
        }
    }
)

module.exports = router