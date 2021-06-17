const express = require("express")

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        return res.json({ data: [] })
    } catch(err) {
        console.error(err)
        return res.status(503).json({ data: [], msg: `Couldn't get rest tokens ${err}`  })
    }
})

module.exports = router