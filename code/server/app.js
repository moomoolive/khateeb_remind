const path = require('path')
const dotenv = require('dotenv')

// set enviromental variables from a .env file at project root
// look at the README for required enviromental factors
if (process.env.NODE_ENV === 'production')
    dotenv.config()

global.$dir = path.resolve(__dirname)
global.APP_CONFIG = require('./server.config.js')
const dbSettings = require('./db.config.js')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const queryType = require('query-types')
const qs = require('qs')

const textManager = require('./libraries/text/textManager.js')
const cronJobs = require('./cron/jobPipeline.js')
const globalMiddleWare = require('./middleware/global/main.js')

global.utils = require('./libraries/globalUtilities.js')
global.$db = require('./database/main.js')
global.textManager = new textManager()

const routes = require('./routing/index.js')

const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'

const app = express()
mongoose.connect(DATABASE, dbSettings)
const db = mongoose.connection

app.use(cors())
app.use(express.json())
app.use(globalMiddleWare.generalError)
app.set('query parser', str => qs.parse(str, { comma: true }))
app.use(queryType.middleware())

app.options('*', cors())
app.post('*', globalMiddleWare.noEmptyBody)
app.put('*', globalMiddleWare.noEmptyBody)

app.use('/jummahs', routes.jummahs)
app.use('/locations', routes.locations)
app.use('/timings', routes.timings)
app.use('/khateebs', routes.khateebs)
app.use('/announcements', routes.announcements)
app.use('/institutions', routes.institutions)
app.use('/institutionAdmins', routes.institutionAdmins)
app.use('/misc', routes.misc)
app.use('/auth', routes.auth)
app.use('/sysAdmin', routes.sysAdmin)
app.use('/user', routes.user)

db.once('open', () => { 
    const dbType = DATABASE.split(':')[0] === 'mongodb' ? 'Local' : 'Production'
    console.log(`${dbType} Mongo is listening`)
    cronJobs.start()
    global.textManager.initializeSettings()
})
db.on('error', (error) => { console.log(`Connection error : ${error}`) })
app.listen(global.APP_CONFIG.network.port, () => { console.log(`App is listening on port ${global.APP_CONFIG.network.port}`) })