const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header Bearer <numbers>
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error){
            console.log(error)
            res.status(401)
            throw new Error('Not authrozied')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})


// checks if the current user is admin
const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user'){
        throw new Error('Not authrozied, must be an admin!')
    }
    next();
})

module.exports = {protect, isAdmin}