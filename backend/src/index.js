import express from 'express'
import { connectDB } from './lib/db.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'

const app = express()
app.use( express.json({ limit : "10mb" }) )
app.use( cookieParser() )
app.use( cors({

    origin : "http://localhost:5173",
    credentials : true

}))

app.use('/authentication', authRouter)
app.use('/message', messageRouter)
dotenv.config()

app.listen( 5000, () => {

    console.log('Server is running on 5000')
    connectDB()

})