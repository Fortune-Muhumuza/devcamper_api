const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get Reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {
    const id = req.params.bootcampId
    if (id) {
        const reviews = await Review.find({bootcamp: id})
        return res.status(200)
            .json({
                status: true,
                count: reviews.length,
                data: reviews
            })
    }

    return res
        .status(200)
        .json(res.advancedResults)
})

// @desc    Get  Single Review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getSingleReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
        .populate('bootcamp', 'name description')

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404))
    }

    return res.status(200)
        .json({
            success: true,
            data: review
        })
})


// @desc    Add Review
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Private/user
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body)

    return res.status(201)
        .json({
            success: true,
            data: review
        })
})

// @desc    Update Review
// @route   PUT /api/v1/reviews/:id
// @access  Private/user
exports.updateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`No reviews with id of ${req.params.id}`, 404))
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review with id of ${req.params.id}`, 404))
    }

    const newReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    return res.status(200)
        .json({
            success: true,
            data: newReview
        })
})