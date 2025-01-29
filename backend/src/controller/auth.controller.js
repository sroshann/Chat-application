import { generateToken } from "../lib/utils.js"
import UserModel from "../models/auth.model.js"
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

// Signup
export const signupController = async ( request, response ) => {

    try {

        const { fullName, phoneNumber, email, password } = request.body

        if( !fullName || !phoneNumber || !email || !password ) 
            return response.status(400).json({ error : 'All fields are required' })
        if( password.length < 6 ) return response.status(400).json({ error : 'Password must be atleast of six charecters' })

        // Check if user already exists (by email or phone)
        const userAlreadyExist = await UserModel.findOne({
    
            $or : [ { email }, { phoneNumber } ]
    
        })
        if( userAlreadyExist ) {

            if( userAlreadyExist.email === email ) return response.status(400).json({ error : "Email already exist" })
            else if( userAlreadyExist.phoneNumber === parseInt( phoneNumber, 10 ) ) 
                return response.status(400).json({ error : 'Phonenumber already exist' })

        }

        // Hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hashSync( password, salt )

        const newUser = new UserModel({

            email,
            phoneNumber,
            fullName, 
            password : hashedPassword

        })

        if( newUser ) {

            const { _id, email, phoneNumber, fullName, profilePicture } = newUser
            generateToken( _id, response ) // Generate jwt token with currently created userId and it stored into cookies
            await newUser.save()
            response.status(201).json({ _id, email, phoneNumber, fullName, profilePicture }) // 201 means something newly created

        } else return response.status(400).json({ error : 'Invalid user data' })

    } catch ( error ) { return response.status(500).json({ error : 'Error occured on signup' }) }

}

// Login
export const loginController = async ( request, response ) => {

    try {

        const { email, password } = request.body
        const user = await UserModel.findOne({ email })
        if( user ) {

            // Compare the hashed password
            const isPasswordCorrect = bcrypt.compareSync( password, user.password )
            if( isPasswordCorrect ) {

                generateToken(user._id, response)
                return response.status( 200 ).json({ 
                    
                    _id: user._id, 
                    fullName : user.fullName, 
                    phoneNumber : user.phoneNumber, 
                    email : user.email,
                    profilePicture : user.profilePicture 
                
                })

            } else return response.status( 400 ).json({ error : 'Invalid credentials' })

        } else return response.status( 400 ).json({ error : 'Invalid credentials' })

    } catch ( error ) { return response.status( 500 ).json({ error : 'Error occured on login' }) }

}

// Logout
export const logoutController = async ( request, response ) => {

    try {

        response.cookie("jsonWebToken", "", { maxAge : 0 })
        return response.status(200).json({ message : 'Logged out successfully' })

    } catch ( error ) { return response.status(500).json({ error : 'Error occured on logout' })}

}

// Update user profile
export const updateProfileController = async ( request, response ) => {

    try {

        const { fullName, profilePicture } = request.body
        const userId = request.user._id

        // Extracts only the changed values into changedData
        const changedData = {}
        if( fullName ) changedData.fullName = fullName
        if( profilePicture ) {

            const uploadResponse = await cloudinary.uploader.upload( profilePicture )
            changedData.profilePicture = uploadResponse.secure_url

        }

        if( Object.keys( changedData ).length === 0 ) return response.status( 400 ).json({ error : 'No changes were made' })
        else {
    
            const updatedUser = await UserModel.findByIdAndUpdate(
                
                userId,
                { $set : changedData },
                { new : true } // Returns the updated document
            
            )

            return response.status( 200 ).json({ message : 'Profile updated successfully', updatedUser })
    
        }

    } catch ( error ) {

        console.log(error)
        return response.status(500).json({ error : 'Error occured on logout route' })

    }

}

// Get authenticated user data
export const getAuthenticatedUserDataCntrlr = ( request, response ) => {

    try { return response.status( 200 ).json( request.user ) } 
    catch ( error ) { return response.status( 500 ).json({ error : 'Error occured on get getting user details' }) }

}