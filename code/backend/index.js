import express from 'express'
import cors from 'cors'
import dummyData from './dummyData.js'

const app = express()

const PORT = process.env.PORT || 5_000

app.use(cors())

app.post('/', (req, res) => {
    try {
        res.json(dummyData)
    }
    catch (err) {
        const intervalServerError = 500
        res.status(intervalServerError).send("Are servers aren't responding right now, try later...")
    }
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})