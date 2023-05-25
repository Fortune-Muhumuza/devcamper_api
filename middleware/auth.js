const jwt = require("jsonwebtoken")
const asyncHandler = require("./async")
const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/User")

exports.protect = asyncHandler(async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    const token = req.headers.authorization.split(' ')[1]
        .trim() || undefined

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        const id = jwt.verify(token, process.env.JWT_SECRET)
            .id
        req.user = await User.findById(id)

        next()
    } catch (e) {
        next(e)
    }
})