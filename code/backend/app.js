const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const twillio = require('twilio')(process.env.TWILIO_USER, process.env.TWILIO_KEY)
const dotenv = require('dotenv')

const middleware = require('./middleware/main.js')
const routes = require('./routing/index.js')
const dbSettings =  require('./database/settings.js')

if (process.env.NODE_ENV === 'production')
    dotenv.config()
const PORT = process.env.PORT || 5_000
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const EMERGENCY_KEY = process.env.EMERGENCY_KEY || '1234'
const TEXT = twillio

const app = express()
mongoose.connect(DATABASE, { ...dbSettings })
const db = mongoose.connection

app.use(cors())
app.use(express.json())
app.use(middleware.generalError)

app.options('*', cors())

app.post('*', middleware.noEmptyBody)
app.delete('*', [middleware.noEmptyBody, middleware.validationCheck(['_id'])])

app.use('/general', routes.general)
app.use('/admin', routes.admin)
app.use('/misc', routes.misc)
app.use('/text', routes.text)

db.once('open', () => { console.log(`Mongo is listening`) })
db.on('error', (error) => { console.log(`Connection error : ${error}`) })
app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })

module.exports = { 
    jwt: JWT_SECRET,
    emergency_key: EMERGENCY_KEY,
    text: TEXT
}