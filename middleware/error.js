const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (error, req, res, next) => {
    let responseError = {...error}
    console.log(error)

    if (error.code === 11000) {
        const message = `Duplicate field value entered`
        responseError = new ErrorResponse(message, 400)
    }

    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors)
            .map(value => value.message)
        responseError = new ErrorResponse(message, 400)
    }

    if (error.name === 'CastError') {
        const message = `Resource not found with id of ${error.value}`
        responseError = new ErrorResponse(message, 404)
    }
    res.status(responseError.statusCode || 500).json({
        success: false,
        error: responseError.message || 'Server Error'
    })
}

module.exports = errorHandler