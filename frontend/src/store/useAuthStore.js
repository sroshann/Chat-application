import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create( ( set ) => ({

    authUser : null,
    isSigningUp : false,
    isLoggingin : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,

    checkAuth : async () => {

        try {

            const response = await axiosInstance.get('/authentication/getAuthorizedUserData')
            set({ authUser : response?.data })

        } catch( error ) {

            console.log( 'Error on gwtting authorized user = ',error )
            set({ authUser : null })

        } finally { set({ isCheckingAuth : false }) }

    },

    signup : async ( data ) => {

        try {

            set({ isSigningUp : true })
            const response = await axiosInstance.post('/authentication/signup', data)
            if( response?.data?.warning ) toast.error( response?.data?.warning )
            else {
        
                set({ authUser : response?.data })
                toast.success('Account created successfully')
                
            }

        } 
        catch ( responseError ) { 
            
            const { error } = responseError?.response?.data
            if( error ) toast.error( error ) 
        
        } 
        finally { set({ isSigningUp : false }) }

    },

    login : async ( data ) => {

        try{

            set({ isLoggingin : true })
            const response = await axios.post('/authentication/login', data)
            if( response?.data?.warning ) toast.error( response?.data?.warning )
            else {
        
                set({ authUser : response?.data })
                toast.success('Logged in successfully')
                
            }

        } 
        catch( responseError ) {

            const { error } = responseError?.response?.data
            if( error ) toast.error( error )

        }
        finally { set({ isLoggingin : false }) }

    },

    logout : async () => {

        try {

            const response = axiosInstance.post('/authentication/logout')
            set({ authUser : null })
            toast.success( response?.data?.message )

        } catch( responseError ) {

            const { error } = responseError?.response?.data
            if( error ) toast.error( error )

        }

    },

    updateProfile : async ( data ) => {

        try {

            set({ isUpdatingProfile : true })
            const response = await axiosInstance.put('/authentication/updateProfile', data)
            if( response?.data?.warning ) toast.error( response?.data?.warning )
            else {
        
                set({ authUser : response?.data })
                toast.success('Profile updated successfully')
        
            }

        } 
        catch ( responseError ) { toast.error( responseError?.response?.data?.error ) } 
        finally { set({ isUpdatingProfile : false }) }

    }

}))