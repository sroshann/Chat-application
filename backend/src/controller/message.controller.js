import UserModel from "../models/auth.model.js"
import MessageModel from '../models/message.model.js'
import cloudinary from '../lib/cloudinary.js'

// Get users to display in sidebar
export const getUsersForSidebarCntrl = async ( request, response ) => {

    try {

        const loggedUserId = request.user._id
        // This is will fetch the all the users excecpt the current user
        const filteredUser = await UserModel.find({ _id : { $ne : loggedUserId } }).select("-password")
        response.status( 200 ).json( filteredUser )

    } catch( error ) { return response.status(500).json({ error : 'Error occured while getting all users' }) }

}   

// Get message
export const getMessagesController = async ( request, response ) => {

    try {

        const { id : userToChat } = request.params
        const myId = request.user._id

        const message = await MessageModel.find({

            $or : [

                { senderId : myId, receiverId : userToChat },
                { senderId : userToChat, receiverId : myId }

            ]

        })

        return response.status(200).json( message )

    } catch( error ) {

        console.log('Error occured on gettting messages')
        return response.status(500).json({ error : 'Error occured on getting messages' })

    }

}

// Send message
export const sendMessagesController = async ( request, response ) => {

    try {

        let { text, image } = request.body
        const { id : receiverId } = request.params
        const senderId = request.user._id

        if( image ) {

            // Upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            image = uploadResponse.secure_url

        }

        const newMessage = new MessageModel({

            senderId,
            receiverId,
            text,
            image

        })
        
        const savedMessage = await newMessage.save()
        return response.status(201).json(savedMessage)
        // implement socket.io functionality

    } catch( error ) {

        console.log(error)
        return response.status( 500 ).json({ error : 'Error occured on sending message' })

    }

}