const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

global.$DIR = path.resolve(__dirname)
global.$utils = require($DIR + '/utils/index.js')
global.$db = require($DIR + '/database/index.js')

if (process.env.NODE_ENV === 'production')
    dotenv.config()

const middleware = require($DIR + '/middleware/main.js')
const routes = require($DIR + '/routing/index.js')
const dbSettings =  require($DIR + '/database/settings.js')

const PORT = 80
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/khateebRemind'
const dbType = DATABASE.split(':')[0] === 'mongodb' ? 'Local' : 'Production'

const app = express()
mongoose.connect(DATABASE, { ...dbSettings })
const db = mongoose.connection

app.use(cors())
app.use(express.json())
app.use(middleware.generalError)

app.options('*', cors())

app.post('*', middleware.noEmptyBody)
const deleteRequestParams = {
    _id: {
        __type__: "str",
        required: true
    }
}
app.delete('*', [middleware.noEmptyBody, middleware.allowedFields(deleteRequestParams)])

app.use('/khateeb', routes.khateeb)
app.use('/institutionAdmin', routes.admin)
app.use('/misc', routes.misc)
app.use('/text', routes.text)
app.use('/auth', routes.auth)
app.use('/sysAdmin', routes.sysAdmin)
app.use('/root', routes.root)

db.once('open', () => { console.log(`${dbType} Mongo is listening`) })
db.on('error', (error) => { console.log(`Connection error : ${error}`) })
app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })