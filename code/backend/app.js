import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { middleware } from './utils/middleware.js'
import { routes } from './routing/index.js'
import { dbSettings } from './database/settings.js'

const PORT = process.env.PORT || 5_000
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const API_KEY = process.env.API_KEY || '1234'

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
app.use('/initialize', routes.initialize)
app.use('/misc', routes.misc)
app.use('/text', routes.text)

db.once('open', () => { console.log(`Database listening on ${DATABASE}`) })
db.on('error', (error) => { console.log(`Connection error : ${error}`) })
app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })

export default { JWT_SECRET, API_KEY }