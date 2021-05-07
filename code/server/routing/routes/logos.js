const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const cloudStorageHelpers = require($rootDir + '/libraries/cloudStorage/main.js')

const { thirdPartyServicesConfig } = require($rootDir + '/Server.config.js')

const router = express.Router()

const TARGET_LOGO_SUBDIRECTORY = thirdPartyServicesConfig.AWS.cloudSubDirectories.logos

router.get('/', 
    validationMiddleware.validateRequest([
        validator.query("institutionID").isString().isLength($config.consts.mongooseIdLength)
    ], "query"),
    async (req, res) => {
        const { file, status, msg="none" } = await cloudStorageHelpers.getFile(`${TARGET_LOGO_SUBDIRECTORY}${req.query.institutionID}`)
        if (status !== 200)
            return res.json({ cloudRes: status, msg })
        res.setHeader("Content-Type", "image/png")
        return res.send(file)
})

router.put('/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
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
        const { code, msg="successfully uploaded logo" } = await cloudStorageHelpers.uploadFile(binaryImg, `${TARGET_LOGO_SUBDIRECTORY}${req.headers.institutionid}`)
        return res.json({ data: { code }, msg })
    }
)

router.delete("/", 
    authMiddleware.authenticate({ min: 3, max: 4 }),
    async (req, res) => {
        const { code, msg="successfully deleted logo" } = await cloudStorageHelpers.deleteFile(`${TARGET_LOGO_SUBDIRECTORY}${req.headers.institutionid}`)
        return res.json({ data: { code }, msg })
    }
)

module.exports = router