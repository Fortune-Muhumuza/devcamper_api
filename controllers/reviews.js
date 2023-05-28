const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get course
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {
    const id = req.params.bootcampId
    if (id) {
        const reviews = await Review.find({bootcamp: id})
        return res.status(200)
            .json({
                status: true,
                count: reviews.count(),
                data: reviews
            })
    }

    return res
        .status(200)
        .json(res.advancedResults)
})