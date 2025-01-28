import express from 'express'
import { connectDB } from './lib/db.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'

const app = express()
app.use( express.json() )
app.use( cookieParser() )

app.use('/authentication', authRouter)
app.use('/message', messageRouter)
dotenv.config()

app.listen( 5000, () => {

    console.log('Server is running on 5000')
    connectDB()

})