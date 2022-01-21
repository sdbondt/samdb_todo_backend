const express = require('express')
const { login, register, getProfile } = require('../controllers/userController')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.get('/profile', auth, getProfile)

module.exports =  router
