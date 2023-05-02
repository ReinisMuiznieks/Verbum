const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getUser, getUsers } = require('../controllers/userController')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/', getUsers)
router.get('/:id', getUser)

module.exports = router