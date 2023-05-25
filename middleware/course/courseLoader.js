const asyncHandler = require("../async")
const Course = require("../../models/Course")
const ErrorResponse = require("../../utils/errorResponse");

module.exports = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)

    if (!course) {
        next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401))
    }

    req.course = course
    next()
})