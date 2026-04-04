require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express')
const app = express()
const cors = require('cors')                // Allows frontend and backend to communicate.
const dbConnect = require('./config/db')
const urlRoutes = require('./routes/urlRoutes')
const authRoutes = require('./routes/authRoutes')
dbConnect()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Server is running")
})

app.use('/api/auth', authRoutes)
app.use('/',urlRoutes)
const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT,()=>{
        console.log(`Server is running on port ->> ${PORT}`)
    })
}

module.exports = app;