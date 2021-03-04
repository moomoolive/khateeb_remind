const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

// set enviromental variable from a .env file at project root
// look at the README for required enviromental factors
if (process.env.NODE_ENV === 'production')
    dotenv.config()
const dbSettings = require('./db.config.js')

// across the app: 
// "_" stands for the app's utility library
// "$db" stands for database models
// $DIR stands for root folder
global.$DIR = path.resolve(__dirname)
global._ = require($DIR + '/utils/index.js')
global.$db = require($DIR + '/database/index.js')

// some configurations for the app 
global.APP_CONFIG = require('./server.config.js')

const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'

const app = express()
mongoose.connect(DATABASE, dbSettings)
const db = mongoose.connection

const globalMiddleWare = require('./middleware/globalMiddleware/main.js')
const queryBoolParser = require('express-query-boolean')

app.use(cors())
app.use(express.json())
app.use(globalMiddleWare.generalError)
app.set('query parser', 'extended')
app.use(queryBoolParser())

app.options('*', cors())
app.post('*', globalMiddleWare.noEmptyBody)
app.put('*', globalMiddleWare.noEmptyBody)

const routes = require($DIR + '/routing/index.js')

app.use('/jummahs', routes.jummahs)
app.use('/locations', routes.locations)
app.use('/timings', routes.timings)
app.use('/khateebs', routes.khateebs)
app.use('/announcements', routes.announcements)
app.use('/settings', routes.settings)
app.use('/institutions', routes.institutions)
app.use('/institutionAdmins,', routes.institutionAdmins)
app.use('/misc', routes.misc)
app.use('/auth', routes.auth)
app.use('/sysAdmin', routes.sysAdmin)
app.use('/user', routes.user)

db.once('open', () => { 
    const dbType = DATABASE.split(':')[0] === 'mongodb' ? 'Local' : 'Production'
    console.log(`${dbType} Mongo is listening`)
    const cronJobs = require('./cron/jobPipeline.js')
    cronJobs.start() 
})
db.on('error', (error) => { console.log(`Connection error : ${error}`) })

app.listen(APP_CONFIG.network.port, () => { console.log(`App is listening on port ${APP_CONFIG.network.port}`) })