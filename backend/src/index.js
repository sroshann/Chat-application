import express from 'express'
import { connectDB } from './lib/db.js'
const app = express()

app.listen( 5000, () => {

    console.log('Server is running on 5000')
    connectDB()

})