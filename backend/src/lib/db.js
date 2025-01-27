import mongoose from 'mongoose'

export const connectDB = async () => {

    try {

        const connectionString = 
        "mongodb+srv://roshan:123@cluster0.ppypr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        await mongoose.connect( connectionString )
        console.log( 'DB conected' )

    } catch ( error ) { console.log( error ) }

}