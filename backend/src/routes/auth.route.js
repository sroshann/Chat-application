import express from 'express'
import { getAuthenticatedUserDataCntrlr, loginController, logoutController, signupController, updateProfileController } 
    from '../controller/auth.controller.js'
import { protectUserRoute } from '../middleware/auth.middleware.js'
const router = express()

// Signup
router.post('/signup', signupController)

// Login
router.post('/login', loginController)

// Logout
router.post('/logout', logoutController)

// Update profile
router.put('/updateProfile', protectUserRoute, updateProfileController)

// Get autheorized user data
router.get('/getAuthorizedUserData', protectUserRoute, getAuthenticatedUserDataCntrlr)

export default router