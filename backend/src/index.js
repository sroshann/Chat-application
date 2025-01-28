import express from 'express'
import { connectDB } from './lib/db.js'
import authRouter from './routes/auth.route.js'

const app = express()
app.use( express.json() )
app.use('/authentication', authRouter)

app.listen( 5000, () => {

    console.log('Server is running on 5000')
    connectDB()

})