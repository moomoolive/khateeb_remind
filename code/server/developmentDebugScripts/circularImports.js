const path = require("path")
const madge = require('madge')

madge(path.resolve(__dirname, "../Server.js"))
    .then(res => console.log(res.circularGraph()))
    .catch(err => console.error(err))