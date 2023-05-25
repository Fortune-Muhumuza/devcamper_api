const express = require("express")
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamps")
const Bootcamp = require("../models/Bootcamp")
const advancedResults = require("../middleware/advancedResults")
const {protect, authorize} = require("../middleware/auth")
const bootcampLoader = require("../middleware/bootcamp/bootcampLoader")


const courseRouter = require('./courses')

const router = express.Router()

router.use('/:bootcampId/courses', courseRouter)

router.route('/:radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id/photo')
    .put([protect, authorize('publisher', 'admin'), bootcampLoader, bootcampPhotoUpload])

router.route('/')
    .get([advancedResults(Bootcamp, 'courses', 'title description'), getBootcamps])
    .post([protect,authorize('publisher', 'admin'),  createBootcamp])

router.route('/:id')
    .get(getBootcamp)
    .put([protect, authorize('publisher', 'admin'), bootcampLoader, updateBootcamp])
    .delete([protect, authorize('publisher', 'admin'), bootcampLoader, deleteBootcamp])

module.exports = router