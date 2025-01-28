import jwt from 'jsonwebtoken'
import UserModel from '../models/auth.model.js'

export const protectUserRoute = async ( request, response, next ) => {

    try {

        // Getting jwt token from cookies
        const token = request.cookies.jsonWebToken
        if( token ) {

            // Verifying the tokens
            const decode = jwt.verify( token, process.env.JWT_SECRET )
            if( decode ) {

                // Fetching user details of user except password
                const user = await UserModel.findById( decode.userId ).select("-password")
                if( user ) {

                    request.user = user
                    next()

                } else return response.status( 404 ).json({ error : 'User not found' })

            } else return response.status(401).json({ warning : 'Invalide token' })

        } else return response.status(401).json({ warning : 'Unauthorized - no token provided' })

    } catch ( error ) {

        console.log('Error occured on protect user middleware')
        return response.status(500).json({ error : 'Unauthorized - no token provided' })

    }

}