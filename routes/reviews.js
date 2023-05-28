const express = require('express')
const {getReviews, getSingleReview} = require('../controllers/reviews')
const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResults')
const {protect, authorize} = require('../middleware/auth')

const router = express.Router({mergeParams: true})

router.route('/')
    .get([advancedResults(Review, 'bootcamp', 'name description'), getReviews])

router.route('/:id')
    .get(getSingleReview)

module.exports = router