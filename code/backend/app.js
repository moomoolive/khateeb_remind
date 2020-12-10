import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { middleware } from './utils/middleware.js'

import { adminRoutes } from './routing/adminRoutes.js'
import { generalRoutes } from './routing/generalRoutes.js'
import { initializeRoutes } from './routing/initializeRoutes.js'

const PORT = process.env.PORT || 5_000
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const LOGIN_KEY = process.env.LOGIN_KEY || 'password'

const app = express()
mongoose.connect(DATABASE, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection

app.use(cors())
app.use(express.json())

app.use(middleware.generalError)
app.post('*', middleware.noEmptyBody)
app.delete('*', [middleware.noEmptyBody, middleware.validationCheck(['_id'])])

app.use('/general', generalRoutes)
app.use('/admin', adminRoutes)
app.use('/initialize', initializeRoutes)

db.once('open', () => { console.log(`Database listening on ${DATABASE}`) })
db.on('error', (error) => { console.log(`Connection error : ${error}`) })
app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })

export default {JWT_SECRET, LOGIN_KEY}