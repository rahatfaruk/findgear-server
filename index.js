const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port =  process.env.PORT || 3000

// ## middleware
app.use(cors())

// ## routes
app.get('/', (req, res) => {res.send('welcome!')})

// ## run server
app.listen(port, () => {console.log('listening on http://localhost:'+port)})