import express from 'express'
import { protectUserRoute } from '../middleware/auth.middleware.js'
import { getMessagesController, getUsersForSidebarCntrl, sendMessagesController } from '../controller/message.controller.js'
const router = express()

// Get all users for sidebar
router.get('/getUsersForSidebar', protectUserRoute, getUsersForSidebarCntrl)

// Get message
router.get('/getMessage/:id', protectUserRoute, getMessagesController)

// Send message
router.post('/sendMessage/:id', protectUserRoute, sendMessagesController)

export default router