const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require('../utils/errorResponse')
const NodeGeocoder = require('node-geocoder');
const asyncHandler = require('../middleware/async')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    console.log(req.query)
    const reqQuery = {...req.query}
    const removedFields = ['select', 'sort', 'page', 'limit']
    removedFields.forEach(param => delete reqQuery[param])

    const rawQuery = JSON.stringify(reqQuery)
        .replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`)

    const actualQuery = JSON.parse(rawQuery)

    const query =  Bootcamp.find(actualQuery)
        .populate('courses', 'title description _id')

    if (req.query.select) {
        const fields = req.query.select.split(',')
            .join(' ')
        query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',')
            .join(' ')
        query.sort(sortBy)
    } else {
        query.sort('-createdAt')
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit) || 100;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments();

    query.skip(startIndex)
        .limit(limit)

    const data = await query

    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        success: true,
        data,
        count: data.length,
        pagination
    })
})

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
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
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