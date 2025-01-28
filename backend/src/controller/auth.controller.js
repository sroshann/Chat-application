import { generateToken } from "../lib/utils.js"
import UserModel from "../models/auth.model.js"
import bcrypt from 'bcryptjs'

// Signup
export const signupController = async ( request, response ) => {

    try {

        const { fullName, phoneNumber, email, password } = request.body

        if( !fullName || !phoneNumber || !email || !password ) return response.status(400).json({ warning : 'All fields are required' })
        if( password.length < 6 ) return response.status(400).json({ warning : 'Password must be atleast of six charecters' })

        // Check if user already exists (by email or phone)
        const userAlreadyExist = await UserModel.findOne({
    
            $or : [ { email }, { phoneNumber } ]
    
        })
        if( userAlreadyExist ) {

            if( userAlreadyExist.email === email ) return response.status(400).json({ warning : "Email already exist" })
            else if( userAlreadyExist.phoneNumber === parseInt( phoneNumber, 10 ) ) return response.status(400).json({ warning : 'Phonenumber already exist' })

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

        } else return response.status(400).json({ warning : 'Invalid user data' })

    } catch ( error ) { 

        console.log('Error occured on sign up controller ', error)
        response.status(500).json({ error : 'Error occured on signup' })

    }

}

// Login
export const loginController = async ( request, resposne ) => {

    try {

        resposne.send('Login')

    } catch ( error ) { console.log('Sign up') }

}

// Logout
export const logoutController = async ( request, response ) => {

    try {

        response.send('Logout')

    } catch ( error ) { console.log('Sign up') }

}