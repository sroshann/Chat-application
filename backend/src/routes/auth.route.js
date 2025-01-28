import express from 'express'
import { loginController, logoutController, signupController } from '../controller/auth.controller.js'
const router = express()

// Signup
router.post('/signup', signupController)

// Login
router.get('/login', loginController)

// Logout
router.get('/logout', logoutController)

export default router