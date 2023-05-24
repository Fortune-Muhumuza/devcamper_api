const path = require("path")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require('../utils/errorResponse')
const NodeGeocoder = require('node-geocoder');
const asyncHandler = require('../middleware/async')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => res.status(200).json(res.advancedResults))

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.findById(req.params.id)
    if (!data) {
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data})
})

// @desc    Get Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data
    })
})

// @desc    Update single bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const data = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!data) {
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200)
            .json({success: true, data})
    }
)

// @desc    Delete single bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!data) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200)
        .json({success: true})
})

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const geocoderOptions = {
        provider: process.env.GEOCODER_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null
    }
    const geocoder = NodeGeocoder(geocoderOptions)

    const {zipcode, distance} = req.params
    const location = await geocoder.geocode(zipcode)
    const latitude = location[0].latitude;
    const longitude = location[0].longitude
    const radius = distance / 3963
    const bookcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [longitude, latitude], radius
                ]
            }
        }
    })


    res.status(200)
        .json({
            success: true,
            count: bookcamps.length,
            data: bookcamps
        })
})

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.findById(req.params.id)

    if (!data) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400))
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload a file', 400))
    }

    const file = req.files.file
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload image file', 400))
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    file.name = `photo_${data._id}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
        if (error) {
            console.error(error)
            return next(new ErrorResponse('Problem with file upload', 500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200)
            .json({success: true, data: file.name})
    })
})