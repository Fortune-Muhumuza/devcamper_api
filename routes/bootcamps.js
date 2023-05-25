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
const {protect} = require("../middleware/auth")


const courseRouter = require('./courses')

const router = express.Router()

router.use('/:bootcampId/courses', courseRouter)

router.route('/:radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id/photo')
    .put([protect, bootcampPhotoUpload])

router.route('/')
    .get([protect, advancedResults(Bootcamp, 'courses', 'title description'), getBootcamps])
    .post([protect, createBootcamp])

router.route('/:id')
    .get(getBootcamp)
    .put([protect, updateBootcamp])
    .delete([protect, deleteBootcamp])

module.exports = router