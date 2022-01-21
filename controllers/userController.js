const User = require('../models/User')
const CustomError = require('../errorHandlers/customError')
const { StatusCodes } = require('http-status-codes')
const asyncHandler = require('../errorHandlers/asyncHandler')

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError('Please provide an email and password.', StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({ email })
    
    if (!user) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    }

    const isMatch = await user.comparePassword(password)
    console.log(isMatch)
    if (!isMatch) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    } else {
        const token = user.getJWT()
        res.status(StatusCodes.OK).json({ user: { name: user.name}, token })
    }
})

exports.register = asyncHandler(async (req, res) => {
    console.log(req.body)
    const user = await User.create({...req.body})
    const token = user.getJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, id: user.id}, token })
})


exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('todos')
    const todos = user.todos
    console.log(user.todos)
    res.status(StatusCodes.OK).json({ user, todos})
})
