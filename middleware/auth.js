const jwt = require("jsonwebtoken")
const asyncHandler = require("./async")
const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/User")

exports.protect = asyncHandler(async (req, res, next) => {
    const token = (() => {
        if (req.headers.authorization || req.headers.authorization.startsWith('Bearer')) {
            return req.headers.authorization.split(' ')[1]
                .trim() || undefined
        } else if (req.cookies.token) {
            return req.cookies.token
        }
    })()

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        const id = jwt.verify(token, process.env.JWT_SECRET)
            .id
        req.user = await User.findById(id)

        next()
    } catch (e) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
})

exports.authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }
    next()
}