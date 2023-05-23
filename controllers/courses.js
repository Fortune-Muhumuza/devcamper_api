const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const Course = require("../models/Course")

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    const bootcampId = req.params.bootcampId || undefined

    const query = bootcampId ? Course.find({bootcamp: bootcampId}) : Course.find()
        // .populate('bootcamp')
        .populate('bootcamp', 'name description _id')

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})