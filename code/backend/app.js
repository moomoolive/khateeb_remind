import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import twilio from 'twilio'

import { middleware } from './middleware/main.js'
import { routes } from './routing/index.js'
import { dbSettings } from './database/settings.js'

const PORT = process.env.PORT || 5_000
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const EMERGENCY_KEY = process.env.EMERGENCY_KEY || '1234'
const TEXT = twilio(process.env.TWILIO_USER, process.env.TWILIO_KEY)

const app = express()
mongoose.connect(DATABASE, { ...dbSettings })
const db = mongoose.connection

app.use(cors())
app.use(express.json())

app.use(middleware.generalError)
app.post('*', middleware.noEmptyBody)
app.delete('*', [middleware.noEmptyBody, middleware.validationCheck(['_id'])])

app.use('/general', routes.general)
app.use('/admin', routes.admin)
app.use('/misc', routes.misc)
app.use('/text', routes.text)

db.once('open', () => { console.log(`Mongo is listening`) })
db.on('error', (error) => { console.log(`Connection error : ${error}`) })
app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })

export default { 
    jwt: JWT_SECRET,
    emergency_key: EMERGENCY_KEY,
    text: TEXT
}