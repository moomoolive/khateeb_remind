const express = require('express')
const validator = require('express-validator')
const fs = require('fs')
const path = require("path")

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const router = express.Router()

// temporarily logos will be stored in the localstorage system

router.get('/', 
    validationMiddleware.validateRequest([
        validator.query("institutionID").isString().isLength(global.APP_CONFIG.consts.mongooseIdLength)
    ], "query"),
    (req, res) => {
        fs.readFile(path.join(global.$dir, "uploads", `${req.query.institutionID}-logo`), (err, f) => {
            if (err)
                return res.json({ msg: `Err occured when opening file. Err trace: ${err}` })
            res.setHeader("Content-Type", "image/png")
            return res.send(f)
        })
})

router.put('/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        // an array of bytes
        validator.body("img").isArray({ min: 2 }).custom(value => {
            if (!value.every(Number.isInteger))
                throw TypeError(`Array must contain only integers`)
            if (!value.every(value => value > -1 && value < 256))
                throw TypeError(`Array must include only unsigned 8-bit integers`)
            return true
        })
    ]),
    (req, res) => {
        const binaryImg = new Uint8Array(req.body.img)
        fs.writeFile(path.join(global.$dir, "uploads", `${req.headers.institutionid}-logo`), binaryImg, err => {
            if (!err)
                return res.json({ data: { code: 0 }, msg: "successfully uploaded logo" })
            console.log(err)
            return res.status(503).json({ data: { code: 1 }, msg: `couldn't update institution logo. Err trace: ${err}` })
        })
    }
)

router.delete("/", 
    authMiddleware.authenticate({ min: 2, max: 3 }),
    (req, res) => {
        fs.unlink(path.join(global.$dir, "uploads", `${req.headers.institutionid}-logo`), err => {
            if (err) {
                return res.status(503).json({ data: { code: 0 }, msg: `Couldn't delete institution. Err trace: ${err}` })
            }
            return res.json({ data: { code: 1 } })
        })
    }
)

module.exports = router