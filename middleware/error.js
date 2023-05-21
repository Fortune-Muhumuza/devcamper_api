const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (error, req, res, next) => {
    let responseError = {...error}
    console.log(error.stack.red)

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