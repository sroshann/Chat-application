import express from 'express'
import { connectDB } from './lib/db.js'
import authRouter from './routes/auth.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express()
app.use( express.json() )
app.use( cookieParser() )

app.use('/authentication', authRouter)
dotenv.config()

app.listen( 5000, () => {

    console.log('Server is running on 5000')
    connectDB()

})