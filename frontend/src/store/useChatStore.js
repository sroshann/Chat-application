import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

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

    setSelectedUser : ( selectedUser ) => set({ selectedUser })

}))