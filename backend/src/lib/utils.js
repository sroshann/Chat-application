import jwt from 'jsonwebtoken'

// Generate jwt token
export const generateToken = ( userId, response ) => {

    // Generating jwt token with user id which expires in 1 day
    const token = jwt.sign( { userId }, process.env.JWT_SECRET, { expiresIn : "1d" } )

    // The generated cookie is stored into cookie
    response.cookie("jsonWebToken", token, {

        maxAge : 1 * 24 * 60 * 60 * 1000, // Converting 1 day into milliseconds
        httpOnly : true, // Prevent XSS attack
        sameSite : "strict",
        secure : process.env.NODE_ENV !== "development"

    })

    return token

}