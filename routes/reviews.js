const express = require('express')
const {getReviews, getSingleReview, addReview, updateReview, deleteReview} = require('../controllers/reviews')
const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResults')
const {protect, authorize} = require('../middleware/auth')

const router = express.Router({mergeParams: true})

router.route('/')
    .get([advancedResults(Review, 'bootcamp', 'name description'), getReviews])
    .post([protect, authorize('user', 'admin'), addReview])

router.route('/:id')
    .get(getSingleReview)
    .put([protect, authorize('user', 'admin'), updateReview])
    .delete([protect, authorize('user', 'admin'), deleteReview])

module.exports = router