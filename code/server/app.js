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
global.APP_CONFIG = require('./app.config.js')

const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'

const app = express()
mongoose.connect(DATABASE, dbSettings)
const db = mongoose.connection

const middleware = require($DIR + '/middleware/main.js')

app.use(cors())
app.use(express.json())
app.use(middleware.generalError)
app.options('*', cors())
app.post('*', middleware.noEmptyBody)
app.put('*', middleware.noEmptyBody)

const routes = require($DIR + '/routing/index.js')

app.use('/khateeb', routes.khateeb)
app.use('/institutionAdmin', routes.admin)
app.use('/misc', routes.misc)
app.use('/auth', routes.auth)
app.use('/sysAdmin', routes.sysAdmin)
app.use('/user', routes.user)
app.use('/rootInstitutionAdmin', routes.rootInstitutionAdmin)

db.once('open', () => { 
    const dbType = DATABASE.split(':')[0] === 'mongodb' ? 'Local' : 'Production'
    console.log(`${dbType} Mongo is listening`)
    const cronJobs = require('./cron/jobPipeline.js')
    if (process.env.NODE_ENV === 'production')
        cronJobs.start() 
})
db.on('error', (error) => { console.log(`Connection error : ${error}`) })

app.listen(APP_CONFIG.network.port, () => { console.log(`App is listening on port ${APP_CONFIG.network.port}`) })