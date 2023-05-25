const express = require('express')
const {getCourses, getCourse, addCourse, updateCourse, deleteCourse} = require('../controllers/courses')
const Course = require("../models/Course")
const advancedResults = require("../middleware/advancedResults")
const {protect, authorize} = require("../middleware/auth")
const courseLoader = require("../middleware/course/courseLoader")
const bootcampLoader = require("../middleware/bootcamp/bootcampLoader")

const router = express.Router({mergeParams: true})

router.route('/')
    .get([advancedResults(Course, 'bootcamp', 'name description'), getCourses])
    .post([protect, authorize('publisher', 'admin'), bootcampLoader, addCourse])

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), courseLoader, updateCourse)
    .delete(protect, authorize('publisher', 'admin'), courseLoader, deleteCourse)

module.exports = router