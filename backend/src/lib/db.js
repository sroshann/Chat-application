import mongoose from 'mongoose'

export const connectDB = async () => {

    try {

        const connectionString = 
        "mongodb+srv://shamilroshan:chat@cluster0.liqir.mongodb.net/chat_db?retryWrites=true&w=majority&appName=Cluster0"
        await mongoose.connect( connectionString )
        console.log( 'DB conected' )

    } catch ( error ) { console.log( error ) }

}