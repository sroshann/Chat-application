import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create(( set, get ) => ({ 

    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers : async () => {

        try {

            set({ isUsersLoading : true })
            const response = await axiosInstance.get('/message/getUsersForSidebar')
            set({ users : response?.data })

        } 
        catch ( error ) { toast.error( error?.response?.data?.error ) }
        finally { set({ isUsersLoading : false }) }

    },

    getMessages : async ( userId ) => {

        try {

            set({ isMessagesLoading : true })
            const response = await axiosInstance.get(`/message/getMessage/${ userId }`)
            set({ messages : response?.data })

        } 
        catch( error ) { toast.error( error?.response?.data?.error ) }
        finally { set({ isMessagesLoading : false }) }

    },

    sendMessage : async ( messageData ) => {

        try{

            const { selectedUser, messages } = get()
            const response = await axiosInstance.post(`/message/sendMessage/${ selectedUser._id }`, messageData)
            set({ messages : [ ...messages, response.data ] })

        } catch ( error ) { toast.error( error?.response?.data?.error ) }

    },

    setSelectedUser : ( selectedUser ) => set({ selectedUser }),

    getRealtimeMessages : () => {

        try {

            const { selectedUser } = get()
            if( !selectedUser ) return

            // Updating the message event from backend
            const socket = useAuthStore.getState().socket
            socket.on("newMessage", ( newMessage ) => {

                if( newMessage.senderId !== selectedUser._id ) return
                set({ messages : [ ...get().messages, newMessage ] })
            
            })

        } catch ( error ) { toast.error('Error occured on getting realtime messages') }

    },

    removeRealtimeMessage : () => {

        try {

            // Closing the event connection from selected user changes
            const { socket } = useAuthStore.getState()
            socket.off("newMessage")

        } catch ( error ) { toast.error('Error occured on removing realtime messages') }

    }

}))