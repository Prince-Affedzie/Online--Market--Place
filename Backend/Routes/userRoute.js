const express = require('express')
require('dotenv').config()

const user_router = express.Router()
const {verifyToken} = require('../MiddleWares/authMiddleware')
const {registerUser,loginUser,getProfile,updateProfile,loginSeller} = require('../Controllers/userController')
const {upload} = require('../MiddleWares/multer')

user_router.post('/user/register',registerUser)
user_router.post('/user/login',loginUser)
user_router.post('/seller/login',loginSeller)
user_router.get('/user/getprofile',verifyToken,getProfile)
user_router.put('/user/updateprofile',verifyToken,upload.single('profileImage'),updateProfile)
//user_router.get('/auth/google',googleAuth)
//user_router.get('/auth/google/callback',googleCallBackRoute)


module.exports = user_router