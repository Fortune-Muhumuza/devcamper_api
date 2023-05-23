const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const Course = require("../models/Course")
const Bootcamp = require('../models/Bootcamp')

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

// @desc    Get course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)
        .populate('bootcamp', 'name description')

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404))
    }

    res.status(200)
        .json({
            success: true,
            data: course
        })
})

// @desc    Create course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    const bootcampId = req.params.bootcampId
    const courseData = {...req.body, bootcamp: bootcampId}

    const bootcamp = await Bootcamp.findById(bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id ${bootcampId}`, 404))
    }

    const course = await Course.create(courseData)
    const newCourse = await Course.findById(course._id)
        .populate('bootcamp', 'title description _id')

    res.status(301)
        .json({
            success: true,
            data: newCourse
        })
})