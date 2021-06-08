const { globalConfig, databaseConfig, networkConfig } = require('./Server.config.js')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const queryType = require('query-types')
const qs = require('qs')
const path = require('path')

// all added global variables are prepended with a '$'
global.$rootDir = path.resolve(__dirname)
global.$config = globalConfig
global.$utils = require('./libraries/globalUtilities.js')

const cronJobs = require('./cron/jobPipeline.js')
const globalMiddleWare = require('./middleware/global/main.js')

const routes = require('./routing/index.js')

const server = express()
mongoose.connect(databaseConfig.URI, databaseConfig.mongoose)
const db = mongoose.connection

server.use(cors())
server.use(express.json({ limit: networkConfig.maxJSONSize }))
server.use(globalMiddleWare.generalError)
server.set('query parser', q => qs.parse(q, { comma: true }))
server.use(queryType.middleware())

server.options('*', cors())
server.post('*', globalMiddleWare.noEmptyBody)
server.put('*', globalMiddleWare.noEmptyBody)

server.use('/jummahs', routes.jummahs)
server.use('/locations', routes.locations)
server.use('/timings', routes.timings)
server.use('/khateebs', routes.khateebs)
server.use('/announcements', routes.announcements)
server.use('/institutions', routes.institutions)
server.use('/institutionAdmins', routes.institutionAdmins)
server.use('/misc', routes.misc)
server.use('/auth', routes.auth)
server.use('/sysAdmin', routes.sysAdmin)
server.use('/user', routes.user)
server.use('/logos', routes.logos)

db.once('open', async () => { 
    const dbType = databaseConfig.URI.split(':')[0] === 'mongodb' ? 'Local' : 'Production'
    console.log(`${dbType} Mongo is listening`)
    await cronJobs.start()
})
db.on('error', (error) => { console.log(`Connection error : ${error}`) })
server.listen(networkConfig.port, () => { console.log(`server is listening on port ${networkConfig.port}`) })