const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const cloudStorageHelpers = require(global.$dir + '/libraries/cloudStorage/main.js')

const router = express.Router()

router.get('/', 
    validationMiddleware.validateRequest([
        validator.query("institutionID").isString().isLength(global.CONFIG.consts.mongooseIdLength)
    ], "query"),
    async (req, res) => {
        const { file, status, msg="none" } = await cloudStorageHelpers.getFile(`img/logos/${req.query.institutionID}`)
        if (status !== 200)
            return res.json({ cloudRes: status, msg })
        res.setHeader("Content-Type", "image/png")
        return res.send(file)
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
    async (req, res) => {
        const binaryImg = new Uint8Array(req.body.img)
        // not saving file extension because current cloud provider doesn't support
        // searching for multiple extensions in one request
        const { code, msg="successfully uploaded logo" } = await cloudStorageHelpers.uploadFile(binaryImg, `img/logos/${req.headers.institutionid}`)
        return res.json({ data: { code }, msg })
    }
)

router.delete("/", 
    authMiddleware.authenticate({ min: 2, max: 3 }),
    async (req, res) => {
        const { code, msg="successfully deleted logo" } = await cloudStorageHelpers.deleteFile(`img/logos/${req.headers.institutionid}`)
        return res.json({ data: { code }, msg })
    }
)

module.exports = router