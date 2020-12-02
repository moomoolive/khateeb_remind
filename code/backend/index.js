import express from 'express'
import cors from 'cors'

import { adminRoutes } from './routing/adminRoutes.js'
import { generalRouting } from './routing/generalRouting.js'

const app = express()

const PORT = process.env.PORT || 5_000

app.use(cors())
app.use(express.json())

app.use('/general', generalRouting)

app.use('/admin', adminRoutes)

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})