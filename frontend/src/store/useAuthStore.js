import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import io from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : ""
export const useAuthStore = create( ( set, get ) => ({

    authUser : null,
    isSigningUp : false,
    isLoggingin : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,
    onlineUsers : [],
    socket : null,

    checkAuth : async () => {

        try {

            const response = await axiosInstance.get('/authentication/getAuthorizedUserData')
            set({ authUser : response?.data })
            get().connectSocket()

        } 
        catch( error ) { set({ authUser : null }) } 
        finally { set({ isCheckingAuth : false }) }

    },

    signup : async ( data ) => {

        try {

            set({ isSigningUp : true })
            const response = await axiosInstance.post('/authentication/signup', data)
            set({ authUser : response?.data })
            get().connectSocket()
            toast.success('Account created successfully')

        } 
        catch ( responseError ) { toast.error( responseError?.response?.data?.error ) } 
        finally { set({ isSigningUp : false }) }

    },

    login : async ( data ) => {

        try{

            set({ isLoggingin : true })
            const response = await axiosInstance.post('/authentication/login', data)
            set({ authUser : response?.data })
            get().connectSocket()
            toast.success('Logged in successfully')

        } 
        catch( responseError ) { toast.error( responseError?.response?.data?.error ) }
        finally { set({ isLoggingin : false }) }

    },

    logout : async () => {

        try {

            const response = await axiosInstance.post('/authentication/logout')
            set({ authUser : null })
            get().disConnectSocket()
            toast.success( response?.data?.message )

        } catch( responseError ) { toast.error( responseError?.response?.data?.error ) }

    },

    updateProfile : async ( data ) => {

        try {

            set({ isUpdatingProfile : true })
            const response = await axiosInstance.put('/authentication/updateProfile', data)
            set({ authUser : response?.data?.updatedUser })
            toast.success('Profile updated successfully')

        } 
        catch ( responseError ) { toast.error( responseError?.response?.data?.error )  } 
        finally { set({ isUpdatingProfile : false }) }

    },

    connectSocket : async () => {

        try {

            const { authUser } = get()

            // If user is authenticated or there is already a connection then dont create a connection
            if( !authUser || get().socket?.connected ) return
            const socket = io( BASE_URL, {

                // To get the connected user at backend
                query : { userId : authUser._id }

            } )
            socket.connect()
            set({ socket })

            // Listening to the events from backend
            socket.on("getOnlineUsers", ( usrerIds ) => {

                set({ onlineUsers : usrerIds })

            })

        } catch ( error ) { toast.error("Error occured on connecting socket.io") }

    },

    disConnectSocket : () => { if( get().socket?.connected ) get().socket?.disconnect() }

}))