import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'

export const useAuthStore = create( ( set ) => ({

    authUser : null,
    isSignUp : false,
    isLogin : false,
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

    }

}))