const express = require ('express')
const mongoose = require ('mongoose')
const morgan = require ('morgan')
require ('dotenv').config()
const dbConnection = require('./src/Config/db')
const router = require('./src/Routes/user.routes')
const app = express()
const port = process.env.PORT || 4000


app.use (express.json());
app.use (morgan ('dev'));

app.use ('/api/users', router)


app.get('/', (req, res) => {
    return res.send ('homepage')
})


app.listen (port, () => {
    dbConnection ()
    console.log (`app listening at http://localhost:${port}`)
})