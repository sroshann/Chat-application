import { Server } from 'socket.io'
import http from "http"
import express from 'express'

const app = express()
const server = http.createServer( app )

// Used to store current online users
const io = new Server( server, {
    
    cors : { origin : ["http://localhost:5173"] }
    
}) 

const storeOnlineUsers = {}
export const getReceiverSocketId = ( receiverId ) => { return storeOnlineUsers[ receiverId ] }

io.on("connection", ( socket ) => { 
    
    console.log("User connected = ", socket.id) 

    // Adding online users to storeOnlineUsers with their db _id and socket id
    const userId = socket.handshake.query.userId
    if( userId ) storeOnlineUsers[ userId ] = socket.id

    // io.emit() is used to send event to all the connected clients
    io.emit('getOnlineUsers', Object.keys( storeOnlineUsers ))

    socket.on("disconnect", () => { 
        
        console.log("User disconnected = ", socket.id) 
        delete storeOnlineUsers[ userId ]
        io.emit('getOnlineUsers', Object.keys( storeOnlineUsers ))
    
    })

})

export { io, app, server }