const express = require('express')
const mongo = require("mongodb")

const app = express()
const PORT = process.env.PORT || 90
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/'

mongo.MongoClient.connect(DATABASE, { useUnifiedTopology: true })
    .then(client => {
        const db = client.db('khateebRemind')
        const collection = db.collection("shortenedurls")
        app.locals.collection = collection
        console.log(`Mongo is listening`)
        app.listen(PORT, () => { console.log(`URL-shortener listening on port ${PORT}`) })
    })
    .catch(err => { console.log(err) })

app.get('/:shortCode', async (req, res) => {
    try {
        const url = await req.app.locals.collection.findOne({ shortURLCode: req.params.shortCode })
        const redirect = url ? `https://${url.longURL}` : 'https://app.khateebs.com'
        let script = `window.location.replace("${redirect}")`
        if (!url)
            script += `\nalert("That link doesn't exist or has expired! Redirecting you to home.")`
        res.send(`<script>${script}</script>`)
    } catch(err) {
        console.log(`Couldn't get short url`)
        res.json(`An error occured`)
    }
})