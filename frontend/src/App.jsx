import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import SettingsPage from './Pages/SettingsPage'
import ProfilePage from './Pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'

function App() {

    const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
    useEffect( () => { checkAuth() }, [ checkAuth ] )

    if( isCheckingAuth && !authUser ) return (

        <div className='flex items-center justify-center h-screen'>

            <Loader className="size-10 animate-spin" />

        </div>

    )

    return (

        <div>

            <Routes>

                <Route path='/' element={ authUser ? <HomePage /> : <Navigate to="/login" /> } />
                <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to='/login' /> } />
                <Route path='/signup' element={ !authUser ? <SignupPage /> : <Navigate to='/' /> } />
                <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to='/' /> } />
                <Route path='/settings' element={ <SettingsPage /> } />

            </Routes>

        </div>

    )

}

export default App