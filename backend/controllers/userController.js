const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const e = require('express')

// Register user
const registerUser = asyncHandler(async(req,res) => {
    const { name, email, password, role } = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({email})
    if (userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

// authorize user
const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body

    // Check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }

})

// Get users
const getMe = asyncHandler(async(req,res) => {
    const {_id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        role,
    })
})

// Generate JWT that lasts 30 days
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const getUsers = asyncHandler(async(req,res) => {
    User.find().then(data => {
        res.json(data)
    }).catch(e => {
        res.json({ message: e })
    })
})

// get user
const getUser = asyncHandler(async(req,res) => {
    try {
        User.find({ _id: req.params.id }).then(data => {
            res.json(data)
        })
    } catch (err) {
        res.json({ message: err });
    }
});

const deleteUser = asyncHandler(async (req,res) =>{
    User.deleteOne({ _id: req.params.id })
        .then(data => {
            res.json(data)
        }).catch(e => {
            res.json({ message: e })
        })
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
  
    // Check for user
    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  
    res.status(200).json(updateUser)
  })

module.exports ={
    deleteUser,
    registerUser,
    loginUser,
    getMe,
    getUser,
    getUsers,
    updateUser
}