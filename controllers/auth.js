const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const User = require("../models/User")


// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body

    const user = await User.create({
        name, email, password, role
    })

    await sendTokenResponse(user, 200, res)
})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        return next(new ErrorResponse(`Please provide email and password`), 400)
    }

    const user = await User.findOne({email})
        .select('+password')

    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`), 401)
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse(`Invalid credentials`), 401)
    }

    await sendTokenResponse(user, 200, res)
})

const sendTokenResponse = async (user, statusCode, res) => {
    const token = await user.getSignedJwtToken()
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}